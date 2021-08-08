import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Golfcar } from 'src/app/models/golfcar';
import { errorMessage, successDialog } from 'src/app/functions/alerts';
import { AuthService } from 'src/app/services/auth.service';
import { Member } from 'src/app/models/member';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  crMemberForm : FormGroup;
  uMemberForm : FormGroup;
  member: Member;
  members: Member[] = [];
  golfcars: Golfcar[] = [];
  clickedMember: Member;
  dataSource!: MatTableDataSource<Member>;
  displayedColumns: string[];
  response: any;
  constructor(private fb: FormBuilder, private authservice: AuthService, private router: Router){
    this.crForm();
    this.uForm();
  }
  ngOnInit(): void{
    this.authToken();
    this.isAdmin();
    this.getMembersData();
    this.getGolfCarData();
  }
  isAdmin(){
    this.authservice.isAdmin().subscribe(() => {
      this.displayedColumns = ['member', 'name', 'last_name', 'gender', 'number', 'golfcar', 'delete']
    }, (error: HttpErrorResponse)=>{
      this.displayedColumns = ['member', 'name', 'last_name', 'gender', 'number', 'golfcar']
      console.log(error)
    })
  }
  authToken(){
    this.authservice.AuthToken().subscribe(() => {
    }, (error: HttpErrorResponse)=>{
      this.router.navigate(['/Login'])
      console.log('Error in the auth')
      console.log(error)
    })
  } 
  create(): void{
    if(this.crMemberForm.invalid){
      return Object.values(this.crMemberForm.controls).forEach(control => 
        control.markAsTouched());
    }else{
      this.setcrMember();
      this.authservice.createMember(this.member).subscribe((response) => {
        this.response = response.message;
        successDialog(this.response).then(() => {
        })
        this.clearForm(this.crMemberForm);
      }, (error: HttpErrorResponse)=>{
        errorMessage('Incorrect data');
        console.log(error);
      })
    }
  }
  update(): void{
    this.setupdMember();
    this.authservice.updateMember(this.member).subscribe((response) => {
      this.response = response.message;
      successDialog(this.response).then(() => {
      })
      this.clearForm(this.crMemberForm);
    }, (error: HttpErrorResponse)=>{
      errorMessage('Incorrect data');
      console.log(error);
    })
  }
  delete(code: string){
    this.authservice.deleteMember(code).subscribe((response) => {
      this.response = response.message;
      successDialog(this.response).then(() => {
      })
      this.ngOnInit();
    }, (error: HttpErrorResponse)=>{
      errorMessage('Incorrect data');
      console.log(error);
    })
  }
  logOut(){
    this.authservice.clearStorage();
    this.ngOnInit();
  }
  clearForm(form: FormGroup){
    form.reset();
    for (const key in form.controls) {
      form.get(key).setErrors(null);
    }
    this.ngOnInit();
  }
  crForm(): void{
    this.crMemberForm = this.fb.group({ 
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      last_name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(40)]],
      gender: ['', [Validators.required, Validators.maxLength(1)]],
      address: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(254)]],
      number: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(15), Validators.pattern("^[0-9]*$")]],
      golfcar: ['', [Validators.required, Validators.maxLength(10)]]
    })
  }
  uForm(): void{
    this.uMemberForm = this.fb.group({ 
      codem: ['', []],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      last_name: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      number: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(15), Validators.pattern("^[0-9]*$")]],
      golfcar: ['', [Validators.required, Validators.maxLength(10)]]
  })
  }
  setData(): void{
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.members;
  }
  getMembersData(): void{
    this.authservice.showMembers().subscribe((response)=>{
      this.members = response.Members
      this.setData();
    })
  }
  getGolfCarData(): void{
    this.authservice.showGolfCars().subscribe((response)=>{
      this.golfcars = response.GolfCars
    })
  }
  setcrMember(): void{
    this.member = {
      name: this.crMemberForm.get('name').value,
      last_name: this.crMemberForm.get('last_name').value,
      gender: this.crMemberForm.get('gender').value,
      address: this.crMemberForm.get('address').value,
      number: this.crMemberForm.get('number').value,
      golf_car_c: this.crMemberForm.get('golfcar').value
    };
  }
  setupdMember(): void{
    this.member = {
      codem: this.clickedMember.member,
      name: this.uMemberForm.get('name').value,
      last_name: this.uMemberForm.get('last_name').value,
      number: this.uMemberForm.get('number').value,
      golf_car_c: this.uMemberForm.get('golfcar').value
    };
  }
  Member(member: Member): void{
    this.clickedMember = member;
  }
}
