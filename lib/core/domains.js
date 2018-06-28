import * as router from './router'
import * as request from './request'

const ENDPOINT = router.endpoints.DOMAINS;

export const index = async function (auth, components = null, params = null) {
  const endpoint = router.endpoint(ENDPOINT, components, params );
  const headers = auth.headers(endpoint);
  const config = headers;
  return request.get(endpoint.url, config);
}

export const show = async function (auth, id) {
  return this.index( auth, [id], null )
}