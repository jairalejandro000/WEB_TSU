import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { errorMessage, successDialog } from 'src/app/functions/alerts';
import { Area } from 'src/app/models/area';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {
  crAreaForm : FormGroup;
  uAreaForm : FormGroup;
  area: Area;
  areas: Area[] = [];
  clickedArea: Area;
  dataSource!: MatTableDataSource<Area>;
  displayedColumns: string[];
  response: any;
  constructor(private fb: FormBuilder, private authservice: AuthService, private router: Router){
    this.crForm();
    this.uForm();
  }
  ngOnInit(): void{
    this.authToken();
    this.isAdmin();
    this.getAreaData();
  }
  isAdmin(){
    this.authservice.isAdmin().subscribe(() => {
      this.displayedColumns = ['area', 'name', 'description', 'delete']
    }, (error: HttpErrorResponse)=>{
      this.router.navigate(['/Home'])
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
    if(this.crAreaForm.invalid){
      return Object.values(this.crAreaForm.controls).forEach(control => 
        control.markAsTouched());
    }else{
      this.setcrArea();
      this.authservice.createArea(this.area).subscribe((response) => {
        this.response = response.message;
        successDialog(this.response).then(() => {
        })
        this.clearForm(this.crAreaForm);
      }, (error: HttpErrorResponse)=>{
        errorMessage('Incorrect data');
        console.log(error);
      })
    }
  }
  update(): void{
    this.setupdArea();
    this.authservice.updateArea(this.area).subscribe((response) => {
      this.response = response.message;
      successDialog(this.response).then(() => {
      })
      this.clearForm(this.uAreaForm);
    }, (error: HttpErrorResponse)=>{
      errorMessage('Incorrect data');
      console.log(error);
    })
  }
  delete(code: string){
    this.authservice.deleteArea(code).subscribe((response) => {
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
    this.crAreaForm = this.fb.group({ 
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]]
    })
  }
  uForm(): void{
    this.uAreaForm = this.fb.group({ 
      codea: ['', []],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]]
  })
  }
  setData(): void{
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.areas;
  }
  getAreaData(): void{
    this.authservice.showAreas().subscribe((response)=>{
      this.areas = response.Areas
      this.setData();
    })
  }
  setcrArea(): void{
    this.area = {
      name: this.crAreaForm.get('name').value,
      description: this.crAreaForm.get('description').value
    };
  }
  setupdArea(): void{
    this.area = {
      codea: this.clickedArea.codea,
      name: this.uAreaForm.get('name').value,
      description: this.uAreaForm.get('description').value,
    };
  }
  Area(area: Area): void{
    this.clickedArea = area;
  }
}