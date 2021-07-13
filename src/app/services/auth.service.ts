import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; 
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  helper = new JwtHelperService();
  apiUrl = environment.apiUrl;
  headers = new Headers();
  token : any;

  constructor(private http: HttpClient){
   }

   AuthToken():Observable<any>{
    return this.http.get(`${this.apiUrl}Auth/Token`);
  }

   LogIn(user:User):Observable<any>{
    return this.http.post(`${this.apiUrl}Auth/LogIn`, user);
  }

  showUsers():Observable<any>{
    return this.http.get(`${this.apiUrl}User/showusers`);
  }

  storageToken(token){
    localStorage.setItem('token', token);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  clearStorage(){
    localStorage.clear();
    console.log('Storage was clear');
  }

  isAdmin(){
    
  }

  isUser(){

  }
}
