import { TapestryCommonModule } from './common.module';
import { MiddleComponent } from './../Widgets/Admin/middlesection/middletab';
import { AdminComponent } from './../layouts/admin.components';

import { SourceManagementComponent } from './../Widgets/Admin/sourcemanagement/sourcemanagement';
import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

@NgModule({
    imports: [BrowserModule, TapestryCommonModule],
    declarations: [SourceManagementComponent, AdminComponent, MiddleComponent],
    exports: [ TapestryCommonModule]
})
export class AdminModule { }
