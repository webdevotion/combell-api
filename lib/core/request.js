import axios from 'axios'
import * as response from './response'

export async function get(url, config) {
  config.method = "get";
  return axios(config).catch((error) => {
    throw response.errorhandler(error);
  });
}
