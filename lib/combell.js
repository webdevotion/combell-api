import Authorization  from './core/authorization.js'
import * as accounts from './core/accounts'
import * as domains from './core/domains'
import * as hosting from './core/hostings'

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
        break;
    }
  };

  // returns an authentication instance for use in API calls
  auth () {
    return new Authorization(this.key,this.secret);
  }

  // returns empty array if catching an error
  // thrown by the accounts module
  async getAccounts () {
    try {
      return await accounts.index( this.auth() );
    } catch (e) {
      // send thrown error to handler to properly tackle the issue
      throw e;
    }
  };

  async getAccount (id) {
    if( id == null ){
      throw new Error('requires one parameter of type Number')
    }
    try {
      return await accounts.show( this.auth(), id );
    } catch (e) {
      // send thrown error to handler to properly tackle the issue
      throw e;
    }
  }

  async getDomains () {
    try {
      return await domains.index( this.auth() );
    } catch (e) {
      // send thrown error to handler to properly tackle the issue
      throw e;
    }
  };

  async getHostings () {
    try {
      return await hosting.index( this.auth() );
    } catch (e) {
      // send thrown error to handler to properly tackle the issue
      throw e;
    }
  };
}
