require('crypto');


// production apps should never use dotenv to load secrets
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const Combell = require('../../dist/combell.js').default;

let key = process.env.COMBELL_API_KEY;
let secret = process.env.COMBELL_API_SECRET;

let combell = new Combell(key,secret);

// get /v2/accounts, which might throw, or return an array of 'account' objects
let accounts = combell.getAccounts()
  .then(result => console.log(result.data))
  .catch(e => console.log(e));

module.exports = {};
