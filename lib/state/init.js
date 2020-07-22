'use strict';
const _ = require( 'lodash' )
const path = require( 'path' )
const composer = require( "../in/composer" )
const getInstalledPackages = require( '../in/get-installed-packages' )
const readComposerJson = require( '../in/read-composer-json' )
const emoji = require( '../out/emoji' )

function init ( currentState, userOptions ) {
  return new Promise( async ( resolve, reject ) => {
    _.each( userOptions, ( value, key ) => currentState.set( key, value ) );

    if ( currentState.get( 'global' ) ) {
      currentState.set( 'global', true )
      const globalLocation = await composer.exec( ['config', '-g', 'home'] ).then( loc => loc.trim() )
      const installed = await getInstalledPackages( 'global' )
      currentState.set( 'cwdInstalledPackages', installed )
      let composerJson = readComposerJson( path.resolve( globalLocation, 'composer.json' ) )
      currentState.set( 'cwdPackageJson', composerJson )
      currentState.set( 'cwd', globalLocation )
    } else {
      currentState.set( 'global', false )
      const cwd = path.resolve( currentState.get( 'cwd' ) )
      const installed = await getInstalledPackages( cwd )
      currentState.set( 'cwdInstalledPackages', installed )
      currentState.set( 'cwdPackageJson', readComposerJson( path.resolve( cwd, 'composer.json' ) ) )
      currentState.set( 'cwd', cwd )
    }

    emoji.enabled( currentState.get( 'emoji' ) )

    return resolve( currentState )
  } );
}

module.exports = init
