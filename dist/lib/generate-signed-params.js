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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZ2VuZXJhdGUtc2lnbmVkLXBhcmFtcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztrQkFPd0IsWTs7QUFQeEI7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sUUFBUSxDQUFDLENBQUMsUUFBUSxHQUFSLENBQVksS0FBNUI7O0FBRWUsU0FBUyxZQUFULENBQXVCLE1BQXZCLEVBQStCLElBQS9CLEVBQXFDLElBQXJDLEVBQTJDLElBQTNDLEVBQThEO0FBQUEsTUFBYixNQUFhLHlEQUFKLEVBQUk7O0FBQzNFLFdBQVMsc0JBQVMsc0JBQU0sTUFBTixDQUFULEVBQXdCO0FBQy9CLGdCQUFZLEtBQUssU0FEYztBQUUvQixlQUFXLElBQUksSUFBSixHQUFXLFdBQVg7QUFGb0IsR0FBeEIsQ0FBVDtBQUlBLFNBQU8sU0FBUCxHQUFtQixzQkFBc0IsTUFBdEIsRUFBOEIsSUFBOUIsRUFBb0MsSUFBcEMsRUFBMEMsSUFBMUMsRUFBZ0QsTUFBaEQsQ0FBbkI7QUFDQSxTQUFPLE1BQVA7QUFDRDs7QUFFRCxTQUFTLHFCQUFULENBQWdDLE1BQWhDLEVBQXdDLElBQXhDLEVBQThDLElBQTlDLEVBQW9ELElBQXBELEVBQTBELE1BQTFELEVBQWtFO0FBQ2hFLE1BQUksYUFBYSxzQkFBTSxNQUFOLENBQWpCO0FBQ0EsTUFBSSxnQkFBZ0IsT0FBTyxXQUFQLEtBQXVCLEdBQXZCLEdBQTZCLEtBQUssV0FBTCxFQUE3QixHQUNsQixHQURrQixHQUNaLElBRFksR0FDTCxHQURLLEdBQ0MsaUJBQWlCLFVBQWpCLENBRHJCO0FBRUEsV0FBUyxRQUFRLEdBQVIsQ0FBWSxxQkFBcUIsYUFBakMsQ0FBVDtBQUNBLE1BQUksT0FBTyxpQkFBTyxVQUFQLENBQWtCLFFBQWxCLEVBQTRCLEtBQUssU0FBTCxDQUFlLFdBQWYsRUFBNUIsQ0FBWDtBQUNBLE9BQUssTUFBTCxDQUFZLGFBQVo7QUFDQSxTQUFPLEtBQUssTUFBTCxDQUFZLFFBQVosQ0FBUDtBQUNEOztBQUVELFNBQVMsZ0JBQVQsQ0FBMkIsTUFBM0IsRUFBbUM7QUFDakM7QUFDQSxNQUFJLFFBQVEsc0JBQUssTUFBTCxFQUFhLElBQWIsRUFBWjtBQUNBLE1BQUksUUFBUSxFQUFaO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBUixFQUFXLElBQUksTUFBTSxNQUExQixFQUFrQyxJQUFJLENBQXRDLEVBQXlDLEdBQXpDLEVBQThDO0FBQzVDLGFBQVMsbUJBQW1CLE1BQU0sQ0FBTixDQUFuQixJQUErQixHQUEvQixHQUFxQyxtQkFBbUIsT0FBTyxNQUFNLENBQU4sQ0FBUCxDQUFuQixDQUFyQyxHQUE0RSxHQUFyRjtBQUNEO0FBQ0QsVUFBUSxNQUNMLE9BREssQ0FDRyxLQURILEVBQ1UsS0FEVixFQUVMLE9BRkssQ0FFRyxTQUZILEVBRWMsTUFGZCxFQUdMLE9BSEssQ0FHRyxNQUhILEVBR1csR0FIWCxFQUlMLE9BSkssQ0FJRyxLQUpILEVBSVUsS0FKVixDQUFSO0FBS0E7QUFDQSxTQUFPLE1BQU0sU0FBTixDQUFnQixDQUFoQixFQUFtQixNQUFNLE1BQU4sR0FBZSxDQUFsQyxDQUFQO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGUtc2lnbmVkLXBhcmFtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbG9uZSBmcm9tICdsb2Rhc2guY2xvbmUnO1xuaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJ2xvZGFzaC5kZWZhdWx0cyc7XG5pbXBvcnQga2V5cyBmcm9tICdsb2Rhc2gua2V5cyc7XG5cbmNvbnN0IGRlYnVnID0gISFwcm9jZXNzLmVudi5ERUJVRztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2lnbmVkUGFyYW1zIChtZXRob2QsIHBhdGgsIGhvc3QsIGtleXMsIHBhcmFtcyA9IHt9KSB7XG4gIHBhcmFtcyA9IGRlZmF1bHRzKGNsb25lKHBhcmFtcyksIHtcbiAgICBhY2Nlc3Nfa2V5OiBrZXlzLmFjY2Vzc0tleSxcbiAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICB9KTtcbiAgcGFyYW1zLnNpZ25hdHVyZSA9IGdlbmVyYXRlSG1hY1NpZ25hdHVyZShtZXRob2QsIHBhdGgsIGhvc3QsIGtleXMsIHBhcmFtcyk7XG4gIHJldHVybiBwYXJhbXM7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlSG1hY1NpZ25hdHVyZSAobWV0aG9kLCBwYXRoLCBob3N0LCBrZXlzLCBwYXJhbXMpIHtcbiAgdmFyIHBhcmFtc0NvcHkgPSBjbG9uZShwYXJhbXMpO1xuICB2YXIgc2lnbmF0dXJlRGF0YSA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpICsgJzsnICsgaG9zdC50b0xvd2VyQ2FzZSgpICtcbiAgICAnOycgKyBwYXRoICsgJzsnICsgYnVpbGRTb3J0ZWRRdWVyeShwYXJhbXNDb3B5KTtcbiAgZGVidWcgJiYgY29uc29sZS5sb2coJ1NpZ25hdHVyZSBkYXRhOiAnICsgc2lnbmF0dXJlRGF0YSk7XG4gIHZhciBobWFjID0gY3J5cHRvLmNyZWF0ZUhtYWMoJ3NoYTI1NicsIGtleXMuc2VjcmV0S2V5LnRvVXBwZXJDYXNlKCkpO1xuICBobWFjLnVwZGF0ZShzaWduYXR1cmVEYXRhKTtcbiAgcmV0dXJuIGhtYWMuZGlnZXN0KCdiYXNlNjQnKTtcbn1cblxuZnVuY3Rpb24gYnVpbGRTb3J0ZWRRdWVyeSAocGFyYW1zKSB7XG4gIC8vIFNvcnRlZCBrZXlzXG4gIHZhciBfa2V5cyA9IGtleXMocGFyYW1zKS5zb3J0KCk7XG4gIHZhciBxdWVyeSA9ICcnO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IF9rZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHF1ZXJ5ICs9IGVuY29kZVVSSUNvbXBvbmVudChfa2V5c1tpXSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1zW19rZXlzW2ldXSkgKyAnJic7XG4gIH1cbiAgcXVlcnkgPSBxdWVyeVxuICAgIC5yZXBsYWNlKC9cXCovZywgJyUyQScpXG4gICAgLnJlcGxhY2UoL1shJygpXS9nLCBlc2NhcGUpXG4gICAgLnJlcGxhY2UoLyU3RS9nLCAnficpXG4gICAgLnJlcGxhY2UoL1xcKy9nLCAnJTIwJyk7XG4gIC8vIFN0cmlwIHRoZSBsYXN0IHNlcGFyYXRvciBhbmQgcmV0dXJuXG4gIHJldHVybiBxdWVyeS5zdWJzdHJpbmcoMCwgcXVlcnkubGVuZ3RoIC0gMSk7XG59XG4iXX0=
