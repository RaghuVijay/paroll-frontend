import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgbDropdownModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent {
  @Output() toggleCollapse = new EventEmitter<boolean>(); // Emit collapse state
  isCollapsed = false; // Default state: expanded

  // Organizations
  organizations = ['Org 1', 'Org 2', 'Org 3', 'Org 4', 'Org 5']; // Example organizations
  filteredOrganizations = this.organizations; // Filtered list of organizations
  selectedOrganization: string | null = null;
  searchQuery = ''; // Search query for filtering organizations

  // Filter Organizations
  filterOrganizations() {
    this.filteredOrganizations = this.organizations.filter((org) =>
      org.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Select Organization
  selectOrganization(org: string) {
    this.selectedOrganization = org;
  }

  // Create New Organization
  createNewOrganization() {
    console.log('Create New Organization clicked');
    // Add logic to create a new organization
  }

  // Toggle collapse/expand state
  toggle() {
    this.isCollapsed = !this.isCollapsed;
    this.toggleCollapse.emit(this.isCollapsed); // Emit the new state
  }
}
