const endpoints = {
  ACCOUNTS: '/accounts',
};

const baseUrl = process.env.COMBELL_API_URL || 'https://api.combell.com';
const version = () => process.env.COMBELL_API_VERSION || '/v2';

const endpointify = (method, path) => ({
  method,
  path: version() + path,
  url: baseUrl + version() + path,
});

const endpoint = (point) => {
  const GET = 'get';
  switch (point) {
    case endpoints.ACCOUNTS:
      return endpointify(GET, '/accounts');
    default:
      return endpointify(GET, '');
  }
};

module.exports = {
  endpoints, endpoint, baseUrl, version,
};
