/**
 * This config is used by jest only (as part of babel-jest)
 */

"use strict";

module.exports = {
  env: {
    test: {
      presets: [
        [
          '@babel/preset-env',
          {targets: {node: 'current'}},
        ],
        ['@babel/preset-typescript'],
      ],
      "plugins": ["@babel/plugin-transform-modules-commonjs"],
    }
  }
}
