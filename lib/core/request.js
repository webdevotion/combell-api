import axios from 'axios'
import * as response from './response'

export async function get(url, headers) {
  return axios.get(url, headers).catch((error) => {
    throw response.errorhandler(error);
  });
}

module.exports = { get };
