import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Golfcar } from 'src/app/models/golfcar';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { errorMessage, successDialog } from 'src/app/functions/alerts';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-golfcar',
  templateUrl: './golfcar.component.html',
  styleUrls: ['./golfcar.component.css']
})
export class GolfcarComponent implements OnInit {
  crGolfCarForm : FormGroup;
  uGolfCarForm : FormGroup;
  golfcar: Golfcar;
  golfcars: Golfcar[] = [];
  clickedGolfCar: Golfcar;
  dataSource!: MatTableDataSource<Golfcar>;
  displayedColumns: string[];
  response: any;
  constructor(private fb: FormBuilder, private authservice: AuthService, private router: Router){
    this.crForm();
    this.uForm();
  }
  ngOnInit(): void{
    this.authToken();
    this.isAdmin();
    this.getGolfCarData();
  }
  isAdmin(){
    this.authservice.isAdmin().subscribe(() => {
      this.displayedColumns = ['golfcar', 'number', 'status', 'color', 'model', 'year', 'details', 'delete']
    }, (error: HttpErrorResponse)=>{
      this.displayedColumns = ['golfcar', 'number', 'status', 'color', 'model', 'year', 'details']
      console.log(error)
    })
  }
  authToken(){
    this.authservice.AuthToken().subscribe(() => {
    }, (error: HttpErrorResponse)=>{
      this.router.navigate(['/Login'])
      console.log('Error in the auth')
      console.log(error)
    })
  } 
  create(): void{
    if(this.crGolfCarForm.invalid){
      return Object.values(this.crGolfCarForm.controls).forEach(control => 
        control.markAsTouched());
    }else{
      this.setcrGolfCar();
      this.authservice.createGolfCar(this.golfcar).subscribe((response) => {
        this.response = response.message;
        successDialog(this.response).then(() => {
        })
        this.clearForm(this.crGolfCarForm);
      }, (error: HttpErrorResponse)=>{
        errorMessage('Incorrect data');
        console.log(error);
      })
    }
  }
  update(): void{
    this.setupdGolfCar();
    console.log(this.golfcar);
    this.authservice.updateGolfCar(this.golfcar).subscribe((response) => {
      this.response = response.message;
      successDialog(this.response).then(() => {
      })
      this.clearForm(this.uGolfCarForm);
    }, (error: HttpErrorResponse)=>{
      errorMessage('Incorrect data');
      console.log(error);
    })
  }
  delete(code: string){
    this.authservice.deleteGolfCar(code).subscribe((response) => {
      this.response = response.message;
      successDialog(this.response).then(() => {
      })
      this.ngOnInit();
    }, (error: HttpErrorResponse)=>{
      errorMessage('Incorrect data');
      console.log(error);
    })
  }
  logOut(){
    this.authservice.clearStorage();
    this.ngOnInit();
  }
  clearForm(form: FormGroup){
    form.reset();
    for (const key in form.controls) {
      form.get(key).setErrors(null);
    }
    this.ngOnInit();
  }
  crForm(): void{
    this.crGolfCarForm = this.fb.group({ 
      number: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(4), Validators.pattern("^[0-9]*$")]],
      status: ['', []],
      color: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]],
      model: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      year: ['', [Validators.required, Validators.maxLength(4), Validators.pattern("^[0-9]*$")]]
    })
  }
  uForm(): void{
    this.uGolfCarForm = this.fb.group({ 
      codegc: ['', []],
      number: ['', []],
      details: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      color: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(3)]],
      model: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(20)]],
      year: ['', [Validators.required, Validators.maxLength(4), Validators.pattern("^[0-9]*$")]]
  })
  }
  setData(): void{
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.golfcars;
  }
  getGolfCarData(): void{
    this.authservice.showGolfCars().subscribe((response)=>{
      this.golfcars = response.GolfCars
      this.setData();
    })
  }
  setcrGolfCar(): void{
    this.golfcar = {
      number: this.crGolfCarForm.get('number').value,
      status: 'Libre sin uso',
      color: this.crGolfCarForm.get('color').value,
      model: this.crGolfCarForm.get('model').value,
      details: 'Carro de golf nuevo',
      year: this.crGolfCarForm.get('year').value
    };
  }
  setupdGolfCar(): void{
    this.golfcar = {
      codegc: this.clickedGolfCar.codegc,
      details: this.uGolfCarForm.get('details').value,
      color: this.uGolfCarForm.get('color').value,
      model: this.uGolfCarForm.get('model').value,
      year: this.uGolfCarForm.get('year').value
    };
  }
  GolfCar(golfcar: Golfcar): void{
    this.clickedGolfCar = golfcar;
  }
}