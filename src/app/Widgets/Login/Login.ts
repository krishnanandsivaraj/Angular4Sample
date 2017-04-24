import { Component,Injectable  } from '@angular/core';
import { JsonpModule, Jsonp,Http, Response, Headers, RequestOptions } from '@angular/http';

import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
// import{Responsee} from './response';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

class Responsee {
  constructor(public result: string,
              public success: boolean){
}
}
class ResponseeSuccessResult {
  constructor(public result: ResponseeSuccess,
              public success: boolean){
}
}

class ResponseeSuccess {
  constructor(public apiKey: string,
              public AuditDate:string,
              public Clients:Array<Clients>,
              public CreateDate:string,
              public emailAddress:string,
              public firstName:string,
              public isActive:boolean,
              public isExistingUser:boolean,
              public isLastLogin:string,
              public lastName:string,
              public Subscriptions:Array<Subscriptions>,
              public success: boolean){
}
}

class Clients{
    constructor(public displayName:string,
                public name:string,
                public weekstartday:string){
}
}
class Subscriptions{
    constructor(public source:string[],
                public destination:string[],
                public id:string){
}
}
@Component({
    selector: 'login-tab',
    styleUrls:['./login.css'],
    templateUrl:'./login.html'
})



@Injectable()
export class LoginComponent{
    constructor(private router: Router,private jsonp: Jsonp){
		  
	};



    private username:string;
    private password:string;
    private result:any;
    private url:string;
    private SuccessResponse:ResponseeSuccess;
    private SuccessResponseResult:ResponseeSuccessResult;
    public Products:Responsee;
    public clients:Array<Clients>;
    //parentRouter:any
login()
{
    var LoginUrl="http://v2qaservice.tapestrykpi.com/authentication/login?method=__ng_jsonp__.__req0.finished&loginTime=%222017-04-19T12:19:46.014Z%22&password="+this.password+"&username="+this.username+"&callback=JSONP_CALLBACK";

        this.jsonp.request(LoginUrl)
        .map(res => {
            console.log(res.json());
          return <ResponseeSuccessResult>res.json()
        }).subscribe((products:ResponseeSuccessResult) => {
       this.SuccessResponseResult = products;
       this.SuccessResponse=<ResponseeSuccess>this.SuccessResponseResult.result;
       this.clients=this.SuccessResponse["clients"];
       console.log("This response is: "+JSON.stringify(this.clients[0].displayName));
    });
}


onUserNameKeyPress(username:string)
{
    this.username=username;
}

onPasswordKeyPress(password:string)
{
    this.password=password;
}

Navigate()
{
        this.router.navigate(['./dashboard']);
}

}