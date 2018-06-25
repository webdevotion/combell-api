/**
 * MIT License
 *
 * Copyright (c) 2018 Bram Plessers
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var crypto = require('crypto');
var axios = _interopDefault(require('axios'));

function randomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function concat(values, delimiter) {
  return values.join(delimiter);
}

function now() {
  return new Date();
}

function epoch() {
  // unix timestamp in seconds
  return Math.floor(now() / 1000);
}

// generates a base 64 hmac with given text and secret
function hmacify(text, secret) {
  return crypto.createHmac('sha256', secret).update(text).digest('base64');
}

class Authorization {
  constructor(key, secret) {
    this.key = key;
    this.secret = secret;
  }

  getApiKey() {
    return this.key;
  }

  getAPISecret() {
    return this.secret;
  }

  getEpoch() {
    return epoch();
  }

  getNonce() {
    return randomString(32);
  }

  getHmacInputText(input) {
    return concat(input, '');
  }

  options(url, authHeaderValue) {
    return {
      headers: {
        Authorization: `hmac ${authHeaderValue}`,
        'Content-Type': 'application/json'
      },
      url
    };
  }

  inputForHmac(apiKeyValue, endpoint, bodyHash) {
    const httpMethod = endpoint.method;
    const action = encodeURIComponent(endpoint.path);
    const epoch$$1 = this.getEpoch();
    const nonce = this.getNonce();
    const secret = this.getAPISecret();

    const concatenated = this.getHmacInputText([apiKeyValue, httpMethod, action, epoch$$1, nonce, bodyHash]);
    return {
      text: concatenated,
      epoch: epoch$$1,
      nonce,
      secret
    };
  }

  authorizationHeaderValue(apiKeyValue, endpoint) {
    const bodyHash = null; // no body request at the moment, must be null
    const hmacParams = this.inputForHmac(apiKeyValue, endpoint, bodyHash);
    const generatedHmac = hmacify(hmacParams.text, hmacParams.secret);

    // https://api.combell.com/v2/documentation#section/Authentication/Sending-an-authorized-request
    // > your_api_key:generated_hmac:nonce:unix_timestamp
    return concat([apiKeyValue, generatedHmac, hmacParams.nonce, hmacParams.epoch], ':');
  }

  headers(endpoint) {
    const val = this.authorizationHeaderValue(this.getApiKey(), endpoint);
    return this.options(endpoint.url, val);
  }
}

const endpoints = {
  ACCOUNTS: '/accounts'
};

const baseUrl = 'https://api.combell.com';
const version = () => '/v2';

const endpointify = (method, path) => ({
  method,
  path: version() + path,
  url: baseUrl + version() + path
});

const endpoint = point => {
  const GET = 'get';
  switch (point) {
    case endpoints.ACCOUNTS:
      return endpointify(GET, '/accounts');
    default:
      return endpointify(GET, '');
  }
};

const contexts = {
  general: {
    context: 'general_error'
  },
  request_setup: {
    context: 'request_setup_error'
  },
  no_response: {
    context: 'no_response_received'
  },
  auth_authorization_header_invalid_format: {
    context: 'authentication'
  },
  authorization_hmac_invalid: {
    context: 'hmac_authorization_header_invalid'
  }
};

const errorcontext = error => {
  const { status } = error.response;

  switch (status) {
    case 401:
      return contexts.auth_authorization_header_invalid_format.context;
    default:
      break;
  }

  let e = error.response.data.error_code;
  // not able to find an error code in axios response object
  if (!e) {
    // we have no clue what happened, throw general error
    return contexts.general.context;
  }

  // look up a more application centered error message
  e = contexts[e];
  // we haven't seen this before - throw general error
  if (!e) {
    return contexts.general.context;
  }

  // we have a clue what's going on and throw an error
  // which provides some application centric context
  // for example: 'authentication failed'
  return e.context;
};

// error is just axios' response object
const errorhandler = error => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    // console.log(error.request.headers)
    // console.log(error.response.status)
    // console.log(error.response.headers)
    const context = errorcontext(error);
    return new Error(context);
  } else if (error.request) {
    // The request was made but no response w2as received
    // `error.request` is an instance of XMLHttpRequest in the browser
    // and an instance of http.ClientRequest in node.js
    return new Error(contexts.no_response.context);
  }

  return new Error(contexts.general.context);
};

async function get(url, headers) {
  return axios.get(url, headers).catch(error => {
    throw errorhandler(error);
  });
}

async function index(auth) {
  const endpoint$$1 = endpoint(endpoints.ACCOUNTS);
  const headers = auth.headers(endpoint$$1);
  return get(endpoint$$1.url, headers);
}

class Combell {
  constructor(apiKey, apiSecret) {
    this.key = apiKey;
    this.secret = apiSecret;
  }

  // waiting for a future implementation where we can
  // for example warn the user about this issue by logging
  // or by invoking an error handler
  async errors(e) {
    switch (e.message) {
      case 'authentication':
        break;
      default:
        throw e;
        break;
    }
  }

  // returns an authentication instance for use in API calls
  auth() {
    return new Authorization(this.key, this.secret);
  }

  // returns empty array if catching an error
  // thrown by the accounts module
  async getAccounts() {
    try {
      return await index(this.auth());
    } catch (e) {
      // send thrown error to handler to properly tackle the issue
      throw e;
    }
  }
}

exports.default = Combell;