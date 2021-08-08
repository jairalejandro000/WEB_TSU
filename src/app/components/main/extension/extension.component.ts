import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { errorMessage, successDialog } from 'src/app/functions/alerts';
import { Employee } from 'src/app/models/employee';
import { AuthService } from 'src/app/services/auth.service';
import { Extension } from 'src/app/models/extension';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-extension',
  templateUrl: './extension.component.html',
  styleUrls: ['./extension.component.css']
})
export class ExtensionComponent implements OnInit {
  crExtensionForm : FormGroup;
  uExtensionForm : FormGroup;
  extension: Extension;
  extensions: Extension[] = [];
  clickedExtension: Extension;
  employees: Employee[] = [];
  dataSource!: MatTableDataSource<Extension>;
  dataSource_report!: MatTableDataSource<Extension>;
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
    this.getExtensionsData();
    this.getEmployeesData();
    this.displayedColumns_report = ['extension', 'employee', 'number', 'area'];
  }
  isAdmin(){
    this.authservice.isAdmin().subscribe(() => {
      this.displayedColumns = ['extension', 'employee', 'number', 'area', 'delete']
    }, (error: HttpErrorResponse)=>{
      this.router.navigate(['/Login'])
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
    if(this.crExtensionForm.invalid){
      return Object.values(this.crExtensionForm.controls).forEach(control => 
        control.markAsTouched());
    }else{
      this.setcrExtension();
      this.authservice.createExtension(this.extension).subscribe((response) => {
        this.response = response.message;
        successDialog(this.response).then(() => {
        })
        this.clearForm(this.crExtensionForm);
      }, (error: HttpErrorResponse)=>{
        errorMessage('Incorrect data');
        console.log(error);
      })
    }
  }
  update(): void{
    this.setupdExtension();
    this.authservice.updateExtension(this.extension).subscribe((response) => {
      this.response = response.message;
      successDialog(this.response).then(() => {
      })
      this.clearForm(this.uExtensionForm);
    }, (error: HttpErrorResponse)=>{
      errorMessage('Incorrect data');
      console.log(error);
    })
  }
  delete(code: string){
    this.authservice.deleteExtension(code).subscribe((response) => {
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
        docResult.save(`reporte__extensiones_${new Date().toISOString()}.pdf`);
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
    this.crExtensionForm = this.fb.group({ 
      employee_c: ['', [Validators.required, Validators.maxLength(100)]],
      extension: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]]
    })
  }
  uForm(): void{
    this.uExtensionForm = this.fb.group({ 
      codex: ['', []],
      employee_c: ['', [Validators.required]],
      extension: ['', []]
  })
  }
  setData(): void{
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.extensions;
    this.dataSource_report = new MatTableDataSource();
    this.dataSource_report.data = this.extensions;
  }
  getExtensionsData(): void{
    this.authservice.showExtensions().subscribe((response)=>{
      this.extensions = response.Extensions;
      this.setData();
    })
  }
  getEmployeesData(): void{
    this.authservice.showEmployees().subscribe((response)=>{
      this.employees = response.Employees;
    })
  }
  setcrExtension(): void{
    this.extension = {
      employee_c: this.crExtensionForm.get('employee_c').value,
      extension: this.crExtensionForm.get('extension').value,
    };
  }
  setupdExtension(): void{
    this.extension = {
      codex: this.clickedExtension.extension,
      employee_c: this.uExtensionForm.get('employee_c').value,
      extension: this.clickedExtension.number,
    };
  }
  Extension(extension: Extension): void{
    this.clickedExtension = extension;
  }
}