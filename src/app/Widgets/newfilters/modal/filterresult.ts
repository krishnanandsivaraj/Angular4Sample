export class filterresult{
    public id:string;
    public filters:[filters]
}

class filters{
    public data:[filterdata];
    public name:string;
    public displayName:string;
    public description:string;
    public isactive:boolean;

}
class filterdata{
    public displayname:string;
    public id:string;
}

