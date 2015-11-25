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

function signedParams(method, path, host, keys) {
  var params = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

  params = (0, _lodashDefaults2['default'])((0, _lodashClone2['default'])(params), {
    access_key: keys.accessKey,
    timestamp: new Date().toISOString()
  });
  params.signature = generateHmacSignature.call(this, method, path, host, keys, params);
  return params;
}

function generateHmacSignature(method, path, host, keys, params) {
  var paramsCopy = (0, _lodashClone2['default'])(params);
  var signatureData = method.toUpperCase() + ';' + host.toLowerCase() + ';' + path + ';' + buildSortedQuery(paramsCopy);
  typeof debug !== 'undefined' && debug && console.log('Signature data: ' + signatureData);
  var hmac = _crypto2['default'].createHmac('sha256', keys.secretKey.toUpperCase());
  hmac.update(signatureData);
  return hmac.digest('base64');
}

function buildSortedQuery(params) {
  // Sorted keys
  var _keys = (0, _lodashKeys2['default'])(params).sort();
  var query = '';
  for (var i = 0, l = _keys.length; i < l; i++) query += encodeURIComponent(_keys[i]) + '=' + encodeURIComponent(params[_keys[i]]) + '&';
  query = query.replace(/\*/g, '%2A').replace(/[!'()]/g, escape).replace(/%7E/g, '~').replace(/\+/g, '%20');
  // Strip the last separator and return
  return query.substring(0, query.length - 1);
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9nZW5lcmF0ZS1zaWduZWQtcGFyYW1zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O3FCQUt3QixZQUFZOzs7OzJCQUxsQixjQUFjOzs7O3NCQUNiLFFBQVE7Ozs7OEJBQ04saUJBQWlCOzs7OzBCQUNyQixhQUFhOzs7O0FBRWYsU0FBUyxZQUFZLENBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFlO01BQWIsTUFBTSx5REFBRyxFQUFFOztBQUN6RSxRQUFNLEdBQUcsaUNBQVMsOEJBQU0sTUFBTSxDQUFDLEVBQUU7QUFDL0IsY0FBVSxFQUFFLElBQUksQ0FBQyxTQUFTO0FBQzFCLGFBQVMsRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsRUFBRTtHQUNwQyxDQUFDLENBQUM7QUFDSCxRQUFNLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3RGLFNBQU8sTUFBTSxDQUFDO0NBQ2Y7O0FBRUQsU0FBUyxxQkFBcUIsQ0FBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO0FBQ2hFLE1BQUksVUFBVSxHQUFHLDhCQUFNLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLE1BQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUNqRSxHQUFHLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNsRCxTQUFPLEtBQUssS0FBSyxXQUFXLElBQUksS0FBSyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsYUFBYSxDQUFDLENBQUM7QUFDekYsTUFBSSxJQUFJLEdBQUcsb0JBQU8sVUFBVSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDckUsTUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUMzQixTQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7Q0FDOUI7O0FBRUQsU0FBUyxnQkFBZ0IsQ0FBRSxNQUFNLEVBQUU7O0FBRWpDLE1BQUksS0FBSyxHQUFHLDZCQUFLLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2hDLE1BQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNmLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQzFDLEtBQUssSUFBSSxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQzNGLE9BQUssR0FBRyxLQUFLLENBQ1YsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FDckIsT0FBTyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FDMUIsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FDcEIsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFekIsU0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQzdDIiwiZmlsZSI6ImdlbmVyYXRlLXNpZ25lZC1wYXJhbXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lJztcbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCBkZWZhdWx0cyBmcm9tICdsb2Rhc2guZGVmYXVsdHMnO1xuaW1wb3J0IGtleXMgZnJvbSAnbG9kYXNoLmtleXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzaWduZWRQYXJhbXMgKG1ldGhvZCwgcGF0aCwgaG9zdCwga2V5cywgcGFyYW1zID0ge30pIHtcbiAgcGFyYW1zID0gZGVmYXVsdHMoY2xvbmUocGFyYW1zKSwge1xuICAgIGFjY2Vzc19rZXk6IGtleXMuYWNjZXNzS2V5LFxuICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpXG4gIH0pO1xuICBwYXJhbXMuc2lnbmF0dXJlID0gZ2VuZXJhdGVIbWFjU2lnbmF0dXJlLmNhbGwodGhpcywgbWV0aG9kLCBwYXRoLCBob3N0LCBrZXlzLCBwYXJhbXMpO1xuICByZXR1cm4gcGFyYW1zO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUhtYWNTaWduYXR1cmUgKG1ldGhvZCwgcGF0aCwgaG9zdCwga2V5cywgcGFyYW1zKSB7XG4gIHZhciBwYXJhbXNDb3B5ID0gY2xvbmUocGFyYW1zKTtcbiAgdmFyIHNpZ25hdHVyZURhdGEgPSBtZXRob2QudG9VcHBlckNhc2UoKSArICc7JyArIGhvc3QudG9Mb3dlckNhc2UoKSArXG4gICAgJzsnICsgcGF0aCArICc7JyArIGJ1aWxkU29ydGVkUXVlcnkocGFyYW1zQ29weSk7XG4gIHR5cGVvZiBkZWJ1ZyAhPT0gJ3VuZGVmaW5lZCcgJiYgZGVidWcgJiYgY29uc29sZS5sb2coJ1NpZ25hdHVyZSBkYXRhOiAnICsgc2lnbmF0dXJlRGF0YSk7XG4gIHZhciBobWFjID0gY3J5cHRvLmNyZWF0ZUhtYWMoJ3NoYTI1NicsIGtleXMuc2VjcmV0S2V5LnRvVXBwZXJDYXNlKCkpO1xuICBobWFjLnVwZGF0ZShzaWduYXR1cmVEYXRhKTtcbiAgcmV0dXJuIGhtYWMuZGlnZXN0KCdiYXNlNjQnKTtcbn1cblxuZnVuY3Rpb24gYnVpbGRTb3J0ZWRRdWVyeSAocGFyYW1zKSB7XG4gIC8vIFNvcnRlZCBrZXlzXG4gIHZhciBfa2V5cyA9IGtleXMocGFyYW1zKS5zb3J0KCk7XG4gIHZhciBxdWVyeSA9ICcnO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IF9rZXlzLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICBxdWVyeSArPSBlbmNvZGVVUklDb21wb25lbnQoX2tleXNbaV0pICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtc1tfa2V5c1tpXV0pICsgJyYnO1xuICBxdWVyeSA9IHF1ZXJ5XG4gICAgLnJlcGxhY2UoL1xcKi9nLCAnJTJBJylcbiAgICAucmVwbGFjZSgvWyEnKCldL2csIGVzY2FwZSlcbiAgICAucmVwbGFjZSgvJTdFL2csICd+JylcbiAgICAucmVwbGFjZSgvXFwrL2csICclMjAnKTtcbiAgLy8gU3RyaXAgdGhlIGxhc3Qgc2VwYXJhdG9yIGFuZCByZXR1cm5cbiAgcmV0dXJuIHF1ZXJ5LnN1YnN0cmluZygwLCBxdWVyeS5sZW5ndGggLSAxKTtcbn1cbiJdfQ==
