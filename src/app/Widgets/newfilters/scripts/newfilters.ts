import {Component,Injectable,OnInit} from '@angular/core';
import { JsonpModule, Jsonp,Http, Response, Headers, RequestOptions } from '@angular/http';

import {filterresponse} from '../modal/filterresponse';
import { filterresult } from '../modal/filterresult';


@Component({
    selector: 'newfilters',
    styleUrls:['../css/style.css'],
    templateUrl:'../templates/template.html'
})

@Injectable()
export class NewFiltersComponent implements OnInit {
        ngOnInit(): void {
           this.loadfilters();
           this.DAILY=true;
        }

constructor(private jsonp: Jsonp) {};
    public filterresponse:filterresponse;
    public filterresult:filterresult;
    public displaynames:any=[];
    public displaygroupname:string;
    public displayname:string;
    public showdailycalender:boolean;
    public granularities:string[]=['DAILY', 'WEEKLY', 'MONTHLY', 'MTD', 'YTD']
    public selected:boolean=false;
    public DAILY:boolean=false;public WEEKLY:boolean=false;public MONTHLY:boolean=false;public MTD:boolean=false;public YTD:boolean=false;
    public DAILYCALENDER:boolean=false;public WEEKLYCALENDER:boolean=false;public MONTHLYCALENDER:boolean=false;public MTDCALENDER:boolean=false;public YTDCALENDER:boolean=false;

loadfilters(){
    var filterlisturl="http://v2qaservice.tapestrykpi.com/reports/getfilters?alt=json&method=__ng_jsonp__.__req1.finished&pageName=reportpreview.deltaflightmetricreport-tickets.report&client=delta&filters=deltaflightmetricsgroup&callback=JSONP_CALLBACK";
    
      this.jsonp.request(filterlisturl)
        .map(res => {
            console.log(res.json());
          return <filterresponse>res.json()
        }).subscribe((products:filterresponse) => {
       this.filterresponse = products;
       this.filterresult=<filterresult>this.filterresponse.result;
       this.displayname=this.filterresult.filters[0].displayName;
       for(var i=0;i<this.filterresult.filters.length;i++){
           console.log(this.filterresult.filters[i].data.length);
           for(var j=0;j<this.filterresult.filters[i].data.length;j++){
               this.displaynames.push(this.filterresult.filters[i].data[j].displayname);
           }
       }
       console.log("This response is: "+JSON.stringify(this.displaynames));
    });
}
selectGranularity(granularity:string){
switch(granularity){
    case "DAILY":
        this.DAILYCALENDER=true;
        this.WEEKLYCALENDER=false;
        this.MONTHLYCALENDER=false;
        this.MTDCALENDER=false;
        this.YTDCALENDER=false;
        break;
    case "WEEKLY":
        this.DAILYCALENDER=false;
        this.WEEKLYCALENDER=true;
        this.MONTHLYCALENDER=false;
        this.MTDCALENDER=false;
        this.YTDCALENDER=false;
        break;
    case "MONTHLY":
        this.DAILYCALENDER=false;
        this.WEEKLYCALENDER=false;
        this.MONTHLYCALENDER=true;
        this.MTDCALENDER=false;
        this.YTDCALENDER=false;
        break;
    case "MTD":
        this.DAILYCALENDER=false;
        this.WEEKLYCALENDER=false;
        this.MONTHLYCALENDER=false;
        this.MTDCALENDER=true;
        this.YTDCALENDER=false;
        break;
    case "YTD":
        this.DAILYCALENDER=false;
        this.WEEKLYCALENDER=false;
        this.MONTHLYCALENDER=false;
        this.MTDCALENDER=false;
        this.YTDCALENDER=true;
        break;
    
}
}


}