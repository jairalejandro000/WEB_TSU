import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { errorMessage, successDialog } from 'src/app/functions/alerts';
import { Employee } from 'src/app/models/employee';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  crUserForm : FormGroup;
  uUserForm : FormGroup;
  user: User;
  users: User[] = [];
  clickedUser: User;
  employees: Employee[] = [];
  dataSource!: MatTableDataSource<User>;
  displayedColumns: string[];
  response: any;
  hidep = true;
  hidepp = true;
  constructor(private fb: FormBuilder, private authservice: AuthService, private router: Router){
    this.crForm();
    this.uForm();
  }
  ngOnInit(): void{
    this.authToken();
    this.isAdmin();
    this.getUsersData();
    this.getEmployeesData();
  }
  isAdmin(){
    this.authservice.isAdmin().subscribe(() => {
      this.displayedColumns = ['user', 'employee', 'username', 'email', 'rol','delete']
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
    if(this.crUserForm.invalid){
      return Object.values(this.crUserForm.controls).forEach(control => 
        control.markAsTouched());
    }else{
      this.setcrUser();
      this.authservice.createUser(this.user).subscribe((response) => {
        this.response = response.message;
        successDialog(this.response).then(() => {
        })
        this.clearForm(this.crUserForm);
      }, (error: HttpErrorResponse)=>{
        errorMessage('Incorrect data');
        console.log(error);
      })
    }
  }
  update(): void{
    this.setupdUser();
    this.authservice.updateUser(this.user).subscribe((response) => {
      this.response = response.message;
      successDialog(this.response).then(() => {
      })
      this.clearForm(this.uUserForm);
    }, (error: HttpErrorResponse)=>{
      errorMessage('Incorrect data');
      console.log(error);
    })
  }
  delete(code: string){
    this.authservice.deleteUser(code).subscribe((response) => {
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
    this.crUserForm = this.fb.group({ 
      employee_c: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'), Validators.minLength(11), Validators.maxLength(40)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      rol: ['', [Validators.required]]
    })
  }
  uForm(): void{
    this.uUserForm = this.fb.group({ 
      codeu: ['', []],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      rol: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]]
  })
  }
  setData(): void{
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.users;
  }
  getUsersData(): void{
    this.authservice.showUsers().subscribe((response)=>{
      this.users = response.Users
      this.setData();
    })
  }
  getEmployeesData(): void{
    this.authservice.showUEmployees().subscribe((response)=>{
      this.employees = response.Employees;
    })
  }
  setcrUser(): void{
    this.user = {
      employee_c: this.crUserForm.get('employee_c').value,
      username: this.crUserForm.get('username').value,
      email: this.crUserForm.get('email').value,
      password: this.crUserForm.get('password').value,
      rol: this.crUserForm.get('rol').value
    };
  }
  setupdUser(): void{
    this.user = {
      codeu: this.clickedUser.codeu,
      password: this.uUserForm.get('password').value,
      rol: this.uUserForm.get('rol').value
    };
  }
  User(user: User): void{
    this.clickedUser = user;
  }
}