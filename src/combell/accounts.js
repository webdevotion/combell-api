let axios   = require('axios');
let router    = require('./router')

let index = async (auth) => {
  let endpoint = router.endpoint(router.endpoints.ACCOUNTS)
  let headers = auth.headers(endpoint)
  try{
    let result = await axios.get(endpoint.url, headers);
    return result
  } catch (err) {
    return err.response.data
  }
}

module.exports = {index}
