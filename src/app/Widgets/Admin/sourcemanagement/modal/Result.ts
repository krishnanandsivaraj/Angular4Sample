import{Accounts} from './Accounts';
import{ConnectionType}from './ConnectionType';
export class Result
{
    public name:string;
    public displayName:string;
    public description:string;
    public platform:string;
    public enabled:string;
    public hasconnector:string;
    public lastaccess:string;
    public accounts:[Accounts];
    public email:[string];
    public ConnectionType:[ConnectionType];
}