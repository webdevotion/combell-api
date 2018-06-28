import { expect } from 'chai';

const subject = require('../../../lib/core/router.js');


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

    it('should return endpoint without path variables or query params', () => {
      const point = subject.endpoint(subject.endpoints.HOSTINGS, ['path-component'], {id:1});
      expect(point).to.be.a('object');
      expect(point).to.be.a('object');
      expect(point.method).to.be.a('string');
      expect(point.path).to.be.a('string');
      expect(point.url).to.be.a('string');

      let suffix = '/v2/linuxhostings/path-component?id=1';
      expect(point.method).to.eq('get');
      expect(point.path).to.eq(suffix);
      expect(point.url).to.eq('https://api.combell.com' + suffix);
    });

    it('should return valid endpoint when pathcomponents = null and urlparams = null', () => {
      const point = subject.endpoint(subject.endpoints.DOMAINS, null, null);
      expect(point).to.be.a('object');
      expect(point).to.be.a('object');
      expect(point.method).to.be.a('string');
      expect(point.path).to.be.a('string');
      expect(point.url).to.be.a('string');

      expect(point.method).to.eq('get');
      expect(point.path).to.eq('/v2/domains');
      expect(point.url).to.eq('https://api.combell.com/v2/domains');
    });
  });

  describe('endpoints', () => {
    it('should return endpoint path without versioning', () => {
      const accounts = subject.endpoints.ACCOUNTS;
      expect(accounts).to.eq('/accounts');

      const domains = subject.endpoints.DOMAINS;
      expect(domains).to.eq('/domains');

      const hostings = subject.endpoints.HOSTINGS;
      expect(hostings).to.eq('/linuxhostings');
    });
  });
});
