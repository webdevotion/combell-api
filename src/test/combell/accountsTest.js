let chai = require('chai')
let expect = chai.expect
// lets us mock private functions from required modules
let rewire = require('rewire')

let subject = require('../../combell/accounts')

// http mocking
let router = require('../../combell/router.js')
let nock = require('nock')

// require becomes rewire when using 'rewire'
let auth = rewire('../../combell/authorization')


describe('Accounts', () => {
  describe('get accounts index', () => {

    let api
    let endpoint = router.endpoint(router.endpoints.ACCOUNTS)
    let nockData = [{"id": 0,"identifier": "string"}]

    it("should return all accounts for this user", async () => {

      // nock will release the matched http request after each call
      api = nock(router.baseUrl, {requestHeaders: auth.headers(endpoint)} )

      var scope = api
        .get(endpoint.path)
        .reply(200, nockData);

      let response = await subject.index(auth)
      expect(response.status).to.eq(200)

      let data = response.data
      expect(data).to.be.a("array")
      expect(data.length).to.eq(1)
      expect(data[0].id).to.eq(0)

      // inspect the generated hmac sig
      let authorizationHeader = response.request.headers.authorization
      let authorizationHeaderParts = authorizationHeader.split(":")
      expect(authorizationHeaderParts.length).to.eq(4)
    })

    it("should return 404 when url is malformed", async () => {

      // nock will release the matched http request after each call
      let dummyURL = "https://combell.com"
      auth.__set__('baseUrl',dummyURL)
      api = nock(dummyURL, {requestHeaders: auth.headers(endpoint)} )

      var scope = api
        .get(endpoint.path)
        .reply(404, nockData);

      let response = await subject.index(auth)
      let data = response.data

      expect(response.status).to.eq(404)
    })

    it("should use valid HMAC auth header", async () => {

      // nock will release the matched http request after each call
      api = nock(router.baseUrl, {requestHeaders: auth.headers(endpoint)} )

      var scope = api
        .get(endpoint.path)
        .reply(200, nockData);

      let response = await subject.index(auth)

      // inspect the generated hmac sig
      let authorizationHeader = response.request.headers.authorization
      let authorizationHeaderParts = authorizationHeader.split(":")
      expect(authorizationHeaderParts.length).to.eq(4)
    })

    it("should return 401 if not authorized", async () => {
      // nock will release the matched http request after each call
      api = nock(router.baseUrl, {requestHeaders: null} )

      var scope = api
        .get(endpoint.path)
        .reply(401);

      let response = await subject.index(auth)
      let data = response.data
      let headers = response.headers

      // inspect the generated hmac sig
      expect( response.response.status ).to.eq(401)

    });
  });
})
