'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.mergeAndParseParams = mergeAndParseParams;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashClone = require('lodash.clone');

var _lodashClone2 = _interopRequireDefault(_lodashClone);

var _snakeCase = require('snake-case');

var _snakeCase2 = _interopRequireDefault(_snakeCase);

// Convert from command line option format to snake case for the JScrambler API.
// It also replaces truthy boolean flags with %DEFAULT% values

function mergeAndParseParams(commander, params) {
  params = (0, _lodashClone2['default'])(params || {});

  // Override params file changes with any specified command line options
  // TODO Populate this list based on an external JSON
  // FIXME This list is deprecated
  var isBoolFlag = {
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

  for (var _name in isBoolFlag) {
    if (commander[_name] !== undefined) {
      var snakeCaseName = (0, _snakeCase2['default'])(_name);
      if (isBoolFlag[_name] === true) {
        params[snakeCaseName] = {
          status: 1
        };
      } else {
        params[snakeCaseName] = commander[_name];
      }
      if (typeof params[snakeCaseName].status === 'undefined') {
        params[snakeCaseName].status = 1;
      }
    }
  }

  return params;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OzJCQUFrQixjQUFjOzs7O3lCQUNWLFlBQVk7Ozs7Ozs7QUFJM0IsU0FBUyxtQkFBbUIsQ0FBRSxTQUFTLEVBQUUsTUFBTSxFQUFFO0FBQ3RELFFBQU0sR0FBRyw4QkFBTSxNQUFNLElBQUksRUFBRSxDQUFDLENBQUM7Ozs7O0FBSzdCLE1BQU0sVUFBVSxHQUFHO0FBQ2pCLHNCQUFrQixFQUFFLEtBQUs7QUFDekIsaUJBQWEsRUFBRSxLQUFLO0FBQ3BCLG1CQUFlLEVBQUUsSUFBSTtBQUNyQixZQUFRLEVBQUUsSUFBSTtBQUNkLHVCQUFtQixFQUFFLElBQUk7QUFDekIsNEJBQXdCLEVBQUUsS0FBSztBQUMvQix5QkFBcUIsRUFBRSxJQUFJO0FBQzNCLGNBQVUsRUFBRSxLQUFLO0FBQ2pCLDZCQUF5QixFQUFFLEtBQUs7QUFDaEMsMEJBQXNCLEVBQUUsSUFBSTtBQUM1QixrQkFBYyxFQUFFLEtBQUs7QUFDckIsa0JBQWMsRUFBRSxLQUFLO0FBQ3JCLGlDQUE2QixFQUFFLEtBQUs7QUFDcEMscUJBQWlCLEVBQUUsSUFBSTtBQUN2QixtQkFBZSxFQUFFLElBQUk7QUFDckIsZUFBVyxFQUFFLEtBQUs7QUFDbEIsa0JBQWMsRUFBRSxLQUFLO0FBQ3JCLHFCQUFpQixFQUFFLElBQUk7QUFDdkIscUJBQWlCLEVBQUUsSUFBSTtBQUN2QixRQUFJLEVBQUUsS0FBSztBQUNYLGNBQVUsRUFBRSxLQUFLO0FBQ2pCLGFBQVMsRUFBRSxLQUFLO0FBQ2hCLGlCQUFhLEVBQUUsS0FBSztBQUNwQixlQUFXLEVBQUUsSUFBSTtBQUNqQixpQkFBYSxFQUFFLEtBQUs7QUFDcEIsbUJBQWUsRUFBRSxLQUFLO0FBQ3RCLGNBQVUsRUFBRSxJQUFJO0FBQ2hCLHVCQUFtQixFQUFFLElBQUk7R0FDMUIsQ0FBQzs7QUFFRixPQUFLLElBQUksS0FBSSxJQUFJLFVBQVUsRUFBRTtBQUMzQixRQUFJLFNBQVMsQ0FBQyxLQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7QUFDakMsVUFBSSxhQUFhLEdBQUcsNEJBQVUsS0FBSSxDQUFDLENBQUM7QUFDcEMsVUFBSSxVQUFVLENBQUMsS0FBSSxDQUFDLEtBQUssSUFBSSxFQUFFO0FBQzdCLGNBQU0sQ0FBQyxhQUFhLENBQUMsR0FBRztBQUN0QixnQkFBTSxFQUFFLENBQUM7U0FDVixDQUFDO09BQ0gsTUFBTTtBQUNMLGNBQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSSxDQUFDLENBQUM7T0FDekM7QUFDRCxVQUFJLE9BQU8sTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sS0FBSyxXQUFXLEVBQUU7QUFDdkQsY0FBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7T0FDbEM7S0FDRjtHQUNGOztBQUVELFNBQU8sTUFBTSxDQUFDO0NBQ2YiLCJmaWxlIjoiY2xpLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsb25lIGZyb20gJ2xvZGFzaC5jbG9uZSc7XG5pbXBvcnQgc25ha2VDYXNlIGZyb20gJ3NuYWtlLWNhc2UnO1xuXG4vLyBDb252ZXJ0IGZyb20gY29tbWFuZCBsaW5lIG9wdGlvbiBmb3JtYXQgdG8gc25ha2UgY2FzZSBmb3IgdGhlIEpTY3JhbWJsZXIgQVBJLlxuLy8gSXQgYWxzbyByZXBsYWNlcyB0cnV0aHkgYm9vbGVhbiBmbGFncyB3aXRoICVERUZBVUxUJSB2YWx1ZXNcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUFuZFBhcnNlUGFyYW1zIChjb21tYW5kZXIsIHBhcmFtcykge1xuICBwYXJhbXMgPSBjbG9uZShwYXJhbXMgfHwge30pO1xuXG4gIC8vIE92ZXJyaWRlIHBhcmFtcyBmaWxlIGNoYW5nZXMgd2l0aCBhbnkgc3BlY2lmaWVkIGNvbW1hbmQgbGluZSBvcHRpb25zXG4gIC8vIFRPRE8gUG9wdWxhdGUgdGhpcyBsaXN0IGJhc2VkIG9uIGFuIGV4dGVybmFsIEpTT05cbiAgLy8gRklYTUUgVGhpcyBsaXN0IGlzIGRlcHJlY2F0ZWRcbiAgY29uc3QgaXNCb29sRmxhZyA9IHtcbiAgICBhc3NlcnRzRWxpbWluYXRpb246IGZhbHNlLFxuICAgIGJyb3dzZXJPc0xvY2s6IGZhbHNlLFxuICAgIGNvbnN0YW50Rm9sZGluZzogdHJ1ZSxcbiAgICBkZWFkQ29kZTogdHJ1ZSxcbiAgICBkZWFkQ29kZUVsaW1pbmF0aW9uOiB0cnVlLFxuICAgIGRlYnVnZ2luZ0NvZGVFbGltaW5hdGlvbjogZmFsc2UsXG4gICAgZGljdGlvbmFyeUNvbXByZXNzaW9uOiB0cnVlLFxuICAgIGRvbWFpbkxvY2s6IGZhbHNlLFxuICAgIGRvbWFpbkxvY2tXYXJuaW5nRnVuY3Rpb246IGZhbHNlLFxuICAgIGRvdE5vdGF0aW9uRWxpbWluYXRpb246IHRydWUsXG4gICAgZXhjZXB0aW9uc0xpc3Q6IGZhbHNlLFxuICAgIGV4cGlyYXRpb25EYXRlOiBmYWxzZSxcbiAgICBleHBpcmF0aW9uRGF0ZVdhcm5pbmdGdW5jdGlvbjogZmFsc2UsXG4gICAgZnVuY3Rpb25PdXRsaW5pbmc6IHRydWUsXG4gICAgZnVuY3Rpb25SZW9yZGVyOiB0cnVlLFxuICAgIGlnbm9yZUZpbGVzOiBmYWxzZSxcbiAgICBsaXRlcmFsSG9va2luZzogZmFsc2UsXG4gICAgbGl0ZXJhbER1cGxpY2F0ZXM6IHRydWUsXG4gICAgbWVtYmVyRW51bWVyYXRpb246IHRydWUsXG4gICAgbW9kZTogZmFsc2UsXG4gICAgbmFtZVByZWZpeDogZmFsc2UsXG4gICAgcmVuYW1lQWxsOiBmYWxzZSxcbiAgICByZW5hbWVJbmNsdWRlOiBmYWxzZSxcbiAgICByZW5hbWVMb2NhbDogdHJ1ZSxcbiAgICBzZWxmRGVmZW5kaW5nOiBmYWxzZSxcbiAgICBzdHJpbmdTcGxpdHRpbmc6IGZhbHNlLFxuICAgIHdoaXRlc3BhY2U6IHRydWUsXG4gICAgcHJlc2VydmVBbm5vdGF0aW9uczogdHJ1ZVxuICB9O1xuXG4gIGZvciAobGV0IG5hbWUgaW4gaXNCb29sRmxhZykge1xuICAgIGlmIChjb21tYW5kZXJbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgbGV0IHNuYWtlQ2FzZU5hbWUgPSBzbmFrZUNhc2UobmFtZSk7XG4gICAgICBpZiAoaXNCb29sRmxhZ1tuYW1lXSA9PT0gdHJ1ZSkge1xuICAgICAgICBwYXJhbXNbc25ha2VDYXNlTmFtZV0gPSB7XG4gICAgICAgICAgc3RhdHVzOiAxXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJhbXNbc25ha2VDYXNlTmFtZV0gPSBjb21tYW5kZXJbbmFtZV07XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHBhcmFtc1tzbmFrZUNhc2VOYW1lXS5zdGF0dXMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBhcmFtc1tzbmFrZUNhc2VOYW1lXS5zdGF0dXMgPSAxO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBwYXJhbXM7XG59XG4iXX0=
