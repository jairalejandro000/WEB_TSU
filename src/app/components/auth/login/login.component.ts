import { Component, OnInit } from '@angular/core';
import {FormControl, Validators, FormGroup, FormBuilder} from '@angular/forms';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/sevices/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm : FormGroup;
  hide = true;
  user: User;
  response: any;

  constructor(private fb: FormBuilder, private authservice: AuthService){
    this.createForm();
  }
  ngOnInit(): void{
  }

  logIn(): void{
    if (this.loginForm.invalid){
      return Object.values(this.loginForm.controls).forEach(control => 
        control.markAsTouched());
    }else{
      this.setUser();
      console.log(this.user);
      this.authservice.LogIn(this.user).subscribe((data:any) => {
        this.response = data;
        console.log(this.response);
      }, error =>
      console.log(error)
      );
    }
  }

  createForm(): void{
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]],
      password: ['', [Validators.required]]
    })
  }

  getEmailValidate(){
    return (
      this.loginForm.get('email').invalid && this.loginForm.get('email').touched
    );
  }

  getPasswordValidate(){
    return (
      this.loginForm.get('password').invalid && this.loginForm.get('password').touched
    );
  }

  /*GETERRORS
  getErrorMessageEmail() {
    if (this.email.hasError('required')) {
      return 'You must enter a email';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  getErrorMessagePassword() {
    if (this.password.hasError('required')) {
      return 'You must enter a password';
    }
  }*/

  setUser(): void {
    this.user= {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    };
  }
}

