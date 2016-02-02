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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9nZW5lcmF0ZS1zaWduZWQtcGFyYW1zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O3FCQU93QixZQUFZOzs7OzJCQVBsQixjQUFjOzs7O3NCQUNiLFFBQVE7Ozs7OEJBQ04saUJBQWlCOzs7OzBCQUNyQixhQUFhOzs7O0FBRTlCLElBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQzs7QUFFbkIsU0FBUyxZQUFZLENBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFlO01BQWIsTUFBTSx5REFBRyxFQUFFOztBQUN6RSxRQUFNLEdBQUcsaUNBQVMsOEJBQU0sTUFBTSxDQUFDLEVBQUU7QUFDL0IsY0FBVSxFQUFFLElBQUksQ0FBQyxTQUFTO0FBQzFCLGFBQVMsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtHQUNwQyxDQUFDLENBQUM7QUFDSCxRQUFNLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMzRSxTQUFPLE1BQU0sQ0FBQztDQUNmOztBQUVELFNBQVMscUJBQXFCLENBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtBQUNoRSxNQUFJLFVBQVUsR0FBRyw4QkFBTSxNQUFNLENBQUMsQ0FBQztBQUMvQixNQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsR0FDakUsR0FBRyxHQUFHLElBQUksR0FBRyxHQUFHLEdBQUcsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbEQsT0FBSyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsYUFBYSxDQUFDLENBQUM7QUFDekQsTUFBSSxJQUFJLEdBQUcsb0JBQU8sVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDckUsTUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMzQixTQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Q0FDOUI7O0FBRUQsU0FBUyxnQkFBZ0IsQ0FBRSxNQUFNLEVBQUU7O0FBRWpDLE1BQUksS0FBSyxHQUFHLDZCQUFLLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hDLE1BQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNmLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDNUMsU0FBSyxJQUFJLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7R0FDMUY7QUFDRCxPQUFLLEdBQUcsS0FBSyxDQUNWLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQ3JCLE9BQU8sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQzFCLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQ3BCLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRXpCLFNBQU8sS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztDQUM3QyIsImZpbGUiOiJnZW5lcmF0ZS1zaWduZWQtcGFyYW1zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsb25lIGZyb20gJ2xvZGFzaC5jbG9uZSc7XG5pbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnbG9kYXNoLmRlZmF1bHRzJztcbmltcG9ydCBrZXlzIGZyb20gJ2xvZGFzaC5rZXlzJztcblxuY29uc3QgZGVidWcgPSAhIXByb2Nlc3MuZW52LkRFQlVHO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaWduZWRQYXJhbXMgKG1ldGhvZCwgcGF0aCwgaG9zdCwga2V5cywgcGFyYW1zID0ge30pIHtcbiAgcGFyYW1zID0gZGVmYXVsdHMoY2xvbmUocGFyYW1zKSwge1xuICAgIGFjY2Vzc19rZXk6IGtleXMuYWNjZXNzS2V5LFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gIH0pO1xuICBwYXJhbXMuc2lnbmF0dXJlID0gZ2VuZXJhdGVIbWFjU2lnbmF0dXJlKG1ldGhvZCwgcGF0aCwgaG9zdCwga2V5cywgcGFyYW1zKTtcbiAgcmV0dXJuIHBhcmFtcztcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVIbWFjU2lnbmF0dXJlIChtZXRob2QsIHBhdGgsIGhvc3QsIGtleXMsIHBhcmFtcykge1xuICB2YXIgcGFyYW1zQ29weSA9IGNsb25lKHBhcmFtcyk7XG4gIHZhciBzaWduYXR1cmVEYXRhID0gbWV0aG9kLnRvVXBwZXJDYXNlKCkgKyAnOycgKyBob3N0LnRvTG93ZXJDYXNlKCkgK1xuICAgICc7JyArIHBhdGggKyAnOycgKyBidWlsZFNvcnRlZFF1ZXJ5KHBhcmFtc0NvcHkpO1xuICBkZWJ1ZyAmJiBjb25zb2xlLmxvZygnU2lnbmF0dXJlIGRhdGE6ICcgKyBzaWduYXR1cmVEYXRhKTtcbiAgdmFyIGhtYWMgPSBjcnlwdG8uY3JlYXRlSG1hYygnc2hhMjU2Jywga2V5cy5zZWNyZXRLZXkudG9VcHBlckNhc2UoKSk7XG4gIGhtYWMudXBkYXRlKHNpZ25hdHVyZURhdGEpO1xuICByZXR1cm4gaG1hYy5kaWdlc3QoJ2Jhc2U2NCcpO1xufVxuXG5mdW5jdGlvbiBidWlsZFNvcnRlZFF1ZXJ5IChwYXJhbXMpIHtcbiAgLy8gU29ydGVkIGtleXNcbiAgdmFyIF9rZXlzID0ga2V5cyhwYXJhbXMpLnNvcnQoKTtcbiAgdmFyIHF1ZXJ5ID0gJyc7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gX2tleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgcXVlcnkgKz0gZW5jb2RlVVJJQ29tcG9uZW50KF9rZXlzW2ldKSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudChwYXJhbXNbX2tleXNbaV1dKSArICcmJztcbiAgfVxuICBxdWVyeSA9IHF1ZXJ5XG4gICAgLnJlcGxhY2UoL1xcKi9nLCAnJTJBJylcbiAgICAucmVwbGFjZSgvWyEnKCldL2csIGVzY2FwZSlcbiAgICAucmVwbGFjZSgvJTdFL2csICd+JylcbiAgICAucmVwbGFjZSgvXFwrL2csICclMjAnKTtcbiAgLy8gU3RyaXAgdGhlIGxhc3Qgc2VwYXJhdG9yIGFuZCByZXR1cm5cbiAgcmV0dXJuIHF1ZXJ5LnN1YnN0cmluZygwLCBxdWVyeS5sZW5ndGggLSAxKTtcbn1cbiJdfQ==
