import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
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
  cEmployeeForm : FormGroup;
  employee: Employee;
  employees: Employee[] = [];
  dataSource!: MatTableDataSource<Employee>;
  displayedColumns: string[] = ['name', 'last_name', 'gender', 'number', 'area'];
  response: any;
  hideA = true;
  hideB = true; 
  constructor(private fb: FormBuilder, private authservice: AuthService, private router: Router){
    this.cForm();
  }
  ngOnInit(): void{
    this.getEmployeesData();
    this.authToken();
    this.isAdmin();
    this.isUser();
  }
  isAdmin(){
    this.authservice.isAdmin().subscribe(() => {
    }, (error: HttpErrorResponse)=>{
      this.hideA = false;
      console.log(error);
    })
  }
  isUser(){
    this.authservice.isUser().subscribe(() => {
    }, (error: HttpErrorResponse)=>{
      this.hideB = false;
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
    if(this.cEmployeeForm.invalid){
      return Object.values(this.cEmployeeForm.controls).forEach(control => 
        control.markAsTouched());
    }else{
      this.setEmployee();
      console.log(this.employee);
      this.authservice.createEmployee(this.employee).subscribe((response) => {
        this.response = response.message;
        successDialog(this.response).then(() => {
        })
      }, (error: HttpErrorResponse)=>{
        errorMessage('Incorrect values data');
        console.log(error);
      })
    }
  }
  logOut(){
    this.authservice.clearStorage();
    this.ngOnInit();
  }
  cForm(): void{
    this.cEmployeeForm = this.fb.group({ 
      name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      address: ['', [Validators.required]],
      number: ['', [Validators.required]],
      area: ['', [Validators.required]]
  })
  }
  getNameValidate(){
    return (
      this.cEmployeeForm.get('name').invalid && this.cEmployeeForm.get('name').touched
    );
  }
  getLastNameValidate(){
    return (
      this.cEmployeeForm.get('last_name').invalid && this.cEmployeeForm.get('last_name').touched
    );
  }
  getAreaValidate(){
    return (
      this.cEmployeeForm.get('area').invalid && this.cEmployeeForm.get('area').touched
    );
  }
  getNumberValidate(){
    return (
      this.cEmployeeForm.get('number').invalid && this.cEmployeeForm.get('number').touched
    );
  }
  getAddressValidate(){
    return (
      this.cEmployeeForm.get('address').invalid && this.cEmployeeForm.get('address').touched
    );
  }
  getGenderValidate(){
    return (
      this.cEmployeeForm.get('gender').invalid && this.cEmployeeForm.get('gender').touched
    );
  }
  setData(): void{
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.employees;
  }
  getEmployeesData(): void{
    this.authservice.showEmployees().subscribe((response)=>{
      this.employees = response.Employees
      this.setData();
    })
  }
  setEmployee(): void{
    this.employee = {
      name: this.cEmployeeForm.get('name').value,
      last_name: this.cEmployeeForm.get('last_name').value,
      gender: this.cEmployeeForm.get('gender').value,
      address: this.cEmployeeForm.get('address').value,
      number: this.cEmployeeForm.get('number').value,
      area_c: this.cEmployeeForm.get('area').value
    };
  }
}

