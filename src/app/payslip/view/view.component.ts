import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./view.component.css'],
})
export class ViewComponent implements OnInit {
  formData: any;
  userId!: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const data = this.route.snapshot.data['userPayslip'];
    this.userId = data['profile_id']
    // Transform data to match UI structure
    this.formData = {
      companyName: data.profile?.employer || 'N/A',
      companyAddress: data.company_address,
      cityPincode: `${data.city}, ${data.pincode}`,
      employeeDetails: {
        employeeName: data.profile?.name,
        employeeId: data.profile?.custom_id,
        payPeriod: data.pay_period,
        paidDays: data.paid_days,
        lossOfPayDays: data.loss_of_pay_days,
        payDate: data.pay_date,
      },
      earnings: [
        { label: 'Basic Earnings', amount: data.basic_earnings },
        { label: 'House Rent Allowance', amount: data.house_rent_allowance },
      ],
      deductions: [
        { label: 'Income Tax', amount: data.income_tax },
        { label: 'Provident Fund', amount: data.provident_fund },
      ],
      grossEarnings: data.gross_earnings,
      totalDeductions: data.total_deductions,
      netPayable: data.total_net_payable,
      amountInWords: data.amount_in_words,
    };
  }

  calculateTotalEarnings(earnings: any[]): number {
    return earnings?.reduce((acc, earning) => acc + Number(earning.amount || 0), 0) || 0;
  }

  calculateTotalDeductions(deductions: any[]): number {
    return deductions?.reduce((acc, deduction) => acc + Number(deduction.amount || 0), 0) || 0;
  }

  getNetPayable(earnings: any[], deductions: any[]): number {
    return this.calculateTotalEarnings(earnings) - this.calculateTotalDeductions(deductions);
  }

  onEdit(): void {
    this.router.navigate(['payslip', 'edit'],  {
      queryParams: { user: this.userId },
    });
  }
}
