export const endpoints = {
  ACCOUNTS: '/accounts',
};

const baseUrl = 'https://api.combell.com'
const version = () => '/v2';

const endpointify = (method, path) => ({
  method,
  path: version() + path,
  url: baseUrl + version() + path,
});

export const endpoint = (point) => {
  const GET = 'get';
  switch (point) {
    case endpoints.ACCOUNTS:
      return endpointify(GET, '/accounts');
    default:
      return endpointify(GET, '');
  }
}
