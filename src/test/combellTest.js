import * as chai from 'chai';

import chaiAsPromised from 'chai-as-promised';

const sinon = require('sinon');

const { expect } = chai;
chai.use(chaiAsPromised);

const subject = require('../combell');

const accounts = require('../combell/accounts');
const authorization = require('../combell/authorization');

describe('Combell', () => {
  describe('fetch accounts', () => {
    it('should call accounts.index exactly once', () => {
      const mock = sinon.mock(accounts);
      mock.expects('index').once();
      subject.getAccounts();
      mock.verify();
      mock.restore();
    });

    it('should return empty array when error was thrown', () => {
      // test scenario where server response results in an error being thrown
      const generalError = sinon.stub(accounts, 'index');
      // throw an error like the accounts module would if appropriate
      generalError.throws('default', 'general_error');

      expect(subject.getAccounts()).to.eventually.exist
        .and.to.be.a('array')
        .and.to.have.length(0);

      generalError.restore();

      const authenticationFailed = sinon.stub(accounts, 'index');
      // throw an error like the accounts module would if appropriate
      authenticationFailed.throws('authentication', 'authentication');

      expect(subject.getAccounts()).to.eventually.exist
        .and.to.be.a('array')
        .and.to.have.length(0);

      authenticationFailed.restore();
    });
  });
});
