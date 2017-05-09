import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
    selector: 'nav-menu',
    styleUrls:['./navmenu.css'],
    templateUrl:'./navmenu.html'
})
export class NavComponent{
    constructor(private router: Router){}
   private firstname:string="Fransis";
   private lastname:string="lavelle";
   private clientName:string="TapestryKPI";
   private homepageurl:string="./img/global-sprite.png";

logout(){
    this.router.navigate(['./login']);
}

reports(){
    this.router.navigate(['./reports']);
}
}

export class user
{
    public firstName:string;
    public lastName:string;
    public clientName:string;
}