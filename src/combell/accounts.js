const router = require('./router');
const request = require('./request');

const index = async (auth) => {
  const endpoint = router.endpoint(router.endpoints.ACCOUNTS);
  const headers = auth.headers(endpoint);
  return await request.get(endpoint.url, headers);
};

module.exports = { index };
