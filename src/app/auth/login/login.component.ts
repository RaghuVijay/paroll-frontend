import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgbToast, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  showToast = false;
  toastHeader = '';
  toastMessage = '';
  toastClass = '';

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    // Simulate login API call
    setTimeout(() => {
      this.isLoading = false;

      // Simulate success or error response
      const isSuccess = true; // Randomly choose success or error
      if (isSuccess) {
        this.showToastMessage('Success', 'Login successful!', 'bg-success text-light');
      } else {
        this.showToastMessage('Error', 'Invalid email or password.', 'bg-danger text-light');
      }
    }, 2000);
  }

  showToastMessage(header: string, message: string, toastClass: string) {
    this.toastHeader = header;
    this.toastMessage = message;
    this.toastClass = toastClass;
    this.showToast = true;
  }
}