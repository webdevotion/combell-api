// production apps should never use dotenv to load secrets
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const combell = require('../dist/index.js');
// get /v2/accounts
// result is always an array of account objects
// even when an error is thrown you will get an empty array
combell.account.index().then(result => console.log(result));

module.exports = {};
