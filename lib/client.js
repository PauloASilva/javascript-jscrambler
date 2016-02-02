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

var debug = !!process.env.DEBUG;

/**
 * @class JScramblerClient
 * @param {Object} options
 * @param {String} options.accessKey
 * @param {String} options.secretKey
 * @param {String} [options.host=api.jscrambler.com]
 * @param {String} [options.port=443]
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
  var isJSON = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

  this.request('GET', path, params, callback, isJSON);
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
  var isJSON = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];

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
  if (this.options.keys.accessKey && this.options.keys.secretKey) {
    signedData = (0, _generateSignedParams2['default'])(method, path, this.options.host, this.options.keys, params);
  } else {
    signedData = params;
  }

  // Format URL
  var protocol = this.options.port === 443 ? 'https' : 'http';

  var formatedUrl = _url2['default'].format({
    hostname: this.options.host,
    port: this.options.port,
    protocol: protocol
  }) + path;

  var req = _superagent2['default'][method.toLowerCase()](formatedUrl);

  if (isJSON) {
    req.type('json');
  } else {
    req.buffer(true);
  }

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
//# sourceMappingURL=data:application/json;base64,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QUFnQixDQUFDIiwiZmlsZSI6ImNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbG9uZSBmcm9tICdsb2Rhc2guY2xvbmUnO1xuaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJ2xvZGFzaC5kZWZhdWx0cyc7XG5pbXBvcnQga2V5cyBmcm9tICdsb2Rhc2gua2V5cyc7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdzdXBlcmFnZW50JztcbmltcG9ydCB1cmwgZnJvbSAndXJsJztcblxuaW1wb3J0IGNmZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgZ2VuZXJhdGVTaWduZWRQYXJhbXMgZnJvbSAnLi9nZW5lcmF0ZS1zaWduZWQtcGFyYW1zJztcblxuY29uc3QgZGVidWcgPSAhIXByb2Nlc3MuZW52LkRFQlVHO1xuXG4vKipcbiAqIEBjbGFzcyBKU2NyYW1ibGVyQ2xpZW50XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuYWNjZXNzS2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5zZWNyZXRLZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5ob3N0PWFwaS5qc2NyYW1ibGVyLmNvbV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5wb3J0PTQ0M11cbiAqIEBhdXRob3IgSm9zw6kgTWFnYWxow6NlcyAobWFnYWxoYXNAZ21haWwuY29tKVxuICogQGxpY2Vuc2UgTUlUIDxodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUPlxuICovXG5mdW5jdGlvbiBKU2NyYW1ibGVyQ2xpZW50IChvcHRpb25zKSB7XG4gIC8vIFNsdWdnaXNoIGhhY2sgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gIGlmIChvcHRpb25zICYmICFvcHRpb25zLmtleXMgJiYgKG9wdGlvbnMuYWNjZXNzS2V5IHx8IG9wdGlvbnMuc2VjcmV0S2V5KSkge1xuICAgIG9wdGlvbnMua2V5cyA9IHt9O1xuICAgIG9wdGlvbnMua2V5cy5hY2Nlc3NLZXkgPSBvcHRpb25zLmFjY2Vzc0tleTtcbiAgICBvcHRpb25zLmtleXMuc2VjcmV0S2V5ID0gb3B0aW9ucy5zZWNyZXRLZXk7XG4gIH1cblxuICBvcHRpb25zLmtleXMgPSBkZWZhdWx0cyhvcHRpb25zLmtleXMgfHwge30sIGNmZy5rZXlzKTtcblxuICAvKipcbiAgICogQG1lbWJlclxuICAgKi9cbiAgdGhpcy5vcHRpb25zID0gZGVmYXVsdHMob3B0aW9ucyB8fCB7fSwgY2ZnKTtcbn1cbi8qKlxuICogRGVsZXRlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICogQHBhcmFtIHtDYWxsYmFja30gY2FsbGJhY2tcbiAqL1xuSlNjcmFtYmxlckNsaWVudC5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKHBhdGgsIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgdGhpcy5yZXF1ZXN0KCdERUxFVEUnLCBwYXRoLCBwYXJhbXMsIGNhbGxiYWNrKTtcbn07XG4vKipcbiAqIEdldCByZXF1ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAqIEBwYXJhbSB7Q2FsbGJhY2t9IGNhbGxiYWNrXG4gKi9cbkpTY3JhbWJsZXJDbGllbnQucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChwYXRoLCBwYXJhbXMsIGNhbGxiYWNrLCBpc0pTT04gPSB0cnVlKSB7XG4gIHRoaXMucmVxdWVzdCgnR0VUJywgcGF0aCwgcGFyYW1zLCBjYWxsYmFjaywgaXNKU09OKTtcbn07XG4vKipcbiAqIEhUVFAgcmVxdWVzdC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gKiBAcGFyYW0ge0NhbGxiYWNrfSBjYWxsYmFja1xuICovXG5KU2NyYW1ibGVyQ2xpZW50LnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gKG1ldGhvZCwgcGF0aCwgcGFyYW1zID0ge30sIGNhbGxiYWNrID0gbnVsbCwgaXNKU09OID0gdHJ1ZSkge1xuICB2YXIgc2lnbmVkRGF0YTtcblxuICBpZiAodGhpcy50b2tlbikge1xuICAgIHBhcmFtcy50b2tlbiA9IHRoaXMudG9rZW47XG4gIH1cblxuICB2YXIgX2tleXMgPSBrZXlzKHBhcmFtcyk7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gX2tleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYocGFyYW1zW19rZXlzW2ldXSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBwYXJhbXNbX2tleXNbaV1dID0gcGFyYW1zW19rZXlzW2ldXS5qb2luKCcsJyk7XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgcG9zdCBzaWduIGRhdGEgYW5kIHNldCB0aGUgcmVxdWVzdCBhcyBtdWx0aXBhcnRcbiAgaWYgKHRoaXMub3B0aW9ucy5rZXlzLmFjY2Vzc0tleSAmJiB0aGlzLm9wdGlvbnMua2V5cy5zZWNyZXRLZXkpIHtcbiAgICBzaWduZWREYXRhID0gZ2VuZXJhdGVTaWduZWRQYXJhbXMobWV0aG9kLCBwYXRoLCB0aGlzLm9wdGlvbnMuaG9zdCwgdGhpcy5vcHRpb25zLmtleXMsIHBhcmFtcyk7XG4gIH0gZWxzZSB7XG4gICAgc2lnbmVkRGF0YSA9IHBhcmFtcztcbiAgfVxuXG4gIC8vIEZvcm1hdCBVUkxcbiAgdmFyIHByb3RvY29sID0gdGhpcy5vcHRpb25zLnBvcnQgPT09IDQ0MyA/ICdodHRwcycgOiAnaHR0cCc7XG5cbiAgdmFyIGZvcm1hdGVkVXJsID0gdXJsLmZvcm1hdCh7XG4gICAgaG9zdG5hbWU6IHRoaXMub3B0aW9ucy5ob3N0LFxuICAgIHBvcnQ6IHRoaXMub3B0aW9ucy5wb3J0LFxuICAgIHByb3RvY29sOiBwcm90b2NvbFxuICB9KSArIHBhdGg7XG5cbiAgY29uc3QgcmVxID0gcmVxdWVzdFttZXRob2QudG9Mb3dlckNhc2UoKV0oZm9ybWF0ZWRVcmwpO1xuXG4gIGlmIChpc0pTT04pIHtcbiAgICByZXEudHlwZSgnanNvbicpO1xuICB9IGVsc2Uge1xuICAgIHJlcS5idWZmZXIodHJ1ZSk7XG4gIH1cblxuICBpZiAobWV0aG9kID09PSAnUE9TVCcgfHwgbWV0aG9kID09PSAnUFVUJykge1xuICAgIHJlcS5zZW5kKHNpZ25lZERhdGEpO1xuICB9IGVsc2Uge1xuICAgIHJlcS5xdWVyeShzaWduZWREYXRhKTtcbiAgfVxuXG4gIHJlcS5lbmQoY2FsbGJhY2spO1xufTtcbi8qKlxuICogUG9zdCByZXF1ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAqIEBwYXJhbSB7Q2FsbGJhY2t9IGNhbGxiYWNrXG4gKi9cbkpTY3JhbWJsZXJDbGllbnQucHJvdG90eXBlLnBvc3QgPSBmdW5jdGlvbiAocGF0aCwgcGFyYW1zLCBjYWxsYmFjaykge1xuICB0aGlzLnJlcXVlc3QoJ1BPU1QnLCBwYXRoLCBwYXJhbXMsIGNhbGxiYWNrKTtcbn07XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IEpTY3JhbWJsZXJDbGllbnQ7XG4iXX0=
