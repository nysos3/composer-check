'use strict'

const chalk = require( 'chalk' )
const execa = require( 'execa' )
const ora = require( 'ora' )

function install ( packages, currentState ) {
  if ( !packages.length ) {
    return Promise.resolve( currentState )
  }

  const installer = currentState.get( 'installer' )
  const saveExact = null

  let composerArgs = ['require']
    .concat( saveExact )
    .concat( packages )
    .filter( Boolean )

  if ( currentState.get( 'global' ) ) {
    composerArgs.unshift( 'global' )
  }

  console.log( '' )
  console.log( `$ ${ chalk.green( installer ) } ${ chalk.green( composerArgs.join( ' ' ) ) }` )
  const spinner = ora( `Installing using ${ chalk.green( installer ) }...` )
  spinner.enabled = spinner.enabled && currentState.get( 'spinner' )
  spinner.start()

  return execa( installer, composerArgs, { cwd: currentState.get( 'cwd' ) } ).then( output => {
    spinner.stop()
    console.log( output.stdout )
    console.log( output.stderr )

    return currentState
  } ).catch( err => {
    spinner.stop()
    throw err
  } )
}

module.exports = install
