import { Utitilities } from './../../../../../scripts/app/utilities';
import { DataAdapter } from '../../../../../scripts/app/dataadapter';
import { Jsonp } from '@angular/http';
import { Router } from '@angular/router';
import { baseApiUrl } from './../../../../../scripts/app/appsettings';
import { Responsee } from './../../login/response';
import { ResponseeSuccessResult } from './../../login/modals/responseeSuccessResult';
import { ResponseeSuccess } from './../../login/modals/responseeSuccess';
import { Clients } from './../../login/modals/clients';
import { OnInit } from '@angular/core/core';
import { Component } from '@angular/core';


import { DialogComponent, DialogService } from 'ng2-bootstrap-modal';


export interface ConfirmModel {
  title:string;
  message:string;
}

@Component({
    selector: 'tkpi-login-popup',
    styleUrls: ['../css/style.css'],
    // templateUrl: '../templates/template.html',
    templateUrl: '../templates/template.html'
  }

)


export class PopupComponent extends DialogComponent<ConfirmModel, boolean> implements ConfirmModel,OnInit {
  title: string;
  message: string;
  clientName: string;
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

  constructor(dialogService: DialogService, private jsonp: Jsonp, private da: DataAdapter,private router:Router) {
    super(dialogService);
  }
  confirm() {
    // we set dialog result as true on click on confirm button,
    // then we can get dialog result from caller code
    this.result = true;
    this.close();
  }
  showClients(clientsinput: Clients[]){
    console.log(clientsinput);

    this.clients = clientsinput;
    // alert(this.clients);
  }
  closeModal(){
    this.close();
  }

  submit(){
    this.close();
      this.router.navigateByUrl('/admin');
  }

    public ngOnInit(): void {
        let result =  this.da.CreateDataSource(this.baseapi, 'flavelle@softcrylic.com', 'Test123');
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
      }
    });
        //this.clients= clientsinput;
    }
}
