import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import { EditService } from '../../services/edit.service';
import { InternalService } from '../../services/internal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  payslipForm!: FormGroup;
  userId!: string;
  isFormInitialized = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private edit: EditService,
    private internal: InternalService
  ) {}

  ngOnInit(): void {
    let formData = this.route.snapshot.data['userPayslip'];
    this.userId = formData.profile_id;
    formData = {...formData, deductions: [], earnings: []}
    if (formData) {
      this.initializeForm(formData);
      this.isFormInitialized = true;
    } else {
      this.router.navigate(['payslip','create']);
    }
  }

  initializeForm(formData: any): void {
    this.payslipForm = this.fb.group({
      companyName: [formData.profile?.employer || ''],
      companyAddress: [formData.company_address || ''],
      city: [formData.city || ''],
      employeeDetails: this.fb.group({
        employeeName: [formData.profile?.name || ''],
        employeeId: [formData.profile?.custom_id || ''],
        payPeriod: [this.formatPayPeriod(formData.pay_period) || ''],
        paidDays: [formData.paid_days || ''],
        lossOfPayDays: [formData.loss_of_pay_days || '0'],
        payDate: [formData.pay_date || ''],
      }),
      earnings: this.fb.array([]),
      deductions: this.fb.array([]),
    });

    formData.deductions.push({
      label: 'Provident Fund',
      amount: formData['provident_fund']
    }, {
      label: 'Income Tax',
      amount: formData['income_tax']
    })


    formData.earnings.push({
      label: 'Basic earnings',
      amount: formData['basic_earnings']
    }, {
      label: 'HRA',
      amount: formData['house_rent_allowance']
    })

    if (formData.earnings) {
      formData.earnings.forEach((earning: any) =>
        this.earnings.push(this.createEarningEntry(earning.label, earning.amount))
      );
    }

    if (formData.deductions) {
      formData.deductions.forEach((deduction: any) =>
        this.deductions.push(this.createDeductionEntry(deduction.label, deduction.amount))
      );
    }
  }

  createEarningEntry(label: string, amount: string = '0'): FormGroup {
    return this.fb.group({
      label: [label],
      amount: [amount],
    });
  }

  formatPayPeriod(dateString: string): string {
    if (!dateString) return ''; // Handle null values
    return dateString.substring(0, 7); // Extract "YYYY-MM"
  }
  

  createDeductionEntry(label: string, amount: string = '0'): FormGroup {
    return this.fb.group({
      label: [label],
      amount: [amount],
    });
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

  getCompanyInitials(): string {
    const companyName = this.payslipForm.get('companyName')?.value;
    return companyName
      .split(' ')
      .map((word: string) => word[0])
      .join('')
      .toUpperCase();
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
    this.edit.updatePayslips(this.userId,payload).subscribe((res) => console.log(res))
    const payslipContent = document.getElementById('payslip-content');

    if (!payslipContent) {
      console.error('Payslip content element not found!');
      return;
    }

    payslipContent.style.display = 'block';

    try {
      const canvas = await html2canvas(payslipContent, {
        scale: 2,
        logging: true,
        useCORS: true,
        backgroundColor: '#FFFFFF',
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      const doc = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      this.addHeader(doc);
      doc.addImage(imgData, 'PNG', 0, 40, imgWidth, imgHeight);
      doc.save('payslip.pdf');

      this.router.navigate(['payslip','list'], {
        state: { formData: this.payslipForm.value },
      });
    } catch (error) {
      console.error('Error capturing payslip content:', error);
    } finally {
      payslipContent.style.display = 'none';
    }
  }

  addHeader(doc: jsPDF): void {
    const companyName = this.payslipForm.value.companyName || 'Company Name';
    doc.setFontSize(14);
    doc.text(companyName, 105, 20, { align: 'center' });
  }

  resetForm(): void {
    this.payslipForm.reset();
  }

}
