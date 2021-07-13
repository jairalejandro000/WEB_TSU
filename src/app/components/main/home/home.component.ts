import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { errorMessage, successDialog } from 'src/app/functions/alerts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  rol: string;
  hide = false;
  response: any;

  constructor(private authservice: AuthService, private router: Router) { 
  }

  ngOnInit(): void {
    this.authservice.AuthToken().subscribe((response) => {
      this.response = response;
      console.log(response);
    }, (error: HttpErrorResponse)=>{
      console.log(error);
    })
  }
}
