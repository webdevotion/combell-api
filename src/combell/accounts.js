let Request   = require('request');
let Router    = require('./router')

let index = (auth) => {
  let endpoint = Router.endpoint(Router.endpoints.ACCOUNTS)
  let headers = auth.headers(endpoint)

  Request.get(headers, (error, response, body) => {
    if (error) {
      return console.dir(error)
    }
    console.dir(JSON.parse(body))
  });
}

module.exports = {index}
