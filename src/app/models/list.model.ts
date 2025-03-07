// src/app/models/payslip.model.ts

// Define the Profile interface for nested data
export interface Profile {
  custom_id: string;
  name: string;
  gender: string;
  role: string;
  employer: string;
}

// Define the Payslip interface
export interface List {
  id: string;
  profile_id: string;
  company_address: string;
  city: string;
  pincode: string;
  country: string;
  pay_period: string;
  loss_of_pay_days: number;
  paid_days: number;
  pay_date: string;
  basic_earnings: string;
  house_rent_allowance: string;
  income_tax: string;
  provident_fund: string;
  gross_earnings: string;
  total_deductions: string;
  total_net_payable: string;
  amount_in_words: string;
  created_at: string;
  updated_at: string;
  profile: Profile; // Nested profile object
}