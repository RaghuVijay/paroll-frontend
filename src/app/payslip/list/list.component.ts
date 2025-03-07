import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { List } from '../../models/list.model';
import { DeleteService } from '../../services/delete.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbDropdownModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private del: DeleteService
  ) {}

  payslips: List[] = []; // Replace employees with payslips
  filteredPayslips: List[] = [];
  paginatedPayslips: List[] = [];
  currentPage = 1;
  pageSize = 5; // Default items per page
  pageSizeOptions = [5, 10, 20, 50]; // Dropdown options for items per page

  ngOnInit() {
    // Access the resolved data from the route
    this.payslips = this.route.snapshot.data['payslips'];
    this.filteredPayslips = this.payslips; // Initialize filtered data
    this.updatePagination();
  }

  onFilter(event: Event, field: keyof List) {
    const input = event.target as HTMLInputElement;
    const value = input.value.toLowerCase();
    this.filteredPayslips = this.payslips.filter((payslip) =>
      String(payslip[field]).toLowerCase().includes(value)
    );
    this.currentPage = 1; // Reset to first page after filtering
    this.updatePagination();
  }

  onCreate() {
    console.log('Create button clicked');
    this.router.navigate(['payslip', 'create'], {
      queryParams: { query: 'create' },
    });
  }

  onView(payslip: List) {
    console.log('View:', payslip);
    this.router.navigate(['payslip', 'view'], {
      queryParams: { user: payslip.profile_id },
    });
  }

  onEdit(payslip: List) {
    console.log('Edit:', payslip);
    this.router.navigate(['payslip', 'edit'], {
      queryParams: { user: payslip.profile_id },
    });
  }

  onDelete(payslip: List) {
    console.log('Delete:', payslip);
    this.del.deletePayslips(payslip.profile_id).subscribe((res: any)=> window.location.reload())
  }

  getAvatarInitials(name: string): string {
    const names = name.split(' ');
    const firstNameInitial = names[0].charAt(0).toUpperCase();
    const lastNameInitial =
      names.length > 1 ? names[names.length - 1].charAt(0).toUpperCase() : '';
    return `${firstNameInitial}${lastNameInitial}`;
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.currentPage = 1; // Reset to first page after changing page size
    this.updatePagination();
  }

  updatePagination() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPayslips = this.filteredPayslips.slice(
      startIndex,
      endIndex
    );
  }

  get totalPages(): number {
    return Math.ceil(this.filteredPayslips.length / this.pageSize);
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}