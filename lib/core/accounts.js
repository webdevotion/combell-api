import * as router from './router'
import * as request from './request'

export async function index (auth) {
  const endpoint = router.endpoint(router.endpoints.ACCOUNTS);
  const headers = auth.headers(endpoint);
  return request.get(endpoint.url, headers);
}
