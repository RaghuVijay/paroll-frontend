import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  productName = 'Zoho Payroll'; // Example product name
  searchQuery = '';
  userName = 'John Doe';
  @Input() isCollapsed = false; // Input to track sidenav collapse state

  // Generate product initials
  getProductInitials(productName: string): string {
    const words = productName.split(' ');
    let initials = '';
    for (const word of words) {
      if (word.length > 0) {
        initials += word[0].toUpperCase();
      }
    }
    return initials;
  }

  logout() {
    console.log('User logged out');
    // Add logout logic here
  }
}
