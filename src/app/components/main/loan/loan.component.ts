import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { errorMessage, successDialog } from 'src/app/functions/alerts';
import { Member } from 'src/app/models/member';
import { AuthService } from 'src/app/services/auth.service';
import { Loan } from 'src/app/models/loan';
import { Golfcar } from 'src/app/models/golfcar';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-loan',
  templateUrl: './loan.component.html',
  styleUrls: ['./loan.component.css']
})
export class LoanComponent implements OnInit {
  crLoanForm : FormGroup;
  uLoanForm : FormGroup;
  loan: Loan;
  loans: Loan[] = [];
  loans_report: Loan[] = [];
  golfcars: Golfcar[] = [];
  members: Member[] = [];
  clickedLoan: Loan;
  dataSource!: MatTableDataSource<Loan>;
  dataSource_report!: MatTableDataSource<Loan>;
  displayedColumns: string[];
  displayedColumns_report: string[];
  response: any;
  constructor(private fb: FormBuilder, private authservice: AuthService, private router: Router){
    this.crForm();
    this.uForm();
  }
  ngOnInit(): void{
    this.authToken();
    this.isAdmin();
    this.displayedColumns_report = ['loan','member', 'name', 'date', 'start_time', 'end_time', 'holes', 'golfcar', 'visit'];
    this.getLoansReport();
    this.getMembersData();
    this.getGolfCarData();
    this.getLoansData();
  }
  isAdmin(){
    this.authservice.isAdmin().subscribe(() => {
      this.displayedColumns = ['loan','member', 'name', 'date', 'start_time', 'end_time', 'holes', 'golfcar', 'visit', 'delete']
    }, (error: HttpErrorResponse)=>{
      this.displayedColumns = ['loan','member', 'name', 'date', 'start_time', 'end_time', 'holes', 'golfcar', 'visit']
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
    if(this.crLoanForm.invalid){
      return Object.values(this.crLoanForm.controls).forEach(control => 
        control.markAsTouched());
    }else{
      this.setcrLoan();
      this.authservice.createLoan(this.loan).subscribe((response) => {
        this.response = response.message;
        successDialog(this.response).then(() => {
        })
        this.clearForm(this.crLoanForm);
      }, (error: HttpErrorResponse)=>{
        errorMessage('Incorrect data');
        console.log(error);
      })
    }
  }
  update(): void{
    this.setupdLoan();
    this.authservice.updateLoan(this.loan).subscribe((response) => {
      this.response = response.message;
      successDialog(this.response).then(() => {
      })
      this.clearForm(this.crLoanForm);
    }, (error: HttpErrorResponse)=>{
      errorMessage('Incorrect data');
      console.log(error);
    })
  }
  delete(code: string){
    this.authservice.deleteLoan(code).subscribe((response) => {
      this.response = response.message;
      successDialog(this.response).then(() => {
      })
      this.ngOnInit();
    }, (error: HttpErrorResponse)=>{
      errorMessage('Incorrect data');
      console.log(error);
    })
  }
  report(){
    const DATA = document.getElementById('report');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };
    html2canvas(DATA, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      successDialog('Reporte creado correctamente').then(() => {
        docResult.save(`reporte__prestamos_${new Date().toISOString()}.pdf`);
      })
    });
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
    this.crLoanForm = this.fb.group({ 
      member_c: ['', [Validators.required, Validators.minLength(10)]],
      date: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      holes: ['',[Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.pattern("^[0-9]*$")]],
      golf_car_c: ['', [Validators.required, Validators.maxLength(10)]],
      visit: ['', [Validators.required, Validators.maxLength(1)]]
    })
  }
  uForm(): void{
    this.uLoanForm = this.fb.group({ 
      codel: ['', []],
      member_c: ['', []],
      date: ['', [Validators.required]],
      start_time: ['', [Validators.required]],
      end_time: ['', [Validators.required]],
      holes: ['',[Validators.required, Validators.minLength(1), Validators.maxLength(2), Validators.pattern("^[0-9]*$")]],
      golf_car_c: ['', [Validators.required, Validators.maxLength(10)]],
      visit: ['', [Validators.required, Validators.maxLength(1)]]
  })
  }
  setData(): void{
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.loans;
  }
  getLoansData(): void{
    this.authservice.showLoans().subscribe((response)=>{
      this.loans = response.Loans
      this.setData();
    })
  }
  setReport(): void{
    this.dataSource_report = new MatTableDataSource();
    this.dataSource_report.data = this.loans_report;
  }
  getLoansReport(): void{
    this.authservice.reportLoans().subscribe((response)=>{
      this.loans_report = response.Loans
      this.setReport();
    })
  }
  getGolfCarData(): void{
    this.authservice.showGolfCars().subscribe((response)=>{
      this.golfcars = response.GolfCars
    })
  }
  getMembersData(): void{
    this.authservice.showMembers().subscribe((response)=>{
      this.members = response.Members
    })
  }
  setcrLoan(): void{
    this.loan = {
      member_c: this.crLoanForm.get('member_c').value,
      date: this.crLoanForm.get('date').value,
      start_time: this.crLoanForm.get('start_time').value,
      end_time: this.crLoanForm.get('end_time').value,
      holes: this.crLoanForm.get('holes').value,
      golf_car_c: this.crLoanForm.get('golf_car_c').value,
      visit: this.crLoanForm.get('visit').value,
    };
  }
  setupdLoan(): void{
    this.loan = {
      codel: this.clickedLoan.codel,
      member_c: this.clickedLoan.member_c,
      date: this.uLoanForm.get('date').value,
      start_time: this.uLoanForm.get('start_time').value,
      end_time: this.uLoanForm.get('end_time').value,
      holes: this.uLoanForm.get('holes').value,
      golf_car_c: this.uLoanForm.get('golf_car_c').value,
      visit: this.uLoanForm.get('visit').value,
    };
  }
  Loan(loan: Loan): void{
    this.clickedLoan = loan;
  }
}
