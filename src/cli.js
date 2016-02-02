import clone from 'lodash.clone';
import snakeCase from 'snake-case';

// Convert from command line option format to snake case for the JScrambler API.
// It also replaces truthy boolean flags with %DEFAULT% values
export function mergeAndParseParams (commander, params) {
  params = clone(params || {});

  // Override params file changes with any specified command line options
  // TODO Populate this list based on an external JSON
  // FIXME This list is deprecated
  const isBoolFlag = {
    assertsElimination: false,
    browserOsLock: false,
    constantFolding: true,
    deadCode: true,
    deadCodeElimination: true,
    debuggingCodeElimination: false,
    dictionaryCompression: true,
    domainLock: false,
    domainLockWarningFunction: false,
    dotNotationElimination: true,
    exceptionsList: false,
    expirationDate: false,
    expirationDateWarningFunction: false,
    functionOutlining: true,
    functionReorder: true,
    ignoreFiles: false,
    literalHooking: false,
    literalDuplicates: true,
    memberEnumeration: true,
    mode: false,
    namePrefix: false,
    renameAll: false,
    renameInclude: false,
    renameLocal: true,
    selfDefending: false,
    stringSplitting: false,
    whitespace: true,
    preserveAnnotations: true
  };

  for (let name in isBoolFlag) {
    if (commander[name] !== undefined) {
      let snakeCaseName = snakeCase(name);
      if (isBoolFlag[name] === true) {
        params[snakeCaseName] = {
          status: 1
        };
      } else {
        params[snakeCaseName] = commander[name];
      }
      if (typeof params[snakeCaseName].status === 'undefined') {
        params[snakeCaseName].status = 1;
      }
    }
  }

  return params;
}
