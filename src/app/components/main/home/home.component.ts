import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

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
    this.authservice.AuthToken().subscribe((response) => {
      this.response = response;
    }, (error: HttpErrorResponse)=>{
      console.log('Error in the auth');
    })
    this.authservice.isAdmin().subscribe((response) => {
      this.response = response
    }, (error: HttpErrorResponse)=>{
      this.hideA = false;
      console.log('Error in the auth');
    })
    this.authservice.isUser().subscribe((response) => {
      this.response = response
    }, (error: HttpErrorResponse)=>{
      this.hideB = false;
      console.log('Error in the auth');
    })
  }
  logOut(){
    this.authservice.clearStorage();
    this.ngOnInit();
  }
}
