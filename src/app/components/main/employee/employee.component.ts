import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { errorMessage, successDialog } from 'src/app/functions/alerts';
import { Area } from 'src/app/models/area';
import { Employee } from 'src/app/models/employee';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  crEmployeeForm : FormGroup;
  uEmployeeForm : FormGroup;
  employee: Employee;
  employees: Employee[] = [];
  clickedEmployee: Employee;
  areas: Area[] = [];
  dataSource!: MatTableDataSource<Employee>;
  displayedColumns: string[];
  response: any;
  hide = true;
  constructor(private fb: FormBuilder, private authservice: AuthService, private router: Router){
    this.crForm();
    this.uForm();
  }
  ngOnInit(): void{
    this.getEmployeesData();
    this.getAreasData();
    this.authToken();
    this.isAdmin();
  }
  isAdmin(){
    this.authservice.isAdmin().subscribe(() => {
      this.displayedColumns = ['employee', 'name', 'last_name', 'gender', 'area', 'number','delete'];
    }, (error: HttpErrorResponse)=>{
      this.hide = false;
      this.displayedColumns = ['employee', 'name', 'last_name', 'gender', 'area', 'number'];
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
    if(this.crEmployeeForm.invalid){
      return Object.values(this.crEmployeeForm.controls).forEach(control => 
        control.markAsTouched());
    }else{
      this.setcrEmployee();
      this.authservice.createEmployee(this.employee).subscribe((response) => {
        this.response = response.message;
        successDialog(this.response).then(() => {
        })
        this.clearForm(this.crEmployeeForm);
      }, (error: HttpErrorResponse)=>{
        errorMessage('Incorrect data');
        console.log(error);
      })
    }
  }
  update(): void{
    this.setupdEmployee();
    this.authservice.updateEmployee(this.employee).subscribe((response) => {
      this.response = response.message;
      successDialog(this.response).then(() => {
      })
      this.clearForm(this.uEmployeeForm);
    }, (error: HttpErrorResponse)=>{
      errorMessage('Incorrect data');
      console.log(error);
    })
  }
  delete(code: string){
    this.authservice.deleteEmployee(code).subscribe((response) => {
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
    this.crEmployeeForm = this.fb.group({ 
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      last_name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      gender: ['', [Validators.required, Validators.maxLength(1)]],
      address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(254)]],
      number: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(15), Validators.pattern("^[0-9]*$")]],
      area: ['', [Validators.required, Validators.maxLength(10)]]
    })
  }
  uForm(): void{
    this.uEmployeeForm = this.fb.group({ 
      codee: ['', []],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      last_name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      number: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(15), Validators.pattern("^[0-9]*$")]],
      area: ['', [Validators.required, Validators.maxLength(10)]]
  })
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
  getAreasData(): void{
    this.authservice.showAreas().subscribe((response)=>{
      this.areas = response.Areas;
    })
  }
  setcrEmployee(): void{
    this.employee = {
      name: this.crEmployeeForm.get('name').value,
      last_name: this.crEmployeeForm.get('last_name').value,
      gender: this.crEmployeeForm.get('gender').value,
      address: this.crEmployeeForm.get('address').value,
      number: this.crEmployeeForm.get('number').value,
      area_c: this.crEmployeeForm.get('area').value
    };
  }
  setupdEmployee(): void{
    this.employee = {
      codee: this.clickedEmployee.employee,
      name: this.uEmployeeForm.get('name').value,
      last_name: this.uEmployeeForm.get('last_name').value,
      number: this.uEmployeeForm.get('number').value,
      area_c: this.uEmployeeForm.get('area').value
    };
  }
  Employee(employee: Employee): void{
    this.clickedEmployee = employee;
  }
}