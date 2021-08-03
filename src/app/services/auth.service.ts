import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; 
import { Area } from '../models/area';
import { Employee } from '../models/employee';
import { Extension } from '../models/extension';
import { Golfcar } from '../models/golfcar';
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
  isAdmin():Observable<any>{
    return this.http.get(`${this.apiUrl}Auth/isAdmin`);
  }
  isUser():Observable<any>{
    return this.http.get(`${this.apiUrl}Auth/isUser`);
  }
  logIn(user:User):Observable<any>{
    return this.http.post(`${this.apiUrl}Auth/logIn`, user);
  }
  
  createEmployee(employee:Employee):Observable<any>{
    return this.http.post(`${this.apiUrl}Auth/createEmployee`, employee);
  }
  updateEmployee(employee:Employee):Observable<any>{
    return this.http.put(`${this.apiUrl}Employee/update/${employee.codee}`, employee);
  }
  deleteEmployee(code: string):Observable<any>{
    return this.http.delete(`${this.apiUrl}Employee/delete/${code}`);
  }
  showEmployees():Observable<any>{
    return this.http.get(`${this.apiUrl}Employee/showall`);
  }

  createExtension(extension:Extension):Observable<any>{
    return this.http.post(`${this.apiUrl}Extension/create`, extension);
  }
  updateExtension(extension:Extension):Observable<any>{
    return this.http.put(`${this.apiUrl}Extension/update/${extension.codex}`, extension);
  }
  deleteExtension(code: string):Observable<any>{
    return this.http.delete(`${this.apiUrl}Extension/delete/${code}`);
  }
  showExtensions():Observable<any>{
    return this.http.get(`${this.apiUrl}Extension/showall`);
  }

  createGolfCar(golfcar:Golfcar):Observable<any>{
    return this.http.post(`${this.apiUrl}GolfCar/create`, golfcar);
  }
  updateGolfCar(golfcar:Golfcar):Observable<any>{
    return this.http.put(`${this.apiUrl}GolfCar/update/${golfcar.codegc}`, golfcar);
  }
  deleteGolfCar(code: string):Observable<any>{
    return this.http.delete(`${this.apiUrl}GolfCar/delete/${code}`);
  }
  showEGolfCars():Observable<any>{
    return this.http.get(`${this.apiUrl}GolfCar/showall`);
  }

  createArea(area:Area):Observable<any>{
    return this.http.post(`${this.apiUrl}Area/create`, area);
  }
  updateArea(area:Area):Observable<any>{
    return this.http.put(`${this.apiUrl}Area/update/${area.codea}`, area);
  }
  deleteArea(code: string):Observable<any>{
    return this.http.delete(`${this.apiUrl}Area/delete/${code}`);
  }
  showAreas():Observable<any>{
    return this.http.get(`${this.apiUrl}Area/showall`);
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
}
