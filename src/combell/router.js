let endpoints = {
  ACCOUNTS: '/accounts'
}

let baseUrl = process.env.COMBELL_API_URL || "https://api.combell.com"
let version = () => process.env.COMBELL_API_VERSION || "/v2"

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

module.exports = {endpoints,endpoint,baseUrl,version}
