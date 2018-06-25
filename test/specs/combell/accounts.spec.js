import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
const { expect } = chai.use(chaiAsPromised);

import nock from 'nock';
import rewire from 'rewire';

const router = rewire('../../../lib/core/router');
const subject = rewire('../../../lib/core/accounts');

import Authorization from '../../../lib/core/authorization'

describe('Accounts', () => {
  let authentication

  beforeEach( () => {
    authentication = new Authorization('0','0')
  })

  describe('test non 200 http status codes', () => {
    const endpoint = router.endpoint(router.endpoints.ACCOUNTS);

    it('should handle a 404 with an error', async () => {
      // nock will release the matched http request after each call
      nock(router.baseUrl, { requestHeaders: null })
        .get(endpoint.path)
        .reply(404);

      expect(subject.index(authentication)).to.be.rejectedWith(Error);
    });
  });

  describe('get accounts index', () => {
    let api;
    const endpoint = router.endpoint(router.endpoints.ACCOUNTS);
    const nockData = [{ id: 0, identifier: 'string' }];

    it('should return all accounts for this user', async () => {
      // nock will release the matched http request after each call
      api = nock(router.baseUrl, { requestHeaders: authentication.headers(endpoint) });

      api
        .get(endpoint.path)
        .reply(200, nockData);

      const response = await subject.index(authentication);
      chai.expect(response.status).to.eq(200);

      const { data } = response;
      expect(data).to.be.a('array');
      expect(data.length).to.eq(1);
      expect(data[0].id).to.eq(0);

      // inspect the generated hmac sig
      const authorizationHeader = response.request.headers.authorization;
      const authorizationHeaderParts = authorizationHeader.split(':');
      expect(authorizationHeaderParts.length).to.eq(4);
    });

    it('should handle 401 if not authorized', async () => {
      // nock will release the matched http request after each call
      api = nock(router.baseUrl, { requestHeaders: null });

      api
        .get(endpoint.path)
        .reply(401);

      expect(subject.index(authentication)).to.be.rejectedWith(Error, 'authentication');
    });
  });
});
