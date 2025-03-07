import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { NavigationExtras, Router } from '@angular/router';
import { InternalService } from '../../services/internal.service';
import { CreateService } from '../../services/create.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class CreateComponent implements OnInit {
  payslipForm!: FormGroup;

  constructor(private fb: FormBuilder, private route: Router, private internal: InternalService, private create: CreateService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.payslipForm = this.fb.group({
      companyName: [''],
      companyAddress: [''],
      cityPincode: [''],
      employeeDetails: this.fb.group({
        employeeName: [''],
        employeeId: [''],
        payPeriod: [''],
        paidDays: [''],
        lossOfPayDays: ['0'],
        payDate: [''],
      }),
      earnings: this.fb.array([
        this.createEarningEntry('Basic'),
        this.createEarningEntry('HRA'),
      ]),
      deductions: this.fb.array([
        this.createDeductionEntry('Income Tax'),
        this.createDeductionEntry('Provident Fund'),
      ]),
    });
  }

  createEarningEntry(label: string): FormGroup {
    return this.fb.group({
      label: [label],
      amount: ['0'],
    });
  }

  createDeductionEntry(label: string): FormGroup {
    return this.fb.group({
      label: [label],
      amount: ['0'],
    });
  }

  getCompanyInitials(): string {
    const companyName = this.payslipForm.get('companyName')?.value;
    return companyName
      .split(' ')
      .map((word: string) => word[0])
      .join('')
      .toUpperCase();
  }

  get earnings(): FormArray {
    return this.payslipForm.get('earnings') as FormArray;
  }

  get deductions(): FormArray {
    return this.payslipForm.get('deductions') as FormArray;
  }

  addEarning(): void {
    this.earnings.push(this.createEarningEntry(''));
  }

  removeEarning(index: number): void {
    this.earnings.removeAt(index);
  }

  addDeduction(): void {
    this.deductions.push(this.createDeductionEntry(''));
  }

  removeDeduction(index: number): void {
    this.deductions.removeAt(index);
  }

  calculateTotalEarnings(): number {
    return this.earnings.controls.reduce((acc, control) => {
      const amount = Number(control.get('amount')?.value) || 0;
      return acc + amount;
    }, 0);
  }

  calculateTotalDeductions(): number {
    return this.deductions.controls.reduce((acc, control) => {
      const amount = Number(control.get('amount')?.value) || 0;
      return acc + amount;
    }, 0);
  }

  getNetPayable(): number {
    return this.calculateTotalEarnings() - this.calculateTotalDeductions();
  }

  async generatePayslip(): Promise<void> {
    const formData = this.payslipForm.value;
    let payload = {
      profile_id: formData.employeeDetails.employeeId,
      employer: formData.companyName,
      company_address: formData.companyAddress,
      city : formData.city,
      "pay_period": `${formData.employeeDetails.payPeriod}-01`,
      "loss_of_pay_days": formData.employeeDetails.lossOfPayDays,
      "paid_days": formData.employeeDetails.paidDays,
      "pay_date": formData.employeeDetails.payDate,
      "basic_earnings": formData.earnings.filter((data: any)=> data.label == "Basic earnings")['amount'],
      "house_rent_allowance": formData.earnings.filter((data: any)=> data.label == "HRA")['amount'],
      "income_tax": formData.earnings.filter((data: any)=> data.label == "Income Tax")['amount'],
      "provident_fund":  formData.earnings.filter((data: any)=> data.label == "Provident Fund")['amount'],
      "gross_earnings": this.calculateTotalEarnings(),
      "total_deductions": this.calculateTotalDeductions(),
      "total_net_payable": this.getNetPayable(),
      "amount_in_words": this.internal.numberToWords(this.getNetPayable())
    }

    this.create.createPayslips(payload).subscribe((res) => console.log(res))

    const payslipContent = document.getElementById('payslip-content');
  
    if (!payslipContent) {
      console.error('Payslip content element not found!');
      return;
    }
  
    // Temporarily make the content visible for capturing
    payslipContent.style.display = 'block';
  
    try {
      const canvas = await html2canvas(payslipContent, {
        scale: 2, // Increase scale for better quality
        logging: true, // Enable logging for debugging
        useCORS: true, // Enable CORS for external resources
        backgroundColor: '#FFFFFF', // Ensure white background
      });
  
      console.log('Canvas created successfully:', canvas);
  
      const imgData = canvas.toDataURL('image/png', 1.0); // Full quality
      console.log('Image data generated:', imgData);
  
      const doc = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      // Add header
      this.addHeader(doc);
  
      // Add payslip content
      doc.addImage(imgData, 'PNG', 0, 40, imgWidth, imgHeight);
  
      // Save the PDF
      console.log('Saving PDF...');
      doc.save('payslip.pdf');
      const navigationExtras: NavigationExtras = {
        state: {
          formData: this.payslipForm.value, // Pass the form data
        },
      };
      this.route.navigate(['payslip','list'])
      } catch (error) {
      console.error('Error capturing payslip content:', error);
    } finally {
      // Hide the content again
      payslipContent.style.display = 'none';
    }
  }
  
  addHeader(doc: jsPDF): void {
    const companyName = this.payslipForm.get('companyName')?.value;
    const companyInitials = companyName
      .split(' ')
      .map((word: string) => word[0])
      .join('')
      .toUpperCase();
    const companyAddress = this.payslipForm.get('companyAddress')?.value;
    const cityPincode = this.payslipForm.get('cityPincode')?.value;
  
    // Right side: Company initials and name
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(companyInitials, 180, 10, { align: 'right' });
    doc.setFontSize(12);
    doc.text(companyName, 180, 15, { align: 'right' });
  
    // Left side: Company address and pincode
    doc.setFontSize(10);
    doc.text(`${companyAddress}, ${cityPincode}`, 10, 10);
  }

  resetForm(): void {
    this.payslipForm.reset();
  }
}