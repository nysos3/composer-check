"use strict"
const composer = require( "./composer" )


function getInstalledPackages ( cwd ) {
  let composerArgs = ['outdated', '-D', '-fjson']
  if ( cwd === 'global' ) {
    composerArgs.unshift( 'global' )
    cwd = null
  }

  return composer.exec( composerArgs, cwd ).then( ( { installed } ) => {
    let ret = {}
    installed.forEach( ( { name, version, latest } ) => {
      ret[name] = {
        version,
        latest
      }
    } )

    return ret
  } )

}

module.exports = getInstalledPackages
