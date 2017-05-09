import { TapestryReportsComponent } from './layouts/report';
import { AdminComponent } from './layouts/admin.components';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import{LoginComponent}from './Widgets/login/login';

export const router: Routes =  [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'admin', component: AdminComponent , pathMatch: 'full' },
  {path: 'reports', component: TapestryReportsComponent, pathMatch: 'full'}
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router, { useHash: true });
