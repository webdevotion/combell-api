// require necessary libraries and test for their presence
let Combell;
try {
  Combell = require('./combell.js')
} catch (err) {
  console.log(err)
}

// get /v2/accounts
Combell.getAccounts()

module.exports = {}
