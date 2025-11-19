import { Routes } from '@angular/router';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout';
import { AuthGuard } from './auth/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register').then((m) => m.RegisterComponent),
  },

  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'contacts',
        loadComponent: () =>
          import('./dashboard/contacts/contacts/contacts').then((m) => m.Contacts),
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./dashboard/departments/departments/departments').then((m) => m.Departments),
      },
      {
        path: 'job-titles',
        loadComponent: () =>
          import('./dashboard/jobtitles/job-titles/job-titles').then((m) => m.JobTitles),
      },
      {
        path: '',
        redirectTo: 'contacts',
        pathMatch: 'full',
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
