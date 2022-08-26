'use strict';

/**
 * Preetier v2 does not seem to be able to import a config file when
 * "type": "module" is used.
 */
// require("@maxxxxxdlp/prettier-config");

module.exports = {
  /* GLOBAL */
  // single quote is more popular among JS libraries
  singleQuote: true,
  // GitHub renders Markdown properly, so we can wrap it safely
  proseWrap: 'always',

  /* XML */
  xmlWhitespaceSensitivity: 'ignore',
};