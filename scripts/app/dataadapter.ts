import {Utitilities} from './utilities';
import { Injectable } from '@angular/core';

@Injectable()
export class DataAdapter
{

    constructor(private utility: Utitilities) {}
public CreateDataSource: any= function(url: string, username: string, password: string){
    return this.utility.getDataAdapterInstance(url + '/authentication/login', username, password);
};
}

