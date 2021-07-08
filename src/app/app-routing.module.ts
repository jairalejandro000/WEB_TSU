import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistereComponent } from './components/admin/employee/registere/registere.component';
import { RegistermComponent } from './components/admin/member/registerm/registerm.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/main/home/home.component';
import { PagenotfoundComponent } from './components/others/pagenotfound/pagenotfound.component';

const routes: Routes = [
  {path: 'Login', component: LoginComponent},
  {path: '', redirectTo: '/Login', pathMatch: 'full'},
  {path: 'Home', component: HomeComponent},
  {path: 'Member/Register', component: RegistermComponent},
  {path: 'Member/Update', component: RegistermComponent},
  {path: 'Member/Delete', component: RegistermComponent},
  {path: 'Employee/Register', component: RegistereComponent},
  {path: 'Emplpyee/Update', component: RegistereComponent},
  {path: 'Employee/Delete', component: RegistereComponent},
  {path: '**', component:PagenotfoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
