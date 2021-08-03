import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { errorMessage, successDialog } from 'src/app/functions/alerts';
import { Employee } from 'src/app/models/employee';
import { AuthService } from 'src/app/services/auth.service';
import { Extension } from 'src/app/models/extension';


@Component({
  selector: 'app-extension',
  templateUrl: './extension.component.html',
  styleUrls: ['./extension.component.css']
})
export class ExtensionComponent implements OnInit {
  crExtensionForm : FormGroup;
  uExtensionForm : FormGroup;
  extension: Extension;
  extensions: Extension[] = [];
  clickedExtension: Extension;
  employees: Employee[] = [];
  dataSource!: MatTableDataSource<Extension>;
  displayedColumns: string[];
  response: any;
  hide = true;
  constructor(private fb: FormBuilder, private authservice: AuthService, private router: Router){
    this.crForm();
    this.uForm();
  }
  ngOnInit(): void{
    this.getExtensionsData();
    this.getEmployeesData();
    this.authToken();
    this.isAdmin();
  }
  isAdmin(){
    this.authservice.isAdmin().subscribe(() => {
      this.displayedColumns = ['extension', 'employee', 'number', 'area', 'delete'];
    }, (error: HttpErrorResponse)=>{
      this.hide = false;
      this.displayedColumns = ['extension', 'employee', 'number', 'area'];
      console.log(error);
    })
  }
  authToken(){
    this.authservice.AuthToken().subscribe(() => {
    }, (error: HttpErrorResponse)=>{
      this.router.navigate['/Login'];
      console.log('Error in the auth');
      console.log(error);
    })
  } 
  create(): void{
    if(this.crExtensionForm.invalid){
      return Object.values(this.crExtensionForm.controls).forEach(control => 
        control.markAsTouched());
    }else{
      this.setcrExtension();
      this.authservice.createExtension(this.extension).subscribe((response) => {
        this.response = response.message;
        successDialog(this.response).then(() => {
        })
        this.clearForm(this.crExtensionForm);
      }, (error: HttpErrorResponse)=>{
        errorMessage('Incorrect data');
        console.log(error);
      })
    }
  }
  update(): void{
    this.setupdExtension();
    this.authservice.updateExtension(this.extension).subscribe((response) => {
      this.response = response.message;
      successDialog(this.response).then(() => {
      })
      this.clearForm(this.uExtensionForm);
    }, (error: HttpErrorResponse)=>{
      errorMessage('Incorrect data');
      console.log(error);
    })
  }
  delete(code: string){
    this.authservice.deleteExtension(code).subscribe((response) => {
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
    this.crExtensionForm = this.fb.group({ 
      employee_c: ['', [Validators.required, Validators.maxLength(100)]],
      extension: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]]
    })
  }
  uForm(): void{
    this.uExtensionForm = this.fb.group({ 
      codex: ['', []],
      employee_c: ['', [Validators.required]],
      extension: ['', []]
  })
  }
  setData(): void{
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.extensions;
  }
  getExtensionsData(): void{
    this.authservice.showExtensions().subscribe((response)=>{
      this.extensions = response.Extensions;
      this.setData();
    })
  }
  getEmployeesData(): void{
    this.authservice.showEmployees().subscribe((response)=>{
      this.employees = response.Employees;
    })
  }
  setcrExtension(): void{
    this.extension = {
      employee_c: this.crExtensionForm.get('employee_c').value,
      extension: this.crExtensionForm.get('extension').value,
    };
  }
  setupdExtension(): void{
    this.extension = {
      codex: this.clickedExtension.extension,
      employee_c: this.uExtensionForm.get('employee_c').value,
      extension: this.clickedExtension.number,
    };
  }
  Extension(extension: Extension): void{
    this.clickedExtension = extension;
  }
}