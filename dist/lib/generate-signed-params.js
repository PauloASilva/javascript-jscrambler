'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = signedParams;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashClone = require('lodash.clone');

var _lodashClone2 = _interopRequireDefault(_lodashClone);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _lodashDefaults = require('lodash.defaults');

var _lodashDefaults2 = _interopRequireDefault(_lodashDefaults);

var _lodashKeys = require('lodash.keys');

var _lodashKeys2 = _interopRequireDefault(_lodashKeys);

var debug = !!process.env.DEBUG;

function signedParams(method, path, host, keys) {
  var params = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

  params = (0, _lodashDefaults2['default'])((0, _lodashClone2['default'])(params), {
    access_key: keys.accessKey,
    timestamp: new Date().toISOString()
  });
  params.signature = generateHmacSignature(method, path, host, keys, params);
  return params;
}

function generateHmacSignature(method, path, host, keys, params) {
  var paramsCopy = (0, _lodashClone2['default'])(params);
  var signatureData = method.toUpperCase() + ';' + host.toLowerCase() + ';' + path + ';' + buildSortedQuery(paramsCopy);
  debug && console.log('Signature data: ' + signatureData);
  var hmac = _crypto2['default'].createHmac('sha256', keys.secretKey.toUpperCase());
  hmac.update(signatureData);
  return hmac.digest('base64');
}

function buildSortedQuery(params) {
  // Sorted keys
  var _keys = (0, _lodashKeys2['default'])(params).sort();
  var query = '';
  for (var i = 0, l = _keys.length; i < l; i++) {
    query += encodeURIComponent(_keys[i]) + '=' + encodeURIComponent(params[_keys[i]]) + '&';
  }
  query = query.replace(/\*/g, '%2A').replace(/[!'()]/g, escape).replace(/%7E/g, '~').replace(/\+/g, '%20');
  // Strip the last separator and return
  return query.substring(0, query.length - 1);
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvZ2VuZXJhdGUtc2lnbmVkLXBhcmFtcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztxQkFPd0IsWUFBWTs7OzsyQkFQbEIsY0FBYzs7OztzQkFDYixRQUFROzs7OzhCQUNOLGlCQUFpQjs7OzswQkFDckIsYUFBYTs7OztBQUU5QixJQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7O0FBRW5CLFNBQVMsWUFBWSxDQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBZTtNQUFiLE1BQU0seURBQUcsRUFBRTs7QUFDekUsUUFBTSxHQUFHLGlDQUFTLDhCQUFNLE1BQU0sQ0FBQyxFQUFFO0FBQy9CLGNBQVUsRUFBRSxJQUFJLENBQUMsU0FBUztBQUMxQixhQUFTLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLEVBQUU7R0FDcEMsQ0FBQyxDQUFDO0FBQ0gsUUFBTSxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDM0UsU0FBTyxNQUFNLENBQUM7Q0FDZjs7QUFFRCxTQUFTLHFCQUFxQixDQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7QUFDaEUsTUFBSSxVQUFVLEdBQUcsOEJBQU0sTUFBTSxDQUFDLENBQUM7QUFDL0IsTUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQ2pFLEdBQUcsR0FBRyxJQUFJLEdBQUcsR0FBRyxHQUFHLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2xELE9BQUssSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixHQUFHLGFBQWEsQ0FBQyxDQUFDO0FBQ3pELE1BQUksSUFBSSxHQUFHLG9CQUFPLFVBQVUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0FBQ3JFLE1BQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDM0IsU0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0NBQzlCOztBQUVELFNBQVMsZ0JBQWdCLENBQUUsTUFBTSxFQUFFOztBQUVqQyxNQUFJLEtBQUssR0FBRyw2QkFBSyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNoQyxNQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDZixPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVDLFNBQUssSUFBSSxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0dBQzFGO0FBQ0QsT0FBSyxHQUFHLEtBQUssQ0FDVixPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUNyQixPQUFPLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUMxQixPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUNwQixPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUV6QixTQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7Q0FDN0MiLCJmaWxlIjoiZ2VuZXJhdGUtc2lnbmVkLXBhcmFtcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbG9uZSBmcm9tICdsb2Rhc2guY2xvbmUnO1xuaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJ2xvZGFzaC5kZWZhdWx0cyc7XG5pbXBvcnQga2V5cyBmcm9tICdsb2Rhc2gua2V5cyc7XG5cbmNvbnN0IGRlYnVnID0gISFwcm9jZXNzLmVudi5ERUJVRztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc2lnbmVkUGFyYW1zIChtZXRob2QsIHBhdGgsIGhvc3QsIGtleXMsIHBhcmFtcyA9IHt9KSB7XG4gIHBhcmFtcyA9IGRlZmF1bHRzKGNsb25lKHBhcmFtcyksIHtcbiAgICBhY2Nlc3Nfa2V5OiBrZXlzLmFjY2Vzc0tleSxcbiAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKVxuICB9KTtcbiAgcGFyYW1zLnNpZ25hdHVyZSA9IGdlbmVyYXRlSG1hY1NpZ25hdHVyZShtZXRob2QsIHBhdGgsIGhvc3QsIGtleXMsIHBhcmFtcyk7XG4gIHJldHVybiBwYXJhbXM7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlSG1hY1NpZ25hdHVyZSAobWV0aG9kLCBwYXRoLCBob3N0LCBrZXlzLCBwYXJhbXMpIHtcbiAgdmFyIHBhcmFtc0NvcHkgPSBjbG9uZShwYXJhbXMpO1xuICB2YXIgc2lnbmF0dXJlRGF0YSA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpICsgJzsnICsgaG9zdC50b0xvd2VyQ2FzZSgpICtcbiAgICAnOycgKyBwYXRoICsgJzsnICsgYnVpbGRTb3J0ZWRRdWVyeShwYXJhbXNDb3B5KTtcbiAgZGVidWcgJiYgY29uc29sZS5sb2coJ1NpZ25hdHVyZSBkYXRhOiAnICsgc2lnbmF0dXJlRGF0YSk7XG4gIHZhciBobWFjID0gY3J5cHRvLmNyZWF0ZUhtYWMoJ3NoYTI1NicsIGtleXMuc2VjcmV0S2V5LnRvVXBwZXJDYXNlKCkpO1xuICBobWFjLnVwZGF0ZShzaWduYXR1cmVEYXRhKTtcbiAgcmV0dXJuIGhtYWMuZGlnZXN0KCdiYXNlNjQnKTtcbn1cblxuZnVuY3Rpb24gYnVpbGRTb3J0ZWRRdWVyeSAocGFyYW1zKSB7XG4gIC8vIFNvcnRlZCBrZXlzXG4gIHZhciBfa2V5cyA9IGtleXMocGFyYW1zKS5zb3J0KCk7XG4gIHZhciBxdWVyeSA9ICcnO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IF9rZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIHF1ZXJ5ICs9IGVuY29kZVVSSUNvbXBvbmVudChfa2V5c1tpXSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQocGFyYW1zW19rZXlzW2ldXSkgKyAnJic7XG4gIH1cbiAgcXVlcnkgPSBxdWVyeVxuICAgIC5yZXBsYWNlKC9cXCovZywgJyUyQScpXG4gICAgLnJlcGxhY2UoL1shJygpXS9nLCBlc2NhcGUpXG4gICAgLnJlcGxhY2UoLyU3RS9nLCAnficpXG4gICAgLnJlcGxhY2UoL1xcKy9nLCAnJTIwJyk7XG4gIC8vIFN0cmlwIHRoZSBsYXN0IHNlcGFyYXRvciBhbmQgcmV0dXJuXG4gIHJldHVybiBxdWVyeS5zdWJzdHJpbmcoMCwgcXVlcnkubGVuZ3RoIC0gMSk7XG59XG4iXX0=
