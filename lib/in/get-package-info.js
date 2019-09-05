"use strict";
const composer = require( "./composer" );


function packageInfo ( packageName ) {
  return composer.exec( ['home', '-H', '-s', packageName] ).then( results => {
    results = results.split( /\r?\n/ );
    return results[results.length - 2];
  } );
}
module.exports = packageInfo
