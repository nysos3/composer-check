const composerRunner = require( "node-composer-runner" );
const version = composerRunner.version;
const https = require( "https" );
const path = require( "path" );
const fs = require( "fs" );
const spawn = require( "child_process" ).spawn;

const COMPOSER_PATH = "https://getcomposer.org/download";
const COMPOSER_FILENAME = "composer.phar";

function getPath () {
  return composerRunner.manager.getVersionPath( version );
}

function exists () {
  return new Promise( ( resolve, reject ) => {
    const installPath = getPath();
    fs.stat( installPath, ( err, stats ) => {
      if ( err ) {
        resolve( false );
      }
      resolve( stats.isFile );
    } );
  } );
}

async function install () {
  if ( await exists() ) {
    return;
  }
  const installPath = getPath();
  const file = fs.createWriteStream( installPath );
  const downloadPath = [COMPOSER_PATH, version, COMPOSER_FILENAME].join( "/" );
  return new Promise( ( resolve, reject ) => {
    const result = https.get( downloadPath, res => {
      res.pipe( file ).on( "close", resolve );
    } );
    result.on( "error", reject );
  } );
}

async function exec ( args, cwd = null ) {
  await install();
  spawnOptions = {};
  composerPath = getPath();
  if ( cwd !== null ) {
    spawnOptions.cwd = cwd;
  }
  return new Promise( ( resolve, reject ) => {
    const composer = spawn(
      "php",
      [composerPath].concat( args ),
      spawnOptions
    );
    let out = "",
      err = "";
    composer.stdout.on( "data", data => {
      out += data;
    } );
    composer.stderr.on( "data", data => {
      err += data;
    } );
    composer.on( "close", code => {
      if ( code !== 0 ) {
        reject( err );
      }
      let formatArg = args.indexOf( '-f' ) >= 0 ? args.indexOf( '-f' ) : args.indexOf( '--format' );
      if ( ( formatArg >= 0 && args[formatArg + 1] === 'json' ) || args.indexOf( '-fjson' ) >= 0 ) {
        try {
          out = JSON.parse( out )
        } catch ( e ) { }
        resolve( out );
      } else {
        resolve( out );
      }
    } );
  } );
}

module.exports = {
  install,
  exists,
  getPath,
  exec
};
