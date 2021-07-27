import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styleUrls: ['./pagenotfound.component.css']
})
export class PagenotfoundComponent implements OnInit {

  constructor(private authservice: AuthService, private router: Router) { }

  ngOnInit(): void{
    this.authToken();
  }
  authToken(){
    this.authservice.AuthToken().subscribe(() => {
    }, (error: HttpErrorResponse)=>{
      this.router.navigate['/Login'];
      console.log('Error in the auth');
      console.log(error);
    })
  } 
}
