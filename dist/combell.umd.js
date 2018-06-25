/**
 * MIT License
 *
 * Copyright (c) 2018 Bram Plessers
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('crypto'), require('axios')) :
  typeof define === 'function' && define.amd ? define(['exports', 'crypto', 'axios'], factory) :
  (factory((global.combell = {}),null,null));
}(this, (function (exports,crypto,axios) { 'use strict';

  axios = axios && axios.hasOwnProperty('default') ? axios['default'] : axios;

  function randomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  function concat(values, delimiter) {
    return values.join(delimiter);
  }

  function now() {
    return new Date();
  }

  function epoch() {
    // unix timestamp in seconds
    return Math.floor(now() / 1000);
  }

  // generates a base 64 hmac with given text and secret
  function hmacify(text, secret) {
    return crypto.createHmac('sha256', secret).update(text).digest('base64');
  }

  var asyncToGenerator = function (fn) {
    return function () {
      var gen = fn.apply(this, arguments);
      return new Promise(function (resolve, reject) {
        function step(key, arg) {
          try {
            var info = gen[key](arg);
            var value = info.value;
          } catch (error) {
            reject(error);
            return;
          }

          if (info.done) {
            resolve(value);
          } else {
            return Promise.resolve(value).then(function (value) {
              step("next", value);
            }, function (err) {
              step("throw", err);
            });
          }
        }

        return step("next");
      });
    };
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var Authorization = function () {
    function Authorization(key, secret) {
      classCallCheck(this, Authorization);

      this.key = key;
      this.secret = secret;
    }

    createClass(Authorization, [{
      key: 'getApiKey',
      value: function getApiKey() {
        return this.key;
      }
    }, {
      key: 'getApiSecret',
      value: function getApiSecret() {
        return this.secret;
      }
    }, {
      key: 'getEpoch',
      value: function getEpoch() {
        return epoch();
      }
    }, {
      key: 'getNonce',
      value: function getNonce() {
        return randomString(32);
      }
    }, {
      key: 'getHmacInputText',
      value: function getHmacInputText(input) {
        return concat(input, '');
      }
    }, {
      key: 'options',
      value: function options(url, authHeaderValue) {
        return {
          headers: {
            Authorization: 'hmac ' + authHeaderValue,
            'Content-Type': 'application/json'
          },
          url: url
        };
      }
    }, {
      key: 'inputForHmac',
      value: function inputForHmac(apiKeyValue, endpoint, bodyHash) {
        var httpMethod = endpoint.method;
        var action = encodeURIComponent(endpoint.path);
        var epoch$$1 = this.getEpoch();
        var nonce = this.getNonce();
        var secret = this.getApiSecret();

        var concatenated = this.getHmacInputText([apiKeyValue, httpMethod, action, epoch$$1, nonce, bodyHash]);
        return {
          text: concatenated,
          epoch: epoch$$1,
          nonce: nonce,
          secret: secret
        };
      }
    }, {
      key: 'authorizationHeaderValue',
      value: function authorizationHeaderValue(apiKeyValue, endpoint) {
        var bodyHash = null; // no body request at the moment, must be null
        var hmacParams = this.inputForHmac(apiKeyValue, endpoint, bodyHash);
        var generatedHmac = hmacify(hmacParams.text, hmacParams.secret);

        // https://api.combell.com/v2/documentation#section/Authentication/Sending-an-authorized-request
        // > your_api_key:generated_hmac:nonce:unix_timestamp
        return concat([apiKeyValue, generatedHmac, hmacParams.nonce, hmacParams.epoch], ':');
      }
    }, {
      key: 'headers',
      value: function headers(endpoint) {
        var val = this.authorizationHeaderValue(this.getApiKey(), endpoint);
        return this.options(endpoint.url, val);
      }
    }]);
    return Authorization;
  }();

  var endpoints = {
    ACCOUNTS: '/accounts'
  };

  var baseUrl = 'https://api.combell.com';
  var version = function version() {
    return '/v2';
  };

  var endpointify = function endpointify(method, path) {
    return {
      method: method,
      path: version() + path,
      url: baseUrl + version() + path
    };
  };

  var endpoint = function endpoint(point) {
    var GET = 'get';
    switch (point) {
      case endpoints.ACCOUNTS:
        return endpointify(GET, '/accounts');
      default:
        return endpointify(GET, '');
    }
  };

  var contexts = {
    general: {
      context: 'general_error'
    },
    request_setup: {
      context: 'request_setup_error'
    },
    no_response: {
      context: 'no_response_received'
    },
    auth_authorization_header_invalid_format: {
      context: 'authentication'
    },
    authorization_hmac_invalid: {
      context: 'hmac_authorization_header_invalid'
    }
  };

  var errorcontext = function errorcontext(error) {
    var status = error.response.status;


    switch (status) {
      case 401:
        return contexts.auth_authorization_header_invalid_format.context;
      default:
        break;
    }

    var e = error.response.data.error_code;
    // not able to find an error code in axios response object
    if (!e) {
      // we have no clue what happened, throw general error
      return contexts.general.context;
    }

    // look up a more application centered error message
    e = contexts[e];
    // we haven't seen this before - throw general error
    if (!e) {
      return contexts.general.context;
    }

    // we have a clue what's going on and throw an error
    // which provides some application centric context
    // for example: 'authentication failed'
    return e.context;
  };

  // error is just axios' response object
  var errorhandler = function errorhandler(error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // console.log(error.request.headers)
      // console.log(error.response.status)
      // console.log(error.response.headers)
      var context = errorcontext(error);
      return new Error(context);
    } else if (error.request) {
      // The request was made but no response w2as received
      // `error.request` is an instance of XMLHttpRequest in the browser
      // and an instance of http.ClientRequest in node.js
      return new Error(contexts.no_response.context);
    }

    return new Error(contexts.general.context);
  };

  var get$1 = function () {
    var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, headers) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt('return', axios.get(url, headers).catch(function (error) {
                throw errorhandler(error);
              }));

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function get$$1(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var index = function () {
    var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(auth) {
      var endpoint$$1, headers;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              endpoint$$1 = endpoint(endpoints.ACCOUNTS);
              headers = auth.headers(endpoint$$1);
              return _context.abrupt('return', get$1(endpoint$$1.url, headers));

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function index(_x) {
      return _ref.apply(this, arguments);
    };
  }();

  var Combell = function () {
    function Combell(apiKey, apiSecret) {
      classCallCheck(this, Combell);

      this.key = apiKey;
      this.secret = apiSecret;
    }

    // waiting for a future implementation where we can
    // for example warn the user about this issue by logging
    // or by invoking an error handler


    createClass(Combell, [{
      key: 'errors',
      value: function () {
        var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.t0 = e.message;
                  _context.next = _context.t0 === 'authentication' ? 3 : 4;
                  break;

                case 3:
                  return _context.abrupt('break', 6);

                case 4:
                  throw e;

                case 6:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this);
        }));

        function errors(_x) {
          return _ref.apply(this, arguments);
        }

        return errors;
      }()
    }, {
      key: 'auth',


      // returns an authentication instance for use in API calls
      value: function auth() {
        return new Authorization(this.key, this.secret);
      }

      // returns empty array if catching an error
      // thrown by the accounts module

    }, {
      key: 'getAccounts',
      value: function () {
        var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.prev = 0;
                  _context2.next = 3;
                  return index(this.auth());

                case 3:
                  return _context2.abrupt('return', _context2.sent);

                case 6:
                  _context2.prev = 6;
                  _context2.t0 = _context2['catch'](0);
                  throw _context2.t0;

                case 9:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, this, [[0, 6]]);
        }));

        function getAccounts() {
          return _ref2.apply(this, arguments);
        }

        return getAccounts;
      }()
    }]);
    return Combell;
  }();

  exports.default = Combell;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
