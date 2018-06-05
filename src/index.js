require('dotenv').config();

const Combell = require('./combell.js');

// get /v2/accounts
const accounts = Combell.getAccounts().then((accounts) => {
  // accounts is an array of account objects
});

module.exports = {};
