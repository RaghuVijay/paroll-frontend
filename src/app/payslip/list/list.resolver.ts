import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { List } from '../../models/list.model';
import { ListService } from '../../services/list.service';

@Injectable({
  providedIn: 'root',
})
export class PayslipListResolver implements Resolve<List[]> {
  constructor(private payslipService: ListService) {}

  resolve(): Observable<List[]> {
    return this.payslipService.getPayslips(); // Fetch the list of payslips
  }
}