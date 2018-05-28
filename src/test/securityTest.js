let chai = require('chai')
let expect = chai.expect
// require becomes rewire when using 'rewire'
let subject = require('../security')

describe('Security', () => {
  describe('return valid hmac', () => {
    it("should return hmac", () => {
      expect(subject.hmacify('a','b')).to.be.a('string')
      // value was generated once and copy pasted here
      expect(subject.hmacify('a','a')).to.be.equal('Ps9TiOIg2p4PkZSF3rZ22L7jrsBGp3k1O0Y0GFEe5iI=')
    })
  })

  describe('return base 64 based hmac', () => {
    it("should equal to known value", () => {
      // test hmac generator against a known value from Combell support
      let hmacFromMe = subject.hmacify('abcde','abcde')
      let hmacFromCombell = 'Cie3FxujM5YVaA8ki8NPtBeV946bHthhTgWwRxTWh3Y='
      expect(hmacFromMe).to.be.equal(hmacFromCombell)
    })
  })
})
