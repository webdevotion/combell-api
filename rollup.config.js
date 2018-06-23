import pkg from './package.json'
import path from 'path'

import babel      from 'rollup-plugin-babel'
import builtins   from 'rollup-plugin-node-builtins'
import commonjs   from 'rollup-plugin-commonjs'
import json       from 'rollup-plugin-json'
import license    from "rollup-plugin-license"
import resolve    from 'rollup-plugin-node-resolve'
import { terser } from "rollup-plugin-terser"

// how to use built in crypto with node js 8 and rollup
// - use rollup plugin node builtins
//     • and set { crypto: false } when calling builtins()
// - define crypto as an external
// - import { createHmac } from "crypto"; // for a lean import
//     • call `createHmac` in stead of crypto.createHmac(...)

let input = './lib/combell.js'
let external = ['axios','dotenv','crypto'] // not included in built distribution files
let babelExclude = ['node_modules/**','**/*.json']
let globals = {} // example: { '_': 'lodash' }
const minified = true
const unminified = false

const jsFileExtension = '.js'
const minifiedJSFileExtension = '.min' + jsFileExtension

let licensify = function() {
  return license({banner: {
    file: path.join(__dirname, 'LICENSE'),
    encoding: 'utf-8', // Default is utf-8
  }})
}

// minifies source code files
// stripcomments strips comments but leaves @license tags in place
let terserPlugin = (stripComments) => {
  let comments = stripComments ? null : (node, comment) => {
    let {value,type} = comment
    if (type == "comment2") {
      // multiline comment
      return /@preserve|@license|@cc_on/i.test(value);
    }
  }
  return terser({ie8: false, sourceMap: true, output: {comments: comments}})
}

let plugins = (shouldMinify) => {
  let stripComments = true
  return [
      builtins({crypto: false}),
      resolve(), // so Rollup can find dependencies
      json(), // so Rollup can handle axios' package.json
      babel({ exclude: babelExclude }),
      shouldMinify ? terserPlugin(stripComments) : null,
      licensify()
  ].filter( p => p )
}

let outputExtension = (minifiedExtension) => {
  return minifiedExtension ? minifiedJSFileExtension : jsFileExtension;
}

let commonJSOutput = (compress) => {

  // Since we are pointing to .min.js files in package.json
  // we should find / replace .min.js with .js extensions.

  const packageExt = outputExtension(true)
  const outputExt = outputExtension( compress ? minified : unminified )

  let main = pkg.main.replace( packageExt, outputExt)
  let module = pkg.module.replace( packageExt, outputExt)

  return [
    { file: main,
      format: 'cjs', exports: 'named', globals: globals },
    { file: module,
      format: 'es', globals: globals }
  ]
}

let umdOutput = (compress) => {
  return {
    name: 'combell',
    file: pkg.browser.replace(outputExtension(true), outputExtension(compress ? minified : unminified)),
    format: 'umd',
    exports: 'named',
    moduleName: pkg.name,
    globals: globals
  }
}

let browserBuild = (shouldMinify) => {
  return {
    input: input,
    external: external,
    output: umdOutput(shouldMinify),
    plugins: plugins(shouldMinify)
  }
}

let nodejsBuild = (shouldMinify) => {
  return {
    input: input,
    external: external,
    output: commonJSOutput(shouldMinify),
    plugins: plugins(shouldMinify)
  }
}

// exports an (un)minified version for each type of build
export default [
  browserBuild( unminified ),
  browserBuild( minified ),
  nodejsBuild( unminified ),
  nodejsBuild( minified )
]
