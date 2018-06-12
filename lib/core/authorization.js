import * as Utils from '../helpers/utils'
import * as Security from '../helpers/security'

const getApiKey = () => process.env.COMBELL_API_KEY || '00000-00000-00000';

// PRIVATE
const options = (url, authHeaderValue) => ({
  headers: {
    Authorization: `hmac ${authHeaderValue}`,
    'Content-Type': 'application/json',
  },
  url,
});

const getEpoch = () => Utils.epoch();

const getNonce = () => Utils.randomString(32);

const getHmacInputText = input => Utils.concat(input, '');

export function inputForHmac (apiKeyValue, endpoint, bodyHash) {
  const httpMethod = endpoint.method;
  const action = endpoint.path;
  const epoch = getEpoch();
  const nonce = getNonce();
  const concatenated = getHmacInputText([apiKeyValue, httpMethod, action, epoch, nonce, bodyHash]);
  return {
    text: concatenated,
    epoch,
    nonce,
  };
};

function authorizationHeaderValue (apiKeyValue, endpoint) {
  const bodyHash = ''; // empty, no body request at the moment
  const hmacParams = inputForHmac(apiKeyValue, endpoint, bodyHash);
  const generatedHmac = Security.hmacify(hmacParams.text, hmacParams.nonce);

  // https://api.combell.com/v2/documentation#section/Authentication/Sending-an-authorized-request
  // > your_api_key:generated_hmac:nonce:unix_timestamp
  return Utils.concat([apiKeyValue, generatedHmac, hmacParams.nonce, hmacParams.epoch], ':');
};

export function headers (endpoint) {
  const val = authorizationHeaderValue(getApiKey(), endpoint);
  return options(endpoint.url, val);
};
