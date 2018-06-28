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
            'Content-Type': 'application/json',
            'User-Agent': 'combell-api-node-js'
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

  // Copyright Joyent, Inc. and other Node contributors.
  //
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  //
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.


  // If obj.hasOwnProperty has been overridden, then calling
  // obj.hasOwnProperty(prop) will break.
  // See: https://github.com/joyent/node/issues/1707
  function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
  };
  function stringifyPrimitive(v) {
    switch (typeof v) {
      case 'string':
        return v;

      case 'boolean':
        return v ? 'true' : 'false';

      case 'number':
        return isFinite(v) ? v : '';

      default:
        return '';
    }
  }

  function stringify (obj, sep, eq, name) {
    sep = sep || '&';
    eq = eq || '=';
    if (obj === null) {
      obj = undefined;
    }

    if (typeof obj === 'object') {
      return map(objectKeys(obj), function(k) {
        var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
        if (isArray(obj[k])) {
          return map(obj[k], function(v) {
            return ks + encodeURIComponent(stringifyPrimitive(v));
          }).join(sep);
        } else {
          return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
        }
      }).join(sep);

    }

    if (!name) return '';
    return encodeURIComponent(stringifyPrimitive(name)) + eq +
           encodeURIComponent(stringifyPrimitive(obj));
  }
  function map (xs, f) {
    if (xs.map) return xs.map(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
      res.push(f(xs[i], i));
    }
    return res;
  }

  var objectKeys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
  };

  function parse(qs, sep, eq, options) {
    sep = sep || '&';
    eq = eq || '=';
    var obj = {};

    if (typeof qs !== 'string' || qs.length === 0) {
      return obj;
    }

    var regexp = /\+/g;
    qs = qs.split(sep);

    var maxKeys = 1000;
    if (options && typeof options.maxKeys === 'number') {
      maxKeys = options.maxKeys;
    }

    var len = qs.length;
    // maxKeys <= 0 means that we should not limit keys count
    if (maxKeys > 0 && len > maxKeys) {
      len = maxKeys;
    }

    for (var i = 0; i < len; ++i) {
      var x = qs[i].replace(regexp, '%20'),
          idx = x.indexOf(eq),
          kstr, vstr, k, v;

      if (idx >= 0) {
        kstr = x.substr(0, idx);
        vstr = x.substr(idx + 1);
      } else {
        kstr = x;
        vstr = '';
      }

      k = decodeURIComponent(kstr);
      v = decodeURIComponent(vstr);

      if (!hasOwnProperty(obj, k)) {
        obj[k] = v;
      } else if (isArray(obj[k])) {
        obj[k].push(v);
      } else {
        obj[k] = [obj[k], v];
      }
    }

    return obj;
  }var querystring = {
    encode: stringify,
    stringify: stringify,
    decode: parse,
    parse: parse
  };

  var endpoints = {
    ACCOUNTS: '/accounts',
    DOMAINS: '/domains',
    HOSTINGS: '/linuxhostings'
  };

  var baseURL = 'https://api.combell.com';
  var version = function version() {
    return '/v2';
  };

  var combineURL = function combineURL(base, relative) {
    return relative ? base.replace(/\/+$/, '') + '/' + relative.replace(/^\/+/, '') : base;
  };

  /**
   * Creates a valid path components string from an array of {string|object}
   * by combining API Endpoint path, URL components and URL query params
   *
   * @param {Object[]} components Array of strings or numbers
   * @returns {String} valid string of path components delimited with '/'
   */
  var pathComponentsify = function pathComponentsify(components) {
    components = components ? components : [];

    return components.filter(function (pc) {
      return pc;
    }) // get rid of nulls
    .map(function (pc) {
      return String(pc).trim();
    }) // get rid of leading & trailing whitspace
    .map(encodeURIComponent) // encode each path component
    .join("/"); // join path components into one string with / delimiter
  };

  var paramsify = function paramsify(params) {
    if (params == null) {
      return "";
    }

    return "?" + querystring.stringify(params);
  };

  var endpointify = function endpointify(method, path) {
    var pathComponents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var urlParams = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    pathComponents = pathComponentsify(pathComponents);

    var params = paramsify(urlParams);
    var prefix = version() + path;
    var relativeURL = combineURL(prefix, pathComponents + params);
    var fullURL = combineURL(baseURL, relativeURL);

    return {
      method: method,
      path: relativeURL,
      url: fullURL
    };
  };

  /**
   * Creates a new endpoint object 
   * by combining API Endpoint path, URL components and URL query params
   *
   * @param {string} point Relative path to the API endpoint w/o path variables
   * @param {String[]} pathComponents Additional URL components
   * @param {Object.<string,string|number>} urlParams Object with properties 
   *  to be added as query params
   * @returns { method, path, url } an ( anonymous ) Endpoint object 
   */
  var endpoint = function endpoint(point) {
    var pathComponents = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var urlParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var GET = 'get';

    switch (point) {
      case endpoints.ACCOUNTS:
        return endpointify(GET, point, pathComponents, urlParams);
      case endpoints.DOMAINS:
        return endpointify(GET, point, pathComponents, urlParams);
      case endpoints.HOSTINGS:
        return endpointify(GET, point, pathComponents, urlParams);
      default:
        break;
    }

    return endpointify(GET, '');
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
    var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url, config) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              config.method = "get";
              return _context.abrupt('return', axios(config).catch(function (error) {
                throw errorhandler(error);
              }));

            case 2:
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

  var ENDPOINT = endpoints.ACCOUNTS;

  var index = function () {
    var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(auth) {
      var components = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var endpoint$$1, headers, config;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              endpoint$$1 = endpoint(ENDPOINT, components, params);
              headers = auth.headers(endpoint$$1);
              config = headers;
              return _context.abrupt('return', get$1(endpoint$$1.url, config));

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function index(_x3) {
      return _ref.apply(this, arguments);
    };
  }();

  var show = function () {
    var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(auth, id) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt('return', this.index(auth, [id], null));

            case 1:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function show(_x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  }();

  var ENDPOINT$1 = endpoints.DOMAINS;

  var index$1 = function () {
    var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(auth) {
      var components = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var endpoint$$1, headers, config;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              endpoint$$1 = endpoint(ENDPOINT$1, components, params);
              headers = auth.headers(endpoint$$1);
              config = headers;
              return _context.abrupt('return', get$1(endpoint$$1.url, config));

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function index(_x3) {
      return _ref.apply(this, arguments);
    };
  }();

  var show$1 = function () {
    var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(auth, id) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt('return', this.index(auth, [id], null));

            case 1:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function show(_x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  }();

  var ENDPOINT$2 = endpoints.HOSTINGS;

  var index$2 = function () {
    var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(auth) {
      var components = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var endpoint$$1, headers, config;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              endpoint$$1 = endpoint(ENDPOINT$2, components, params);
              headers = auth.headers(endpoint$$1);
              config = headers;
              return _context.abrupt('return', get$1(endpoint$$1.url, config));

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function index(_x3) {
      return _ref.apply(this, arguments);
    };
  }();

  var show$2 = function () {
    var _ref2 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(auth, id) {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              return _context2.abrupt('return', this.index(auth, [id], null));

            case 1:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function show(_x4, _x5) {
      return _ref2.apply(this, arguments);
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
                  return _context.abrupt('break', 5);

                case 4:
                  throw e;

                case 5:
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
    }, {
      key: 'getAccount',
      value: function () {
        var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(id) {
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  if (!(id == null)) {
                    _context3.next = 2;
                    break;
                  }

                  throw new Error('requires one parameter of type Number');

                case 2:
                  _context3.prev = 2;
                  _context3.next = 5;
                  return show(this.auth(), id);

                case 5:
                  return _context3.abrupt('return', _context3.sent);

                case 8:
                  _context3.prev = 8;
                  _context3.t0 = _context3['catch'](2);
                  throw _context3.t0;

                case 11:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, this, [[2, 8]]);
        }));

        function getAccount(_x2) {
          return _ref3.apply(this, arguments);
        }

        return getAccount;
      }()
    }, {
      key: 'getDomains',
      value: function () {
        var _ref4 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  _context4.prev = 0;
                  _context4.next = 3;
                  return index$1(this.auth());

                case 3:
                  return _context4.abrupt('return', _context4.sent);

                case 6:
                  _context4.prev = 6;
                  _context4.t0 = _context4['catch'](0);
                  throw _context4.t0;

                case 9:
                case 'end':
                  return _context4.stop();
              }
            }
          }, _callee4, this, [[0, 6]]);
        }));

        function getDomains() {
          return _ref4.apply(this, arguments);
        }

        return getDomains;
      }()
    }, {
      key: 'getHostings',
      value: function () {
        var _ref5 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.prev = 0;
                  _context5.next = 3;
                  return index$2(this.auth());

                case 3:
                  return _context5.abrupt('return', _context5.sent);

                case 6:
                  _context5.prev = 6;
                  _context5.t0 = _context5['catch'](0);
                  throw _context5.t0;

                case 9:
                case 'end':
                  return _context5.stop();
              }
            }
          }, _callee5, this, [[0, 6]]);
        }));

        function getHostings() {
          return _ref5.apply(this, arguments);
        }

        return getHostings;
      }()
    }]);
    return Combell;
  }();

  exports.default = Combell;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
