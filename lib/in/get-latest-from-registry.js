'use strict';
const packageInfo = require( './get-package-info' );
const cpuCount = require( 'os' ).cpus().length;
const throat = require( 'throat' )( cpuCount );

function getComposerInfo ( packageName ) {
  return throat( () => packageInfo( packageName ) )
    .then( homepage => {
      return { homepage };
    } ).catch( err => {
      return {
        homepage: undefined,
      }
    } );
}

module.exports = getComposerInfo;
