"use strict";
const composer = require( "./composer" );


function getInstalledPackages ( cwd ) {
  return composer.exec( ['outdated', '-D', '-fjson'], cwd ).then( ( { installed } ) => {
    let ret = {}

    installed.forEach( ( { name, version, latest } ) => {
      ret[name] = {
        version,
        latest
      }
    } )

    return ret
  } );

}

module.exports = getInstalledPackages
