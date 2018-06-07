import * as chai from 'chai';

import rewire from 'rewire';

const { expect } = chai;

const router = require('../../combell/router');

const subject = rewire('../../combell/authorization');

describe('Authorization', () => {
  describe('HMAC', () => {
    const apiKey = '00000-00000-00000';

    it('should should provide correct input for hmac generator', () => {
      subject.__set__('getEpoch', () => 0);
      subject.__set__('getNonce', () => 'abcde');
      subject.__set__('getApiKey', () => apiKey);

      const endpoint = router.endpoint(router.endpoints.ACCOUNTS);
      const bodyHash = '';
      const httpMethod = 'get';
      const epoch = 0;
      const nonce = 'abcde';

      const hmacInput = subject.inputForHmac(apiKey, endpoint, bodyHash);

      expect(hmacInput.text).to.eq(apiKey + httpMethod + endpoint.path + epoch + nonce + bodyHash);
      expect(hmacInput.epoch).to.eq(0);
      expect(hmacInput.nonce).to.eq('abcde');
    });


    it('should use valid HMAC auth header', async () => {
      subject.__set__('getEpoch', () => 0);
      subject.__set__('getNonce', () => 'abcde');
      subject.__set__('getApiKey', () => apiKey);

      const endpoint = router.endpoint();
      const headers = subject.headers(endpoint);
      const authorizationHeader = headers.headers.Authorization;
      const prefix = authorizationHeader.substring(0, 5);
      const delimiter = ':';
      const parts = authorizationHeader.substring(prefix.length).split(delimiter);

      const key = parts[0];
      const hmac = parts[1];
      const nonce = parts[2];
      const epoc = parts[3];

      expect(prefix).to.eq('hmac ');
      expect(parts.length).to.eq(4);
      expect(key).to.eq(apiKey);
      expect(hmac).to.not.be.null;
      expect(nonce).to.eq('abcde');
      expect(epoc).to.eq('0');
    });
  });
});
