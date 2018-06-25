import chai from 'chai';
import * as sinon from 'sinon';
const { expect } = chai;

import * as router from '../../../lib/core/router';

import Authorization from '../../../lib/core/authorization';

describe('Authorization', () => {

  let subject
  const apiKey = '00000-00000-00000';
  const apiSecret = '00000-00000-00000';

  beforeEach( () => {
    
  })

  describe('HMAC', () => {
    it('should should provide correct input for hmac generator', () => {
      subject = new Authorization(apiKey,apiSecret)

      let epochStub   = sinon.stub( subject, 'getEpoch' ).returns(0);
      let nonceStub   = sinon.stub( subject, 'getNonce' ).returns('abcde');
      let keyStub     = sinon.stub( subject, 'getApiKey' ).returns(apiKey);
      let secretStub  = sinon.stub( subject, 'getApiSecret' ).returns(apiSecret);

      const endpoint = router.endpoint(router.endpoints.ACCOUNTS);
      const bodyHash = '';
      const httpMethod = 'get';
      const epoch = 0;
      const nonce = 'abcde';

      const hmacInput = subject.inputForHmac(apiKey, endpoint, bodyHash);

      expect(hmacInput.epoch).to.eq(0);
      expect(hmacInput.secret).to.eq(apiSecret);
      expect(hmacInput.nonce).to.eq('abcde');
      expect(hmacInput.text).to.eq(apiKey + httpMethod + encodeURIComponent(endpoint.path) + epoch + nonce + bodyHash);

      epochStub.restore(); 
      nonceStub.restore(); 
      keyStub.restore();   
      secretStub.restore();
    });


    it('should use valid HMAC auth header', async () => {
      subject = new Authorization(apiKey,apiSecret)

      let epochStub   = sinon.stub( subject, 'getEpoch' ).returns(0);
      let nonceStub   = sinon.stub( subject, 'getNonce' ).returns('abcde');
      let keyStub     = sinon.stub( subject, 'getApiKey' ).returns(apiKey);
      let secretStub  = sinon.stub( subject, 'getApiSecret' ).returns(apiSecret);

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

      epochStub.restore(); 
      nonceStub.restore(); 
      keyStub.restore();   
      secretStub.restore();
    });
  });
});
