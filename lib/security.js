
const Crypto = require('crypto');

// generates a base 64 hmac with given text and secret
module.exports.hmacify = (text, nonce) => Crypto.createHmac('sha256', nonce).update(text).digest('base64');
