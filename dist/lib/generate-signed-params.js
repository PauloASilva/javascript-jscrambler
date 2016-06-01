'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = signedParams;

var _lodash = require('lodash.clone');

var _lodash2 = _interopRequireDefault(_lodash);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _lodash3 = require('lodash.defaults');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.keys');

var _lodash6 = _interopRequireDefault(_lodash5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = !!process.env.DEBUG;

function signedParams(method, path, host, keys) {
  var params = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

  params = (0, _lodash4.default)((0, _lodash2.default)(params), {
    access_key: keys.accessKey,
    timestamp: new Date().toISOString()
  });
  params.signature = generateHmacSignature(method, path, host, keys, params);
  return params;
}

function generateHmacSignature(method, path, host, keys, params) {
  var paramsCopy = (0, _lodash2.default)(params);
  var signatureData = method.toUpperCase() + ';' + host.toLowerCase() + ';' + path + ';' + buildSortedQuery(paramsCopy);
  debug && console.log('Signature data: ' + signatureData);
  var hmac = _crypto2.default.createHmac('sha256', keys.secretKey.toUpperCase());
  hmac.update(signatureData);
  return hmac.digest('base64');
}

function buildSortedQuery(params) {
  // Sorted keys
  var _keys = (0, _lodash6.default)(params).sort();
  var query = '';
  for (var i = 0, l = _keys.length; i < l; i++) {
    query += encodeURIComponent(_keys[i]) + '=' + encodeURIComponent(params[_keys[i]]) + '&';
  }
  query = query.replace(/\*/g, '%2A').replace(/[!'()]/g, escape).replace(/%7E/g, '~').replace(/\+/g, '%20');
  // Strip the last separator and return
  return query.substring(0, query.length - 1);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZ2VuZXJhdGUtc2lnbmVkLXBhcmFtcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztrQkFPd0IsWTs7QUFQeEI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sUUFBUSxDQUFDLENBQUMsUUFBUSxHQUFSLENBQVksS0FBNUI7O0FBRWUsU0FBUyxZQUFULENBQXVCLE1BQXZCLEVBQStCLElBQS9CLEVBQXFDLElBQXJDLEVBQTJDLElBQTNDLEVBQThEO0FBQUEsTUFBYixNQUFhLHlEQUFKLEVBQUk7O0FBQzNFLFdBQVMsc0JBQVMsc0JBQU0sTUFBTixDQUFULEVBQXdCO0FBQy9CLGdCQUFZLEtBQUssU0FEYztBQUUvQixlQUFXLElBQUksSUFBSixHQUFXLFdBQVg7QUFGb0IsR0FBeEIsQ0FBVDtBQUlBLFNBQU8sU0FBUCxHQUFtQixzQkFBc0IsTUFBdEIsRUFBOEIsSUFBOUIsRUFBb0MsSUFBcEMsRUFBMEMsSUFBMUMsRUFBZ0QsTUFBaEQsQ0FBbkI7QUFDQSxTQUFPLE1BQVA7QUFDRDs7QUFFRCxTQUFTLHFCQUFULENBQWdDLE1BQWhDLEVBQXdDLElBQXhDLEVBQThDLElBQTlDLEVBQW9ELElBQXBELEVBQTBELE1BQTFELEVBQWtFO0FBQ2hFLE1BQUksYUFBYSxzQkFBTSxNQUFOLENBQWpCO0FBQ0EsTUFBSSxnQkFBZ0IsT0FBTyxXQUFQLEtBQXVCLEdBQXZCLEdBQTZCLEtBQUssV0FBTCxFQUE3QixHQUNsQixHQURrQixHQUNaLElBRFksR0FDTCxHQURLLEdBQ0MsaUJBQWlCLFVBQWpCLENBRHJCO0FBRUEsV0FBUyxRQUFRLEdBQVIsQ0FBWSxxQkFBcUIsYUFBakMsQ0FBVDtBQUNBLE1BQUksT0FBTyxpQkFBTyxVQUFQLENBQWtCLFFBQWxCLEVBQTRCLEtBQUssU0FBTCxDQUFlLFdBQWYsRUFBNUIsQ0FBWDtBQUNBLE9BQUssTUFBTCxDQUFZLGFBQVo7QUFDQSxTQUFPLEtBQUssTUFBTCxDQUFZLFFBQVosQ0FBUDtBQUNEOztBQUVELFNBQVMsZ0JBQVQsQ0FBMkIsTUFBM0IsRUFBbUM7O0FBRWpDLE1BQUksUUFBUSxzQkFBSyxNQUFMLEVBQWEsSUFBYixFQUFaO0FBQ0EsTUFBSSxRQUFRLEVBQVo7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLElBQUksQ0FBdEMsRUFBeUMsR0FBekMsRUFBOEM7QUFDNUMsYUFBUyxtQkFBbUIsTUFBTSxDQUFOLENBQW5CLElBQStCLEdBQS9CLEdBQXFDLG1CQUFtQixPQUFPLE1BQU0sQ0FBTixDQUFQLENBQW5CLENBQXJDLEdBQTRFLEdBQXJGO0FBQ0Q7QUFDRCxVQUFRLE1BQ0wsT0FESyxDQUNHLEtBREgsRUFDVSxLQURWLEVBRUwsT0FGSyxDQUVHLFNBRkgsRUFFYyxNQUZkLEVBR0wsT0FISyxDQUdHLE1BSEgsRUFHVyxHQUhYLEVBSUwsT0FKSyxDQUlHLEtBSkgsRUFJVSxLQUpWLENBQVI7O0FBTUEsU0FBTyxNQUFNLFNBQU4sQ0FBZ0IsQ0FBaEIsRUFBbUIsTUFBTSxNQUFOLEdBQWUsQ0FBbEMsQ0FBUDtBQUNEIiwiZmlsZSI6ImdlbmVyYXRlLXNpZ25lZC1wYXJhbXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lJztcbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCBkZWZhdWx0cyBmcm9tICdsb2Rhc2guZGVmYXVsdHMnO1xuaW1wb3J0IGtleXMgZnJvbSAnbG9kYXNoLmtleXMnO1xuXG5jb25zdCBkZWJ1ZyA9ICEhcHJvY2Vzcy5lbnYuREVCVUc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNpZ25lZFBhcmFtcyAobWV0aG9kLCBwYXRoLCBob3N0LCBrZXlzLCBwYXJhbXMgPSB7fSkge1xuICBwYXJhbXMgPSBkZWZhdWx0cyhjbG9uZShwYXJhbXMpLCB7XG4gICAgYWNjZXNzX2tleToga2V5cy5hY2Nlc3NLZXksXG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKClcbiAgfSk7XG4gIHBhcmFtcy5zaWduYXR1cmUgPSBnZW5lcmF0ZUhtYWNTaWduYXR1cmUobWV0aG9kLCBwYXRoLCBob3N0LCBrZXlzLCBwYXJhbXMpO1xuICByZXR1cm4gcGFyYW1zO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUhtYWNTaWduYXR1cmUgKG1ldGhvZCwgcGF0aCwgaG9zdCwga2V5cywgcGFyYW1zKSB7XG4gIHZhciBwYXJhbXNDb3B5ID0gY2xvbmUocGFyYW1zKTtcbiAgdmFyIHNpZ25hdHVyZURhdGEgPSBtZXRob2QudG9VcHBlckNhc2UoKSArICc7JyArIGhvc3QudG9Mb3dlckNhc2UoKSArXG4gICAgJzsnICsgcGF0aCArICc7JyArIGJ1aWxkU29ydGVkUXVlcnkocGFyYW1zQ29weSk7XG4gIGRlYnVnICYmIGNvbnNvbGUubG9nKCdTaWduYXR1cmUgZGF0YTogJyArIHNpZ25hdHVyZURhdGEpO1xuICB2YXIgaG1hYyA9IGNyeXB0by5jcmVhdGVIbWFjKCdzaGEyNTYnLCBrZXlzLnNlY3JldEtleS50b1VwcGVyQ2FzZSgpKTtcbiAgaG1hYy51cGRhdGUoc2lnbmF0dXJlRGF0YSk7XG4gIHJldHVybiBobWFjLmRpZ2VzdCgnYmFzZTY0Jyk7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkU29ydGVkUXVlcnkgKHBhcmFtcykge1xuICAvLyBTb3J0ZWQga2V5c1xuICB2YXIgX2tleXMgPSBrZXlzKHBhcmFtcykuc29ydCgpO1xuICB2YXIgcXVlcnkgPSAnJztcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBfa2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBxdWVyeSArPSBlbmNvZGVVUklDb21wb25lbnQoX2tleXNbaV0pICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtc1tfa2V5c1tpXV0pICsgJyYnO1xuICB9XG4gIHF1ZXJ5ID0gcXVlcnlcbiAgICAucmVwbGFjZSgvXFwqL2csICclMkEnKVxuICAgIC5yZXBsYWNlKC9bIScoKV0vZywgZXNjYXBlKVxuICAgIC5yZXBsYWNlKC8lN0UvZywgJ34nKVxuICAgIC5yZXBsYWNlKC9cXCsvZywgJyUyMCcpO1xuICAvLyBTdHJpcCB0aGUgbGFzdCBzZXBhcmF0b3IgYW5kIHJldHVyblxuICByZXR1cm4gcXVlcnkuc3Vic3RyaW5nKDAsIHF1ZXJ5Lmxlbmd0aCAtIDEpO1xufVxuIl19
