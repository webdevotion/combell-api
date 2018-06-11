import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import pkg from './package.json'
import json from 'rollup-plugin-json'
import builtins from 'rollup-plugin-node-builtins'
import { terser } from "rollup-plugin-terser"
import license from "rollup-plugin-license"
import path from 'path'

let licensify = function() {
  return license({banner: {
    file: path.join(__dirname, 'LICENSE'),
    encoding: 'utf-8', // Default is utf-8
  }})
}

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

export default [
  // browser-friendly UMD build
  {
    input: './lib/combell.js',
    external: ['axios','dotenv'],
    output: {
      name: 'combell',
      file: pkg.browser,
      format: 'umd',
      exports: 'named',
      moduleName: pkg.name,

      globals: {
        axios: 'axios'
      }
    },
    plugins: [
      builtins(),
      resolve(), // so Rollup can find dependencies
      json(), // so Rollup can handle axios' package.json
      babel({
        exclude: ['node_modules/**','**/*.json']
      }),
      terserPlugin(true),
      licensify()
    ]
  },

  // browser-friendly minified UMD build
  {
    input: './lib/combell.js',
    external: ['axios','dotenv'],
    output: {
      name: 'combell',
      file: pkg.browser.replace('.js','.min.js'),
      format: 'umd',
      exports: 'named',
      moduleName: pkg.name,
      globals: {
        axios: 'axios'
      }
    },
    plugins: [
      builtins(),
      resolve(), // so Rollup can find dependencies
      json(), // so Rollup can handle axios' package.json
      babel({
        exclude: ['node_modules/**','**/*.json']
      }),
      terserPlugin(false),
      licensify()
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // the `targets` option which can specify `dest` and `format`)
  {
    input: './lib/combell.js',
    external: ['axios','dotenv'],
    output: [
      { file: pkg.main, format: 'cjs', exports: 'named' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      builtins({crypto: true}),
      resolve(),
      babel({
        exclude: ['node_modules/**','**/*.json']
      }),
      terserPlugin(true),
      licensify()
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // the `targets` option which can specify `dest` and `format`)
  {
    input: './lib/combell.js',
    external: ['axios','dotenv'],
    output: [
      { file: pkg.main.replace('.js','.min.js'), format: 'cjs', exports: 'named' },
      { file: pkg.module.replace('.js','.min.js'), format: 'es' }
    ],
    plugins: [
      builtins({crypto: true}),
      resolve(),
      babel({
        exclude: ['node_modules/**','**/*.json']
      }),
      terserPlugin(false),
      licensify()
    ]
  }
]
