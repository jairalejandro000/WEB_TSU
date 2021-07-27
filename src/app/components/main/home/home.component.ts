import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { convertToObject } from 'typescript';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  rol: string;
  hideA = true;
  hideB = true;
  response: any;
  status: any;
  constructor(private authservice: AuthService, private router: Router) { 
  }

  ngOnInit(): void {
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
    this.authservice.AuthToken().subscribe((response) => {
    }, (error: HttpErrorResponse)=>{
      this.router.navigate['/Login'];
      console.log('Error in the auth');
      console.log(error);
    })
  } 
  logOut(){
    this.authservice.clearStorage();
    this.authToken();
  }
}
