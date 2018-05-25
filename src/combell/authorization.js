let Utils     = require('../utils')
let Security  = require('../security')

// PUBLIC

let headers = ( endpoint ) => {
  return options( endpoint.url, authorizationHeaderValue(apiKey, endpoint) )
}

let apiKey

// PRIVATE
let options = ( url, authHeaderValue) => {
  return {
    "headers": {
      "Authorization": 'hmac ' + authHeaderValue,
      'Content-Type': 'application/json'
    },
    "url": url
  }
}

let authorizationHeaderValue = (apiKey, endpoint) => {
  let httpMethod = endpoint.method;
  let action = endpoint.path
  let epoch = Utils.epoch()
  let nonce = Utils.randomString(32)
  let bodyHash = '' // empty, no body request at the moment

  // concat strings to satisfy combell requirements ( no delimiter is used )

  // - apikey
  // - (lowercased) request method ( get, post, put, ... )
  // - path (including API version and slashes) and querystring information
  // - unix timestamp in seconds
  // - nonce ( = random throwaway string )
  // - content IF body is not empty, MD5 hash of the request body

  let text = Utils.concat([apiKey, httpMethod, action, epoch, nonce, bodyHash], '');
  let hmac = Security.hmacify(text,nonce)

  // https://api.combell.com/v2/documentation#section/Authentication/Sending-an-authorized-request
  // > your_api_key:generated_hmac:nonce:unix_timestamp
  let authHeaderValue = Utils.concat([apiKey, hmac, nonce, epoch], ':')
  return authHeaderValue
}

module.exports = {headers}
