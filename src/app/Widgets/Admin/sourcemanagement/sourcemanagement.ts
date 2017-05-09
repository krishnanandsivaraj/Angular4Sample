import { Component, OnInit} from '@angular/core';
import { Jsonp } from '@angular/http';
import{Result} from './modal/Result';
import{DataSource} from './modal/DataSource';
import{ConnectionType} from './modal/ConnectionType';
import{Accounts} from './modal/Accounts';

@Component({
    selector: 'sourcemanagement',
    styleUrls:['./sourcemanagement.css'],
    templateUrl:'./sourcemanagement.html'
})
export class SourceManagementComponent implements OnInit{
    ngOnInit(): void {
        this.mysources();
    }
    constructor(private jsonp: Jsonp) { };
    public viewingOptions = [
                   { option: 'mysources()', name: "My Sources",isNavSelected:"selected" },
                   { option: 'allsources()', name: "All Sources",isNavSelected:"" }
                ];
    public titleName:string= 'My Sources';
    public result:Result;
    public connectionType:ConnectionType;
    public datasource:DataSource;
    public accounts:Accounts;
    public len:number;
    public lenaccount:number;
    private displayName:[string];
    private description:[string];
    private name:[string];
    public resultt:any=[];
    public resultAll:any=[];
    public titleAllName:string;

mysources()
{
    var LoadUrl="http://v2qaservice.tapestrykpi.com/admin/getdatasource?alt=json&method=JSONP_CALLBACK&client=tapestry&callback=JSONP_CALLBACK";
        this.jsonp.request(LoadUrl)
        .map(res => {
            console.log(res.json());
          return <DataSource>res.json()
        }).subscribe((products:DataSource) => {
       this.datasource= products;
       this.result=<Result>this.datasource.result;
       this.len=Object.keys(this.result).length;

        for(var i=0;i<this.len;i++){
             if(Object.keys(this.result[i].accounts).length>0){
                 if(Object.keys(this.result[i].accounts)!=undefined)
                 {
                 this.resultt.push(this.result[i]);
                 }
                 }
        }
        console.log(this.resultt);
        }
    );
}

allsources()
{
    this.titleAllName = 'All Sources';
     var LoadUrl="http://v2qaservice.tapestrykpi.com/admin/getdatasource?alt=json&method=JSONP_CALLBACK&client=tapestry&callback=JSONP_CALLBACK";

        this.jsonp.request(LoadUrl)
        .map(res => {
            console.log(res.json());
          return <DataSource>res.json()
        }).subscribe((products:DataSource) => {
       this.datasource= products;
       this.result=<Result>this.datasource.result;
       this.len=Object.keys(this.result).length;

        for(var i=0;i<this.len;i++){
                 this.resultAll.push(this.result[i]);
        }
        alert(this.resultAll);
        }
    );
}
}