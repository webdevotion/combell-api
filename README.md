# combell-api

[![Build Status](https://travis-ci.org/webdevotion/combell-api.svg?branch=master)](https://travis-ci.org/webdevotion/combell-api) [![Maintainability](https://api.codeclimate.com/v1/badges/525726483964f3c5d438/maintainability)](https://codeclimate.com/github/webdevotion/combell-api/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/525726483964f3c5d438/test_coverage)](https://codeclimate.com/github/webdevotion/combell-api/test_coverage)

Combell API client for node.js. [Combell.be](https://combell.be) is a Belgian hosting provider used by a client of mine. When I noticed the API ( [documented here](https://api.combell.com/v2/documentation) ) while working in the control panel I finally found an interesting, personal, learning project.

I hope my effort proofs to be useful for other node.js projects or as a learning resource.
-- Bram Plessers

## Example Usage

- `git clone` this repo on your machine
- `cd` into the project folder ( probably named `combell-api` )
- `yarn` to install all dependencies ( [how to install](https://yarnpkg.com/lang/en/docs/install/) )
- build the project by running `gulp scripts` ( which avoids `eslint` )
- copy `.env.example` to `.env` and edit it's contents ( [get your api key here](https://my.combell.com) )
- run the main entry point with `yarn run combell` 

## Notice

This is an early release with one big problem: 
the much needed HMAC authorization header is malformed.

The default behaviour of the current iteration of this project is a whole lot of nothing for two reasons: 
1. the `authentication` error is catched in `combell.js` and gracefully handled
2. when an error is catched, `combell.js` will return an empty array

Better output and error handling hooks are ( probably ) coming. For now we might want to get that HMAC authorization header in order.
