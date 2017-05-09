import {Component,Injectable,OnInit} from '@angular/core';
import { Jsonp } from '@angular/http';

import {  filtergroupresult } from '../modal/filtergroupresult';
import { filtergroupresponse } from '../modal/filtergroupresponse';

@Component({
    selector: 'getfilter',
    styleUrls:['../css/style.css'],
    templateUrl: '../templates/template.html'
})

@Injectable()
export class BreadCrumbComponent implements OnInit {
        ngOnInit(): void {
           this.loadBreadCrumb();
        }

constructor(private jsonp: Jsonp) {};

    public displaynames:any=[];
    public displaygroupname:string;
    public displayname:string;
    public filtergroupresponse:filtergroupresponse;
    public filtergroupresult:filtergroupresult;

loadBreadCrumb(){
    var filterlisturl="http://v2qaservice.tapestrykpi.com/admin/getsiteConfig?alt=json&method=__ng_jsonp__.__req0.finished&pageName=reportpreview.deltaflightmetricreport-tickets.report&callback=JSONP_CALLBACK";
        this.jsonp.request(filterlisturl)
        .map(res => {
            console.log(res.json());
          return <filtergroupresponse>res.json()
        }).subscribe((products:filtergroupresponse) => {
       this.filtergroupresponse = products;
       this.filtergroupresult=<filtergroupresult>this.filtergroupresponse.result;
       this.displaygroupname=this.filtergroupresult.groupDisplayName;
       this.displayname=this.filtergroupresult.displayName;
       console.log('This response should be: ' + JSON.stringify(this.displaygroupname));
    });
}
}