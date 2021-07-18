import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { errorMessage, successDialog } from 'src/app/functions/alerts';
import { Employee } from 'src/app/models/employee';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employeeForm : FormGroup;
  employee: Employee;
  response: any;
  hide = true;
  constructor(private fb: FormBuilder, private authservice: AuthService){
    this.createForm();
  }
  ngOnInit(): void{
    this.authservice.AuthToken().subscribe((response) => {
      this.response = response;
    }, (error: HttpErrorResponse)=>{
      console.log('Error in the auth');
    })
    this.authservice.isAdmin().subscribe((response) => {
      this.response = response
    }, (error: HttpErrorResponse)=>{
      this.hide = false;
      console.log('Error in the auth');
    })
  }

  create(): void{
    if(this.employeeForm.invalid){
      return Object.values(this.employeeForm.controls).forEach(control => 
        control.markAsTouched());
    }else{
      this.setEmployee();
      console.log(this.employee);
      /*this.authservice.createEmployee(this.employee).subscribe((response) => {
        this.response = response;
        console.log(response);
        this.authservice.storageToken(response.token.token);
        successDialog('Employee was created.').then(() => {
        })
      }, (error: HttpErrorResponse)=>{
        errorMessage('Incorrect data.');
        console.log(error);
      })*/
    }
  }
  logOut(){
    this.authservice.clearStorage();
    this.ngOnInit();
  }

  createForm(): void{
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required]],
      
    })
  }

  getNameValidate(){
    return (
      this.employeeForm.get('name').invalid && this.employeeForm.get('name').touched
    );
  }

  /*getLastnameValidate(){
    return (
      this.employeeForm.get('password').invalid && this.employeeForm.get('password').touched
    );
  }

  getGenderValidate(){
    return (
      this.employeeForm.get('gender').invalid && this.employeeForm.get('gender').touched
    );
  }

  getNumberValidate(){
    return (
      this.employeeForm.get('password').invalid && this.employeeForm.get('password').touched
    );
  }*/

  setEmployee(): void {
    this.employee = {
      name: this.employeeForm.get('name').value,
      //last_name: this.employeeForm.get('password').value,
      last_name: 'asdhilasd',
      //gender: this.employeeForm.get('gender').value,
      address: 'sdfdsf',
      gender: 0,
      //number: this.employeeForm.get('number').value,
      number: 12345678,
      area_c: 'E98T8R1LWo'
    };
  }
}

