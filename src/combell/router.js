let endpoints = {
  ACCOUNTS: '/accounts'
}

let baseUrl = "https://api.combell.com"
let version = () => "/v2"

let endpointify = (method, path) => {
  return {
     'method': method
    ,'path': version() + path
    ,'url': baseUrl + version() + path
  }
}

let endpoint = (endpoint) => {
  let GET = 'get'
  switch(endpoint){
    case endpoints.ACCOUNTS:
      return endpointify(GET,"/accounts")
    default:
      return endpointify(GET,'')
  }
}

module.exports = {endpoints,endpoint}
