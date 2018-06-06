const axios = require('axios');
const response = require('./response');

const get = async (url, headers) => axios.get(url, headers).catch((error) => {
  throw response.errorhandler(error);
});

module.exports = { get };
