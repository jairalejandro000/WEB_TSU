import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './components/main/employee/employee.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './components/main/home/home.component';
import { PagenotfoundComponent } from './components/others/pagenotfound/pagenotfound.component';
import { ExtensionComponent } from './components/main/extension/extension.component';
import { GolfcarComponent } from './components/main/golfcar/golfcar.component';
import { AreaComponent } from './components/main/area/area.component';
import { UserComponent } from './components/main/user/user.component';
import { LoanComponent } from './components/main/loan/loan.component';
import { MemberComponent } from './components/main/member/member.component';

const routes: Routes = [
  {path: 'Login', component: LoginComponent},
  {path: '', redirectTo: '/Login', pathMatch: 'full'},
  {path: 'Home', component: HomeComponent},
  {path: 'Employee', component: EmployeeComponent},
  {path: 'Extension', component: ExtensionComponent},
  {path: 'GolfCar', component: GolfcarComponent},
  {path: 'Area', component: AreaComponent},
  {path: 'User', component: UserComponent},
  {path: 'Loan', component: LoanComponent},
  {path: 'Member', component: MemberComponent},
  {path: '**', component:PagenotfoundComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
