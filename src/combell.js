let authorization = require('./combell/authorization.js')
let accounts = require('./combell/accounts')
authorization.apiKey = process.env.COMBELL_API_KEY || ''

let getAccounts = () => {
  accounts.index(authorization)
}

module.exports = {getAccounts}
