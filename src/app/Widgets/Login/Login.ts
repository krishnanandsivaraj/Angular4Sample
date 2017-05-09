import { services } from '../../../../scripts/app/services';
import { Utitilities } from './../../../../scripts/app/utilities';
import { DataAdapter } from './../../../../scripts/app/dataadapter';
import { baseApiUrl } from './../../../../scripts/app/appsettings';
import { Component, Injectable, OnInit } from '@angular/core';
import { Jsonp } from '@angular/http';
import {Router} from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/do';

import{ResponseeSuccessResult} from './modals/ResponseeSuccessResult';
import{ResponseeSuccess} from './modals/ResponseeSuccess';
import{Clients} from './modals/Clients';
import{Responsee} from './modals/Responsee';
import { DialogService } from 'ng2-bootstrap-modal';
import { PopupComponent } from './../agents/scripts/agents';

@Component({
    selector: 'login-tab',
    styleUrls:['./login.css'],
    templateUrl: './login.html',
    providers: [DataAdapter, Utitilities]
})



@Injectable()
export class LoginComponent implements OnInit {
    private SuccessResponse: ResponseeSuccess;
    private SuccessResponseResult: ResponseeSuccessResult;
    public Products: Responsee;
    public clients: Array<Clients>;
    private baseapi= baseApiUrl;
    public loading: boolean = false;
    public loadingImage: boolean= true;
    public error: string;
    public errorstatus: boolean= false;
    // private clientsName: PopupComponent;
    constructor(private router: Router, private jsonp: Jsonp, private da: DataAdapter,
    private dialogService: DialogService,private clientsName: PopupComponent ) { };

login(username: string, password: string)
{
    this.loading = true;
  let result =  this.da.CreateDataSource(this.baseapi, username, password);
        this.jsonp.request(result)
        .map(res => {
            console.log(res.json());
          return <ResponseeSuccessResult>res.json()
        }).subscribe((products: ResponseeSuccessResult) => {
       this.SuccessResponseResult = products;
       this.SuccessResponse = <ResponseeSuccess>this.SuccessResponseResult.result;
        if (this.SuccessResponse.isExistingUser === true) {
        this.loading = false;
        this.clients = this.SuccessResponse[ 'clients' ];
        this.errorstatus= false;
        this.loadingImage = true;
        this.loading = false;
        this.showConfirm(this.clients);
        }else
        {
        this.loading = true;
        this.errorstatus= true;
        this.loadingImage = false;
        this.error = 'Incorrect UserName and Password!!';
        }

       // console.log('This response is: ' + JSON.stringify(this.clients[0].displayName));
    });
}
ngOnInit(): void {
        setTimeout(function() {
       this.loading = false;
       console.log(this.loading);
   }.bind(this), 3000);
    }

showConfirm(clients: Clients[]) {
            this.clientsName.showClients(clients);
            let disposable = this.dialogService.addDialog(PopupComponent, {
                title: 'Confirm title',
                message: 'Confirm message'})
                .subscribe((isConfirmed)=>{
                    // We get dialog result
                    if(isConfirmed) {

                    }
                    else {
                        alert('declined');
                    }
                });
            // We can close dialog calling disposable.unsubscribe();
            // If dialog was not closed manually close it by timeout
            // setTimeout(()=>{
            //     disposable.unsubscribe();
            // }, 10000);
        }
}
