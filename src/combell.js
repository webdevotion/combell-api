let key = "xxx"
let authorization = require('./combell/authorization.js')
let accounts = require('./combell/accounts')

authorization.apiKey = key

let getAccounts = () => {
  accounts.index(authorization)
}

module.exports = {getAccounts}
