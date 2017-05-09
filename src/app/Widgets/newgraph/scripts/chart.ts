import { Component } from '@angular/core';
import { Chart } from 'angular-highcharts';


@Component({
    selector: 'high-charts',
    styleUrls:['../css/style.css'],
    templateUrl:'../templates/template.html'
})
export class ChartComponent {
    constructor() {
        // this.options = {
        //     title : { text : 'simple chart' },
        //     series: [{
        //         data: [29.9, 71.5, 106.4, 129],
        //     }]
        // };
    }
        private chart:any = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: 'Chart Title'
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Line 1',
        data: [1, 2, 3]
      }]
    });
    }