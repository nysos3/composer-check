'use strict';
const co = require( 'co' );
const extend = require( 'xtend' );
const ora = require( 'ora' );
const createPackageSummary = require( './create-package-summary' );

module.exports = function ( currentState ) {
  return co( function* () {
    const spinner = ora( `Checking composer registries for updated packages.` );
    spinner.enabled = spinner.enabled && currentState.get( 'spinner' );
    spinner.start();

    const cwdPackageJson = yield currentState.get( 'cwdPackageJson' );

    function dependencies ( pkg ) {
      return extend( pkg.require, pkg['require-dev'] );
    }

    const allDependencies = dependencies( cwdPackageJson );
    const allDependenciesIncludingMissing = Object.keys( extend( allDependencies, currentState.get( 'missingFromPackageJson' ) ) );

    const arrayOfPackageInfo = yield allDependenciesIncludingMissing
      .map( moduleName => createPackageSummary( moduleName, currentState ) )
      .filter( Boolean );
    currentState.set( 'packages', arrayOfPackageInfo );

    spinner.stop();
    return currentState;
  } );
};
