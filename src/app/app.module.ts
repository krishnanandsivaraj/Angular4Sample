import { LoginModule } from './modules/login.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { HttpModule, JsonpModule } from '@angular/http';
// import { ChartModule } from 'angular-highcharts';
// import { ModalModule } from 'ngx-bootstrap/modal';
import {routes} from './app.route';
// import { Routes, RouterModule } from '@angular/router';

// import { reportscomponent } from './layouts/report';
// import { TapestryCommonModule } from './component/common.module';
import { AppComponent } from './app.component';

// import { AdminComponent } from './layouts/admin.components';
// import { LoginComponent } from './Widgets/login/login';
// import {SourceManagementComponent} from './Widgets/Admin/sourcemanagement/sourcemanagement';
// import {reportscomponent} from './layouts/report';
// import { AdminModule } from './component/admin.module';


// const appRoutes: Routes = [
//   { path: '', component: LoginComponent, pathMatch: 'full' },
//   { path: 'login', component: LoginComponent, pathMatch: 'full' },
//   { path: 'admin', component: AdminComponent , pathMatch: 'full' },
//   {path: 'reports', component: reportscomponent, pathMatch: 'full'}
// ];

@NgModule({
  declarations: [
    // AdminComponent,reportscomponent, MiddleComponent, SourceManagementComponent,
    AppComponent,
    //  AdminComponent, reportscomponent
  ],
  imports: [
    // RouterModule.forRoot(appRoutes, { useHash: true }),RouterModule,
    BrowserModule, // ChartModule,
    // TapestryCommonModule,
    // FormsModule, 
    routes, LoginModule
    // HttpModule, JsonpModule, ModalModule.forRoot()// , AdminModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
