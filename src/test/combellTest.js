let chai = require('chai')
let expect = chai.expect
let sinon = require('sinon')
// lets us mock private functions from required modules
let rewire = require('rewire')
// require becomes rewire when using 'rewire'
let subject = rewire('../combell')
// needed to mock functions from modules required by our test subject
let accounts = require('../combell/accounts')

describe('Combell', () => {
  describe('fetch accounts', () => {
    // beforeEach( () => subject.accounts.__set__("now",() => 1000) );

    it("should return all accounts for this user", () => {
      let mock = sinon.mock(accounts)
      mock.expects("index").once()
      subject.getAccounts()
      mock.verify()
      // expect(subject.getAccounts()).to.be.equal(1)

    });
  });
})
