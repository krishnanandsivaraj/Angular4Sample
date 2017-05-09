import { TapestryReportsModule } from './reports.modue';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdminModule } from './admin.module';
import { HttpModule, JsonpModule } from '@angular/http';
import { BootstrapModalModule } from 'ng2-bootstrap-modal';
import { PopupComponent } from '../Widgets/agents/scripts/agents';
import { LoginComponent } from './../Widgets/login/login';
import { FormsModule } from '@angular/forms';
import { Utitilities } from './../../../scripts/app/utilities';
import { DataAdapter } from './../../../scripts/app/dataadapter';

@NgModule({
    imports: [AdminModule, HttpModule, JsonpModule, CommonModule, BootstrapModalModule, FormsModule, TapestryReportsModule],
    exports: [],
    declarations: [LoginComponent, PopupComponent],
    providers: [PopupComponent, DataAdapter, Utitilities],
    entryComponents: [PopupComponent]
})
export class LoginModule { }
