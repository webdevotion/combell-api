import querystring from 'querystring';
export const endpoints = {
  ACCOUNTS: '/accounts',
  DOMAINS: '/domains',
  HOSTINGS: '/linuxhostings',
};

export const baseURL = 'https://api.combell.com'
const version = () => '/v2';

const combineURL = (base,relative) => {
  return relative
    ? base.replace(/\/+$/, '') + '/' + relative.replace(/^\/+/, '')
    : base;
}

/**
 * Creates a valid path components string from an array of {string|object}
 * by combining API Endpoint path, URL components and URL query params
 *
 * @param {Object[]} components Array of strings or numbers
 * @returns {String} valid string of path components delimited with '/'
 */
const pathComponentsify = (components) => {
  components = components ? components : [];
  return components
    .filter( pc => pc ) // get rid of nulls
    .map( pc => String(pc).trim() ) // get rid of leading & trailing whitspace
    .map( encodeURIComponent ) // encode each path component
    .join("/"); // join path components into one string with / delimiter
}

const paramsify = ( params ) => {
  if( params == null ){
    return "";
  }

  return "?" + querystring.stringify(params);
}


const endpointify = (method, path, pathComponents = [], urlParams = null) => {
  pathComponents = pathComponentsify(pathComponents);

  let params = paramsify( urlParams );
  let prefix = version() + path;
  let relativeURL = combineURL( prefix, pathComponents + params);
  let fullURL = combineURL( baseURL, relativeURL);

  return {
    method,
    path: relativeURL,
    url: fullURL
  }
}

/**
 * Creates a new endpoint object 
 * by combining API Endpoint path, URL components and URL query params
 *
 * @param {string} point Relative path to the API endpoint w/o path variables
 * @param {String[]} pathComponents Additional URL components
 * @param {Object.<string,string|number>} urlParams Object with properties 
 *  to be added as query params
 * @returns { method, path, url } an ( anonymous ) Endpoint object 
 */
export const endpoint = (point, pathComponents = [], urlParams = null) => {
  const GET = 'get';

  switch (point) {
    case endpoints.ACCOUNTS:
      return endpointify(GET, point, pathComponents, urlParams);
    case endpoints.DOMAINS:
      return endpointify(GET, point, pathComponents, urlParams);
    case endpoints.HOSTINGS:
      return endpointify(GET, point, pathComponents, urlParams);
    default:
      break;
  }

  return endpointify(GET, '');
}
