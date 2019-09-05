'use strict';

const composerCheck = require( './in' );
const createState = require( './state/state' );

function init ( userOptions ) {
  return createState( userOptions )
    .then( currentState => composerCheck( currentState ) );
}

module.exports = init;
