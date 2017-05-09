export class Utitilities{
    getDataAdapterInstance: any= function(url: string, username: string, password: string){
        return url+ '?&method=JSONP_CALLBACK&loginTime=%222017-04-19T12:19:46.014Z%22&password='+password+'&username='+username+'&callback=JSONP_CALLBACK';
}
}