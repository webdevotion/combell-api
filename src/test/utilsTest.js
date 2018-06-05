import * as chai from 'chai';
import rewire from 'rewire';

const { expect } = chai;

// require becomes rewire when using 'rewire'
const subject = rewire('../utils');

describe('Utils', () => {
  describe('random string generator', () => {
    it('should generate a 16 character random string', () => {
      let length = 0;
      let random = subject.randomString(length);
      expect(random.length).to.be.equal(length);

      length = 16;
      random = subject.randomString(length);
      expect(random.length).to.be.equal(length);

      length = 32;
      random = subject.randomString(length);
      expect(random.length).to.be.equal(length);
    });
  });

  describe('concat strings with delimiter', () => {
    it('should concat strings with given delimiter', () => {
      const strings = ['a', 'b', 'c'];
      const noDelimiter = subject.concat(strings, '');
      const delimiter = subject.concat(strings, ':');
      expect(delimiter).to.be.equal('a:b:c');
      expect(noDelimiter).to.be.equal('abc');
    });
  });

  describe('return current unix timestamp', () => {
    beforeEach(() => subject.__set__('now', () => 1001));

    it('should return current timestamp', () => {
      expect(subject.epoch()).to.be.a('number');
    });
    it('should return current timestamp in seconds', () => {
      expect(subject.epoch()).to.be.equal(1);
    });
  });
});
