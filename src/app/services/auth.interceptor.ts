import { 
  HttpErrorResponse, 
  HttpEvent, 
  HttpHandler, 
  HttpInterceptor, 
  HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root'})

export class AuthInterceptor implements HttpInterceptor{
  
  constructor(private authservice: AuthService, private router: Router) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  const token = this.authservice.getToken();
  if(token){
    const reqClone = req.clone({
      setHeaders:{
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(reqClone).pipe(
        catchError((error: HttpErrorResponse) => throwError(this.handleError(error))));
    }else{
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => throwError(this.handleError(error))));
    }
  }
  handleError(error: HttpErrorResponse){
    if(error.status == 401){
      this.authservice.clearStorage();
      this.router.navigate(['/Login']);
    }
    console.error('Authentication failed', error);
  }
}
    
