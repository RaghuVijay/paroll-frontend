import { Routes } from '@angular/router';
import { ListComponent } from './payslip/list/list.component';
import { EditComponent } from './payslip/edit/edit.component';
import { CreateComponent } from './payslip/create/create.component';
import { ViewComponent } from './payslip/view/view.component';
import { PayslipListResolver } from './payslip/list/list.resolver';
import { PayslipViewResolver } from './payslip/view/view.resolver';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SettingsComponent } from './settings/settings.component';
import { ReportsComponent } from './reports/reports.component';
import { UsersComponent } from './users/users.component';
import { DocumentsComponent } from './documents/documents.component';
import { RolesComponent } from './roles/roles.component';
import { LoginComponent } from './auth/login/login.component';
 
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'payslip',
    children: [
      {
        path: 'list',
        component: ListComponent,
        resolve: {
          payslips: PayslipListResolver,
        },
      },
      {
        path: 'edit',
        component: EditComponent,
        resolve: {
          userPayslip: PayslipViewResolver,
        },
      },
      { path: 'create', component: CreateComponent },
      {
        path: 'view',
        component: ViewComponent,
        resolve: {
          userPayslip: PayslipViewResolver,
        },
      },
    ],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {
    path: 'reports',
    component: ReportsComponent,
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'roles',
    component: RolesComponent,
  },
  {
    path: 'documents',
    component: DocumentsComponent,
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
];
