import { TapestryCommonModule } from './common.module';
import { NgModule } from '@angular/core';

import { GridComponent } from './../Widgets/newgrid/scripts/newgrid';
import { BreadCrumbComponent } from './../Widgets/breadcrumb/scripts/breadcrumb';
import { ChartComponent } from './../Widgets/newgraph/scripts/chart';
import { NewFiltersComponent } from './../Widgets/newfilters/scripts/newfilters';
import { BrowserModule } from '@angular/platform-browser';
import { TapestryReportsComponent } from '../layouts/report';
import { ChartModule } from 'angular-highcharts';

@NgModule({
    imports: [BrowserModule, TapestryCommonModule,ChartModule],
    exports: [TapestryCommonModule],
    declarations: [TapestryReportsComponent, NewFiltersComponent, ChartComponent, GridComponent, BreadCrumbComponent]
})
export class TapestryReportsModule { }
