import Authorization  from './core/authorization.js'
import * as accounts from './core/accounts'
import * as domains from './core/domains'
import * as hostings from './core/hostings'

export default class Combell {
  constructor( apiKey, apiSecret ){
    this.key = apiKey;
    this.secret = apiSecret;
  }

  // waiting for a future implementation where we can
  // for example warn the user about this issue by logging
  // or by invoking an error handler
  async errors (e) {
    switch (e.message) {
      case 'authentication':
        break;
      default:
        throw e;
    }
  };

  // returns an authentication instance for use in API calls
  auth () {
    return new Authorization(this.key,this.secret);
  }

  async getRequest( resource, pathcomponents){
    try {
      const authorization = this.auth();
      return await resource.call( this, authorization, pathcomponents );
    } catch (e) {
      // send thrown error to handler to properly tackle the issue
      throw e;
    }
  }

  async getAccounts () {
    return await this.getRequest( accounts.index );
  }

  async getAccount (id) {
    if( id == null ){
      throw new Error('requires one parameter of type Number')
    }
    return await this.getRequest( accounts.show, id );
  }

  async getDomains () {
    return await this.getRequest( domains.index );
  };

  async getHostings () {
    return await this.getRequest( hostings.index );
  };
}
