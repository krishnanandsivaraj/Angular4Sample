import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent }  from './app.component';
import{LoginComponent}from './Widgets/Login/login';

export const router: Routes = [
    { path: '',
    redirectTo: '/login',
         pathMatch: 'full'
   },
    { path: 'login', component: LoginComponent },
    { path: 'app', component: AppComponent }

];

export const routes: ModuleWithProviders = RouterModule.forRoot(router, { useHash: true });