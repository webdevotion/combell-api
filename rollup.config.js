import pkg from './package.json'
import path from 'path'



import babel      from 'rollup-plugin-babel'
import builtins   from 'rollup-plugin-node-builtins'
import commonjs   from 'rollup-plugin-commonjs'
import json       from 'rollup-plugin-json'
import license    from "rollup-plugin-license"
import resolve    from 'rollup-plugin-node-resolve'
import { terser } from "rollup-plugin-terser"

let input = './lib/combell.js'
let external = ['axios','dotenv']
let babelExclude = ['node_modules/**','**/*.json']

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
      builtins(),
      resolve(), // so Rollup can find dependencies
      json(), // so Rollup can handle axios' package.json
      babel({ exclude: babelExclude }),
      shouldMinify ? terserPlugin(stripComments) : null,
      licensify()
  ].filter( p => p )
}

let outputExtension = (minify) => {
  return minify ? minifiedJSFileExtension : jsFileExtension
}

let commonJSOutput = (minify) => {
  return [
    { file: pkg.main.replace(outputExtension(false), outputExtension(minify)),
      format: 'cjs', exports: 'named' },
    { file: pkg.module.replace(outputExtension(false), outputExtension(minify)),
      format: 'es' }
  ]
}

let umdOutput = (minify) => {
  return {
    name: 'combell',
    file: pkg.browser.replace(outputExtension(false), outputExtension(minify)),
    format: 'umd',
    exports: 'named',
    moduleName: pkg.name,
    globals: {
      axios: 'axios'
    }
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

export default [
  browserBuild( unminified ),
  browserBuild( minified ),
  nodejsBuild( unminified ),
  nodejsBuild( minified )
]
