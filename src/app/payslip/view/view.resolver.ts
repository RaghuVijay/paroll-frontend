import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { List } from '../../models/list.model';
import { ViewService } from '../../services/view.service';

@Injectable({
  providedIn: 'root',
})
export class PayslipViewResolver implements Resolve<List[]> {
  constructor(private payslipService: ViewService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<List[]> {
    const queryParams = route.queryParams;
    const paramValue = queryParams['user'];

    return this.payslipService.getPayslips(paramValue);
  }
}