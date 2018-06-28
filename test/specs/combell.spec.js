import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

const sinon = require('sinon');
const { expect } = chai.use(chaiAsPromised);

import Combell from '../../lib/combell';
const accounts = require('../../lib/core/accounts');
const domains = require('../../lib/core/domains');
const hostings = require('../../lib/core/hostings');

describe('Combell', () => {
  describe('fetch accounts', () => {
    it('should call accounts.index exactly once', () => {
      let subject = new Combell('0','0');
      const mock = sinon.mock(accounts);
      mock.expects('index').once();
      subject.getAccounts();
      mock.verify();
    });

    it('should call accounts.show exactly once', () => {
      let subject = new Combell('0','0');
      const mock = sinon.mock(accounts);
      mock.expects('show').once();
      subject.getAccount(0);
      mock.verify();
    });

    it('should call hostings.index exactly once', () => {
      let subject = new Combell('0','0');
      const mock = sinon.mock(hostings);
      mock.expects('index').once();
      subject.getHostings();
      mock.verify();
    });

    it('should call domains.index exactly once', () => {
      let subject = new Combell('0','0');
      const mock = sinon.mock(domains);
      mock.expects('index').once();
      subject.getDomains();
      mock.verify();
    });

    it('should return empty array when error was thrown', () => {
      // test scenario where server response results in an error being thrown
      const generalError = sinon.stub(accounts, 'index');
      // throw an error like the accounts module would if appropriate
      generalError.throws('default', 'general_error');

      let subject = new Combell('0','0');

      expect(subject.getAccounts()).to.be.rejectedWith(Error);

      generalError.restore();

      const authenticationFailed = sinon.stub(accounts, 'index');
      // throw an error like the accounts module would if appropriate
      authenticationFailed.throws('authentication', 'authentication');
      expect(subject.getAccounts()).to.be.rejectedWith(Error);

      authenticationFailed.restore();
    });

    it('should throw errors which are not handled internally', () => {
      // test scenario where server response results in an error being thrown
      const uniqueError = sinon.stub(accounts, 'index');
      // throw an error which we can't possibly know
      let message = 'should be catched by application';
      uniqueError.throws('unknown_error_123abc', message);

      let subject = new Combell('0','0');
      expect(subject.getAccounts()).to.be.rejectedWith(Error, message);
      
      uniqueError.restore();
    });
  });
});
