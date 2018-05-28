require('dotenv').config()

let Combell = require('./combell.js')

// get /v2/accounts
let accounts = Combell.getAccounts().then( accounts => {
  if( accounts.error_code ){
    console.error( accounts.error_text )
  }
})

module.exports = {}
