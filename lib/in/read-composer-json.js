'use strict';

const extend = require( 'xtend' );

function readComposerJson ( filename ) {
  let pkg;
  let error;
  try {
    pkg = require( filename );
  } catch ( e ) {
    if ( e.code === 'MODULE_NOT_FOUND' ) {
      error = new Error( `A composer.json was not found at ${ filename }` );
    } else {
      error = new Error( `A composer.json was found at ${ filename }, but it is not valid.` );
    }
  }
  return extend( { 'require-dev': {}, require: {}, error: error }, pkg )
}

module.exports = readComposerJson;
