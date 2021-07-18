import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './components/main/employee/employee.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/main/home/home.component';
import { PagenotfoundComponent } from './components/others/pagenotfound/pagenotfound.component';

const routes: Routes = [
  {path: 'Login', component: LoginComponent},
  {path: '', redirectTo: '/Login', pathMatch: 'full'},
  {path: 'Home', component: HomeComponent},
  {path: 'Employee', component: EmployeeComponent},
  {path: '**', component:PagenotfoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
