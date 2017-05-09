import { Component } from '@angular/core';
@Component({
    selector: 'middle-tab',
    styleUrls: ['./middletab.css'],
    templateUrl: './middletab.html'
})
export class MiddleComponent{

    public navmenu:[
        {name: 'Source<br/>Management', url: '#'},
        {name: 'Retriever<br/>Management', url: ''},
        {name: 'Transformation<br/>Template', url: ''},
        {name: 'Document<br/>logs', url: ''},
        {name: 'User<br/>Management', url: ''} ];
    }
