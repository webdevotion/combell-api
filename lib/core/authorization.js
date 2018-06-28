import * as Utils from '../helpers/utils'
import * as Security from '../helpers/security'

export default class Authorization {
  constructor(key,secret){
    this.key = key;
    this.secret = secret
  }

  getApiKey () {
    return this.key;
  }

  getApiSecret () {
    return this.secret;
  }

  getEpoch () {
    return Utils.epoch();
  }

  getNonce () {
    return Utils.randomString(32);
  }

  getHmacInputText (input){
    return Utils.concat(input, '');
  }

  options (url, authHeaderValue) {
    return {
      headers: {
        Authorization: `hmac ${authHeaderValue}`,
        'Content-Type': 'application/json',
        'User-Agent': 'combell-api-node-js'
      },
      url,
    }
  };

  inputForHmac (apiKeyValue, endpoint, bodyHash) {
    const httpMethod = endpoint.method;
    const action = encodeURIComponent(endpoint.path);
    const epoch = this.getEpoch();
    const nonce = this.getNonce();
    const secret = this.getApiSecret();

    const concatenated = this.getHmacInputText([apiKeyValue, httpMethod, action, epoch, nonce, bodyHash]);
    return {
      text: concatenated,
      epoch,
      nonce,
      secret
    };
  };

  authorizationHeaderValue (apiKeyValue, endpoint) {
    const bodyHash = null; // no body request at the moment, must be null
    const hmacParams = this.inputForHmac(apiKeyValue, endpoint, bodyHash);
    const generatedHmac = Security.hmacify(hmacParams.text, hmacParams.secret);

    // https://api.combell.com/v2/documentation#section/Authentication/Sending-an-authorized-request
    // > your_api_key:generated_hmac:nonce:unix_timestamp
    return Utils.concat([apiKeyValue, generatedHmac, hmacParams.nonce, hmacParams.epoch], ':');
  };

  headers (endpoint) {
    const val = this.authorizationHeaderValue(this.getApiKey(), endpoint);
    return this.options(endpoint.url, val);
  };
}
