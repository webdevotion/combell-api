let chai = require('chai')
let expect = chai.expect

// lets us mock functions from required modules
let rewire = require('rewire')
// require becomes rewire when using 'rewire'
let subject = rewire('../utils')

describe('Utils', function () {
  describe('random string generator', function () {
    it("should generate a 16 character random string", function () {
      let length = 0
      let random = subject.randomString(length)
      expect(random.length).to.be.equal(length)

      length = 16
      random = subject.randomString(length)
      expect(random.length).to.be.equal(length)

      length = 32
      random = subject.randomString(length)
      expect(random.length).to.be.equal(length)
    });
  });

  describe('concat strings with delimiter', function () {
    it("should concat strings with given delimiter", function () {
      let strings = ['a','b','c']
      let noDelimiter = subject.concat(strings,'')
      let delimiter = subject.concat(strings,':')
      expect(delimiter).to.be.equal('a:b:c')
      expect(noDelimiter).to.be.equal('abc')
    });
  });

  describe('return current unix timestamp', function () {
    beforeEach( () => subject.__set__("now",() => 1001) );

    it("should return current timestamp", () => {
      expect(subject.epoch() ).to.be.a('number')
    });
    it("should return current timestamp in seconds", () => {
      expect(subject.epoch() ).to.be.equal(1);
    });
  });
})
