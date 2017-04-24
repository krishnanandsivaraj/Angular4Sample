import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule,JsonpModule, Jsonp,Http, Response, Headers, RequestOptions } from '@angular/http';

import { AppComponent } from './app.component';
import {LoginComponent} from './Widgets/Login/Login';
import { Routes,RouterModule } from '@angular/router';
import { ModalModule } from 'ngx-bootstrap/modal';
import{MiddleComponent} from './Widgets/middlesection/middletab';
import{NavComponent} from './Widgets/navmenu/navmenu';
import{SelectorTab} from './Widgets/selectortab/selectortab';
import{AdminComponent} from './layouts/admin.components'

const appRoutes: Routes = [
  { path: '', component: LoginComponent,pathMatch: 'full' },
  { path: 'login', component: LoginComponent,pathMatch: 'full' },
  { path: 'dashboard', component:AdminComponent ,pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,LoginComponent,AdminComponent,NavComponent,SelectorTab,MiddleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule, RouterModule,RouterModule.forRoot(appRoutes),JsonpModule,ModalModule.forRoot()
  ],
  providers:[],
  bootstrap: [AppComponent]
})
export class AppModule { }
