import {Clients} from './Clients';
import {Subscriptions} from './Subscriptions';
export class ResponseeSuccess {
  constructor(public apiKey: string,
              public AuditDate: string,
              public clients: Array<Clients>,
              public CreateDate: string,
              public emailAddress: string,
              public firstName: string,
              public isActive: boolean,
              public isExistingUser: boolean,
              public isLastLogin: string,
              public lastName: string,
              public Subscriptions: Array<Subscriptions>,
              public success: boolean) {
}
}
