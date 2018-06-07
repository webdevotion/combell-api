import { expect } from 'chai';

const subject = require('../../../lib/combell/router.js');


describe('Router', () => {
  describe('endpoint', () => {
    it('should return an object with method, path and url', () => {
      const point = subject.endpoint(subject.endpoints.ACCOUNTS);
      expect(point).to.be.a('object');
      expect(point).to.be.a('object');
      expect(point.method).to.be.a('string');
      expect(point.path).to.be.a('string');
      expect(point.url).to.be.a('string');

      expect(point.method).to.eq('get');
      expect(point.path).to.eq('/v2/accounts');
      expect(point.url).to.eq('https://api.combell.com/v2/accounts');
    });

    it('should return an object without path as default', () => {
      const point = subject.endpoint('default-case');
      expect(point).to.be.a('object');
      expect(point).to.be.a('object');
      expect(point.method).to.be.a('string');
      expect(point.path).to.be.a('string');
      expect(point.url).to.be.a('string');

      expect(point.method).to.eq('get');
      expect(point.path).to.eq('/v2');
      expect(point.url).to.eq('https://api.combell.com/v2');
    });
  });

  describe('endpoints', () => {
    it('should return endpoint path without versioning', () => {
      const path = subject.endpoints.ACCOUNTS;
      expect(path).to.eq('/accounts');
    });
  });
});