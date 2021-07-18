import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { errorMessage, successDialog } from 'src/app/functions/alerts';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

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

  constructor(private fb: FormBuilder, private authservice: AuthService, private router: Router){
    this.createForm();
  }
  ngOnInit(): void{
    this.authservice.AuthToken().subscribe((response) => {
      this.response = response;
      this.router.navigate(['/Home']);
    }, (error: HttpErrorResponse)=>{
      console.log('Error in the auth');
    })
  }

  logIn(): void{
    this.authservice.clearStorage();
    if (this.loginForm.invalid){
      return Object.values(this.loginForm.controls).forEach(control => 
        control.markAsTouched());
    }else{
      this.setUser();
      this.authservice.logIn(this.user).subscribe((response) => {
        this.response = response;
        console.log(response);
        this.authservice.storageToken(response.token.token);
        successDialog('Succesful login.').then(() => {
          this.router.navigate(['/Home']);
        })
      }, (error: HttpErrorResponse)=>{
        errorMessage('Incorrect email or password.');
        console.log(error);
      })
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

  setUser(): void {
    this.user = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    };
  }
}

