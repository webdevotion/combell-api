const Utils = require('../utils');
const Security = require('../security');

const apiKey = () => process.env.COMBELL_API_KEY || '00000-00000-00000';

// PUBLIC

const headers = (endpoint) => {
  const val = authorizationHeaderValue(apiKey, endpoint);
  return options(endpoint.url, val);
};

// PRIVATE
let options = (url, authHeaderValue) => {
  return {
    headers: {
      Authorization: `hmac ${authHeaderValue}`,
      'Content-Type': 'application/json',
    },
    url
  }
};

const getEpoch = () => {
  return Utils.epoch();
}

const getNonce = () => {
  return Utils.randomString(32);
}

const getHmacInputText = options => {
  return Utils.concat(options, '');
}

const inputForHmac = (apiKey, endpoint, bodyHash) => {
  const httpMethod = endpoint.method;
  const action = endpoint.path;
  const epoch = getEpoch();
  const nonce = getNonce();
  const concatenated = getHmacInputText([apiKey, httpMethod, action, epoch, nonce, bodyHash]);
  return {
    text: concatenated,
    epoch,
    nonce,
  };
};

let authorizationHeaderValue = (apiKey, endpoint) => {
  const bodyHash = ''; // empty, no body request at the moment
  const hmacParams = inputForHmac(apiKey, endpoint, bodyHash);
  const generatedHmac = Security.hmacify(hmacParams.text, hmacParams.nonce);

  // https://api.combell.com/v2/documentation#section/Authentication/Sending-an-authorized-request
  // > your_api_key:generated_hmac:nonce:unix_timestamp
  return Utils.concat([apiKey(), generatedHmac, hmacParams.nonce, hmacParams.epoch], ':');
};

module.exports = { headers, inputForHmac };
