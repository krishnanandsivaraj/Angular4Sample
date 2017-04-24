import { Component, NgModule } from '@angular/core';
import {Product} from './Product';
import {TableData} from './table-data';
@Component({
  selector: 'my-pagination',
  template: ` 
	<div class="form-group" class="admin-quickactions ng-scope">
			<label>Search by Name </label>
			<input  type="text"   id="inputName" [(ngModel)]="inputName"/>
			<input type="button" (click)="FilterByName()" value="Apply"/>
	</div>
	<div class='row'>
       <div class="panel panel-default">
        <!-- Default panel contents -->
        <div class='panel-body'>
			<table class="table table-bordered table-condensed ">
				<thead class="ngTopPanel ng-scope">
            <th>Name</th>
            <th>Position</th>
            <th>Office</th>
            <th>Ext</th>
            <th>startDate</th>
            <th>salary</th>
        </thead>
				<tbody>
					<tr *ngFor="let item of items">
				<td>{{item.name}}</td>
                 <td>{{item.position}}</td>
				 <td>{{item.office}}</td>
                 <td>{{item.ext}}</td>
                 <td>{{item.startDate}}</td>
                 <td>{{item.salary}}</td>
					</tr>
				</tbody>
			</table>
			<div class="btn-toolbar" role="toolbar" style="margin: 0;">
			   <div class="btn-group">
					<label style="margin-top:10px">Page {{currentIndex}}/{{pageNumber}}</label>
				</div>
				 <div class="btn-group pull-right">
					<ul class="pagination" >
						<li [ngClass]="{'disabled': (currentIndex == 1 || pageNumber == 0)}" ><b  (click)="prevPage()">Prev</b></li>
							<li *ngFor="let page of pagesIndex"   [ngClass]="{'active': (currentIndex == page)}">
								<b (click)="setPage(page)" href="#" >{{page}}</b>
							</li>
						<li [ngClass]="{'disabled': (currentIndex == pageNumber || pageNumber == 0)}" ><b    (click)="nextPage()" >Next</b></li>
					</ul>
				 </div>
			</div>
		</div>
	</div>	
  `,
  styles: ['.pagination { margin: 0px !important; }']
})
export class Pagination {

	filteredItems : Product[];
	pages : number = 4;
    pageSize : number = 5;
	pageNumber : number = 0;
	currentIndex : number = 1;
	items: Product[];
	pagesIndex : Array<number>;
	pageStart : number = 1;
	inputName : string = '';

	constructor( ){
			this.filteredItems = TableData;
		  this.init();
	};
	init(){
			this.currentIndex = 1;
			this.pageStart = 1;
			this.pages = 4;

			this.pageNumber = parseInt(""+ (this.filteredItems.length / this.pageSize));
			if(this.filteredItems.length % this.pageSize != 0){
				this.pageNumber ++;
			}
	 
			if(this.pageNumber  < this.pages){
					this.pages =  this.pageNumber;
			}
		 
			this.refreshItems();
			console.log("this.pageNumber :  "+this.pageNumber);
	}

	FilterByName(){
		this.filteredItems = [];
		if(this.inputName != ""){
				TableData.forEach(element => {
 					if(element.name.toUpperCase().indexOf(this.inputName.toUpperCase())>=0){
						this.filteredItems.push(element);
					}
				});
		}else{
			this.filteredItems = TableData;
		}
		console.log(this.filteredItems);
		this.init();
	}
	fillArray(): any{
		var obj = new Array();
		for(var index = this.pageStart; index< this.pageStart + this.pages; index ++) {
						obj.push(index);
		}
		return obj;
	}
  refreshItems(){
					this.items = this.filteredItems.slice((this.currentIndex - 1)*this.pageSize, (this.currentIndex) * this.pageSize);
					this.pagesIndex =  this.fillArray();
	}
	prevPage(){
		if(this.currentIndex>1){
			this.currentIndex --;
		} 
		if(this.currentIndex < this.pageStart){
			this.pageStart = this.currentIndex;
		}
		this.refreshItems();
	}
	nextPage(){
		if(this.currentIndex < this.pageNumber){
				this.currentIndex ++;
		}
		if(this.currentIndex >= (this.pageStart + this.pages)){
			this.pageStart = this.currentIndex - this.pages + 1;
		}
 
		this.refreshItems();
	}
 	setPage(index : number){
	 		this.currentIndex = index;
	 		this.refreshItems();
 	}

 }