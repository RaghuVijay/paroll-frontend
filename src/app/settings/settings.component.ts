import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ControlsComponent } from './controls/controls.component';
import { ConfigureComponent } from './configure/configure.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbNavModule,
    ControlsComponent,
    ConfigureComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  organizationForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.organizationForm = this.fb.group({
      organizationName: ['', [Validators.required, Validators.maxLength(50)]],
      organizationEmail: ['', [Validators.required, Validators.email]],
      organizationPhone: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
      organizationAddress: [
        '',
        [Validators.required, Validators.maxLength(100)],
      ],
      organizationWebsite: [
        '',
        [
          Validators.pattern(
            /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
          ),
        ],
      ],
      organizationDescription: ['', [Validators.maxLength(200)]],
      orgAdminName: ['', [Validators.required, Validators.maxLength(50)]],
      orgAdminEmail: ['', [Validators.required, Validators.email]],
      orgAdminMobile: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
      ],
    });
  }

  // Save Form
  saveForm() {
    if (this.organizationForm.valid) {
      console.log('Form Data:', this.organizationForm.value);
      alert('Organization details saved successfully!');
    } else {
      alert('Please fill out the form correctly.');
    }
  }

  // Reset Form
  resetForm() {
    this.organizationForm.reset();
  }
}
