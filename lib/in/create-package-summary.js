'use strict';

const readComposerJson = require( './read-composer-json' );
const findModulePath = require( './find-module-path' );
const _ = require( 'lodash' );
const semverDiff = require( 'semver-diff' );
const getLatestFromRegistry = require( './get-latest-from-registry' );
const pathExists = require( 'path-exists' );
const path = require( 'path' );
const semver = require( 'semver' );
const minimatch = require( 'minimatch' );

function createPackageSummary ( moduleName, currentState ) {
  let cwdPackageJson = currentState.get( 'cwdInstalledPackages' );
  if ( !cwdPackageJson[moduleName] ) {
    return false;
  }
  cwdPackageJson = cwdPackageJson[moduleName]
  // const modulePath = findModulePath( moduleName, currentState );
  // const packageIsInstalled = pathExists.sync( modulePath );
  // const modulePackageJson = readComposerJson( path.join( modulePath, 'package.json' ) );

  // Ignore private packages
  // const isPrivate = Boolean( modulePackageJson.private );
  // if ( isPrivate ) {
  // return false;
  // }

  // Ignore packages that are using github or file urls
  // const packageJsonVersion = cwdPackageJson.dependencies[moduleName] ||
  // cwdPackageJson.devDependencies[moduleName] ||
  // currentState.get( 'globalPackages' )[moduleName];

  // if ( packageJsonVersion && !semver.validRange( packageJsonVersion ) ) {
  //   return false;
  // }

  // Ignore specified '--ignore' package globs
  // const ignore = currentState.get( 'ignore' );
  // if ( ignore ) {
  //   const ignoreMatch = Array.isArray( ignore ) ? ignore.some( ignoredModule => minimatch( moduleName, ignoredModule ) ) : minimatch( moduleName, ignore );
  //   if ( ignoreMatch ) {
  //     return false;
  //   }
  // }

  // const unusedDependencies = currentState.get( 'unusedDependencies' );
  // const missingFromPackageJson = currentState.get( 'missingFromPackageJson' );

  // function foundIn ( files ) {
  //   if ( !files ) {
  //     return;
  //   }

  //   return 'Found in: ' + files.map( filepath => filepath.replace( currentState.get( 'cwd' ), '' ) )
  //     .join( ', ' );
  // }
  const installedVersion = cwdPackageJson.version;

  const latest = cwdPackageJson.latest;

  const versionWanted = latest;

  const versionToUse = installedVersion || versionWanted;
  const usingNonSemver = semver.valid( latest ) && semver.lt( latest, '1.0.0-pre' );

  const bump = semver.valid( latest ) &&
    semver.valid( versionToUse ) &&
    ( usingNonSemver && semverDiff( versionToUse, latest ) ? 'nonSemver' : semverDiff( versionToUse, latest ) );

  return getLatestFromRegistry( moduleName )
    .then( composerInfo => {
      return {
        // info
        moduleName: moduleName,
        homepage: composerInfo.homepage,
        regError: composerInfo.error,
        pkgError: undefined,

        // versions
        latest: latest,
        installed: versionToUse,
        isInstalled: true,
        notInstalled: false,
        packageWanted: versionWanted,
        packageJson: installedVersion,

        // Missing from package json
        notInPackageJson: false,

        // meta
        devDependency: _.has( cwdPackageJson.devDependencies, moduleName ),
        usedInScripts: _.findKey( cwdPackageJson.scripts, script => {
          return script.indexOf( moduleName ) !== -1;
        } ),
        mismatch: semver.validRange( installedVersion ) &&
          semver.valid( versionToUse ) &&
          !semver.satisfies( versionToUse, installedVersion ),
        semverValid:
          semver.valid( versionToUse ),
        easyUpgrade: semver.validRange( installedVersion ) &&
          semver.valid( versionToUse ) &&
          semver.satisfies( latest, installedVersion ) &&
          bump !== 'major',
        bump: bump,

        unused: false
      };
    } )
}

module.exports = createPackageSummary;
