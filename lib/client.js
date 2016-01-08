'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashClone = require('lodash.clone');

var _lodashClone2 = _interopRequireDefault(_lodashClone);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _lodashDefaults = require('lodash.defaults');

var _lodashDefaults2 = _interopRequireDefault(_lodashDefaults);

var _lodashKeys = require('lodash.keys');

var _lodashKeys2 = _interopRequireDefault(_lodashKeys);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _generateSignedParams = require('./generate-signed-params');

var _generateSignedParams2 = _interopRequireDefault(_generateSignedParams);

//import fs from 'fs';

var debug = !!process.env.DEBUG;

/**
 * @class JScramblerClient
 * @param {Object} options
 * @param {String} options.accessKey
 * @param {String} options.secretKey
 * @param {String} [options.host=api.jscrambler.com]
 * @param {String} [options.port=443]
 * @param {String} [options.apiVersion=3]
 * @author José Magalhães (magalhas@gmail.com)
 * @license MIT <http://opensource.org/licenses/MIT>
 */
function JScramblerClient(options) {
  // Sluggish hack for backwards compatibility
  if (options && !options.keys && (options.accessKey || options.secretKey)) {
    options.keys = {};
    options.keys.accessKey = options.accessKey;
    options.keys.secretKey = options.secretKey;
  }

  options.keys = (0, _lodashDefaults2['default'])(options.keys || {}, _config2['default'].keys);

  /**
   * @member
   */
  this.options = (0, _lodashDefaults2['default'])(options || {}, _config2['default']);
  if (!this.options.keys.accessKey || !this.options.keys.secretKey) throw new Error('Missing access or secret keys');
}
/**
 * Delete request.
 * @param {String} path
 * @param {Object} params
 * @param {Callback} callback
 */
JScramblerClient.prototype['delete'] = function (path, params, callback) {
  this.request('DELETE', path, params, callback);
};
/**
 * Get request.
 * @param {String} path
 * @param {Object} params
 * @param {Callback} callback
 */
JScramblerClient.prototype.get = function (path, params, callback) {
  this.request('GET', path, params, callback);
};
/**
 * HTTP request.
 * @param {String} method
 * @param {String} path
 * @param {Object} params
 * @param {Callback} callback
 */
JScramblerClient.prototype.request = function (method, path) {
  var params = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var callback = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

  var signedData;

  if (this.token) {
    params.token = this.token;
  }

  var _keys = (0, _lodashKeys2['default'])(params);
  for (var i = 0, l = _keys.length; i < l; i++) {
    if (params[_keys[i]] instanceof Array) {
      params[_keys[i]] = params[_keys[i]].join(',');
    }
  }

  // If post sign data and set the request as multipart
  signedData = (0, _generateSignedParams2['default'])(method, path, this.options.host, this.options.keys, params);

  // Format URL
  var protocol = this.options.port === 443 ? 'https' : 'http';

  var formatedUrl = _url2['default'].format({
    hostname: this.options.host,
    port: this.options.port,
    protocol: protocol
  }) + path;

  var req = _superagent2['default'][method.toLowerCase()](formatedUrl).type('json');

  if (method === 'POST' || method === 'PUT') {
    req.send(signedData);
  } else {
    req.query(signedData);
  }

  req.end(callback);
};
/**
 * Post request.
 * @param {String} path
 * @param {Object} params
 * @param {Callback} callback
 */
JScramblerClient.prototype.post = function (path, params, callback) {
  this.request('POST', path, params, callback);
};

exports = module.exports = JScramblerClient;
//# sourceMappingURL=data:application/json;base64,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LE1BQU0sQ0FBQyxDQUFDOzs7QUFHOUYsTUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssR0FBRyxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUM7O0FBRTVELE1BQUksV0FBVyxHQUFHLGlCQUFJLE1BQU0sQ0FBQztBQUMzQixZQUFRLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJO0FBQzNCLFFBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUk7QUFDdkIsWUFBUSxFQUFFLFFBQVE7R0FDbkIsQ0FBQyxHQUFHLElBQUksQ0FBQzs7QUFFVixNQUFNLEdBQUcsR0FBRyx3QkFBUSxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXBFLE1BQUksTUFBTSxLQUFLLE1BQU0sSUFBSSxNQUFNLEtBQUssS0FBSyxFQUFFO0FBQ3pDLE9BQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDdEIsTUFBTTtBQUNMLE9BQUcsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDdkI7O0FBRUQsS0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztDQUNuQixDQUFDOzs7Ozs7O0FBT0YsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxVQUFVLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0FBQ2xFLE1BQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7Q0FDOUMsQ0FBQzs7QUFFRixPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJjbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lJztcbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCBkZWZhdWx0cyBmcm9tICdsb2Rhc2guZGVmYXVsdHMnO1xuaW1wb3J0IGtleXMgZnJvbSAnbG9kYXNoLmtleXMnO1xuaW1wb3J0IHJlcXVlc3QgZnJvbSAnc3VwZXJhZ2VudCc7XG5pbXBvcnQgdXJsIGZyb20gJ3VybCc7XG5cbmltcG9ydCBjZmcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IGdlbmVyYXRlU2lnbmVkUGFyYW1zIGZyb20gJy4vZ2VuZXJhdGUtc2lnbmVkLXBhcmFtcyc7XG5cbi8vaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxuY29uc3QgZGVidWcgPSAhIXByb2Nlc3MuZW52LkRFQlVHO1xuXG4vKipcbiAqIEBjbGFzcyBKU2NyYW1ibGVyQ2xpZW50XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuYWNjZXNzS2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5zZWNyZXRLZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5ob3N0PWFwaS5qc2NyYW1ibGVyLmNvbV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5wb3J0PTQ0M11cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5hcGlWZXJzaW9uPTNdXG4gKiBAYXV0aG9yIEpvc8OpIE1hZ2FsaMOjZXMgKG1hZ2FsaGFzQGdtYWlsLmNvbSlcbiAqIEBsaWNlbnNlIE1JVCA8aHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVD5cbiAqL1xuZnVuY3Rpb24gSlNjcmFtYmxlckNsaWVudCAob3B0aW9ucykge1xuICAvLyBTbHVnZ2lzaCBoYWNrIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICBpZiAob3B0aW9ucyAmJiAhb3B0aW9ucy5rZXlzICYmIChvcHRpb25zLmFjY2Vzc0tleSB8fCBvcHRpb25zLnNlY3JldEtleSkpIHtcbiAgICBvcHRpb25zLmtleXMgPSB7fTtcbiAgICBvcHRpb25zLmtleXMuYWNjZXNzS2V5ID0gb3B0aW9ucy5hY2Nlc3NLZXk7XG4gICAgb3B0aW9ucy5rZXlzLnNlY3JldEtleSA9IG9wdGlvbnMuc2VjcmV0S2V5O1xuICB9XG5cbiAgb3B0aW9ucy5rZXlzID0gZGVmYXVsdHMob3B0aW9ucy5rZXlzIHx8IHt9LCBjZmcua2V5cyk7XG5cbiAgLyoqXG4gICAqIEBtZW1iZXJcbiAgICovXG4gIHRoaXMub3B0aW9ucyA9IGRlZmF1bHRzKG9wdGlvbnMgfHwge30sIGNmZyk7XG4gIGlmICghdGhpcy5vcHRpb25zLmtleXMuYWNjZXNzS2V5IHx8ICF0aGlzLm9wdGlvbnMua2V5cy5zZWNyZXRLZXkpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGFjY2VzcyBvciBzZWNyZXQga2V5cycpO1xufVxuLyoqXG4gKiBEZWxldGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gKiBAcGFyYW0ge0NhbGxiYWNrfSBjYWxsYmFja1xuICovXG5KU2NyYW1ibGVyQ2xpZW50LnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAocGF0aCwgcGFyYW1zLCBjYWxsYmFjaykge1xuICB0aGlzLnJlcXVlc3QoJ0RFTEVURScsIHBhdGgsIHBhcmFtcywgY2FsbGJhY2spO1xufTtcbi8qKlxuICogR2V0IHJlcXVlc3QuXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICogQHBhcmFtIHtDYWxsYmFja30gY2FsbGJhY2tcbiAqL1xuSlNjcmFtYmxlckNsaWVudC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKHBhdGgsIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgdGhpcy5yZXF1ZXN0KCdHRVQnLCBwYXRoLCBwYXJhbXMsIGNhbGxiYWNrKTtcbn07XG4vKipcbiAqIEhUVFAgcmVxdWVzdC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gKiBAcGFyYW0ge0NhbGxiYWNrfSBjYWxsYmFja1xuICovXG5KU2NyYW1ibGVyQ2xpZW50LnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gKG1ldGhvZCwgcGF0aCwgcGFyYW1zID0ge30sIGNhbGxiYWNrID0gbnVsbCkge1xuICB2YXIgc2lnbmVkRGF0YTtcblxuICBpZiAodGhpcy50b2tlbikge1xuICAgIHBhcmFtcy50b2tlbiA9IHRoaXMudG9rZW47XG4gIH1cblxuICB2YXIgX2tleXMgPSBrZXlzKHBhcmFtcyk7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gX2tleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYocGFyYW1zW19rZXlzW2ldXSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBwYXJhbXNbX2tleXNbaV1dID0gcGFyYW1zW19rZXlzW2ldXS5qb2luKCcsJyk7XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgcG9zdCBzaWduIGRhdGEgYW5kIHNldCB0aGUgcmVxdWVzdCBhcyBtdWx0aXBhcnRcbiAgc2lnbmVkRGF0YSA9IGdlbmVyYXRlU2lnbmVkUGFyYW1zKG1ldGhvZCwgcGF0aCwgdGhpcy5vcHRpb25zLmhvc3QsIHRoaXMub3B0aW9ucy5rZXlzLCBwYXJhbXMpO1xuXG4gIC8vIEZvcm1hdCBVUkxcbiAgdmFyIHByb3RvY29sID0gdGhpcy5vcHRpb25zLnBvcnQgPT09IDQ0MyA/ICdodHRwcycgOiAnaHR0cCc7XG5cbiAgdmFyIGZvcm1hdGVkVXJsID0gdXJsLmZvcm1hdCh7XG4gICAgaG9zdG5hbWU6IHRoaXMub3B0aW9ucy5ob3N0LFxuICAgIHBvcnQ6IHRoaXMub3B0aW9ucy5wb3J0LFxuICAgIHByb3RvY29sOiBwcm90b2NvbFxuICB9KSArIHBhdGg7XG5cbiAgY29uc3QgcmVxID0gcmVxdWVzdFttZXRob2QudG9Mb3dlckNhc2UoKV0oZm9ybWF0ZWRVcmwpLnR5cGUoJ2pzb24nKTtcblxuICBpZiAobWV0aG9kID09PSAnUE9TVCcgfHwgbWV0aG9kID09PSAnUFVUJykge1xuICAgIHJlcS5zZW5kKHNpZ25lZERhdGEpO1xuICB9IGVsc2Uge1xuICAgIHJlcS5xdWVyeShzaWduZWREYXRhKTtcbiAgfVxuXG4gIHJlcS5lbmQoY2FsbGJhY2spO1xufTtcbi8qKlxuICogUG9zdCByZXF1ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAqIEBwYXJhbSB7Q2FsbGJhY2t9IGNhbGxiYWNrXG4gKi9cbkpTY3JhbWJsZXJDbGllbnQucHJvdG90eXBlLnBvc3QgPSBmdW5jdGlvbiAocGF0aCwgcGFyYW1zLCBjYWxsYmFjaykge1xuICB0aGlzLnJlcXVlc3QoJ1BPU1QnLCBwYXRoLCBwYXJhbXMsIGNhbGxiYWNrKTtcbn07XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IEpTY3JhbWJsZXJDbGllbnQ7XG4iXX0=
