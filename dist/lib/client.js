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

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

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
  return this.request('DELETE', path, params, callback);
};
/**
 * Get request.
 * @param {String} path
 * @param {Object} params
 * @param {Callback} callback
 */
JScramblerClient.prototype.get = function (path, params, callback) {
  var isJSON = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

  return this.request('GET', path, params, callback, isJSON);
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

  var data,
      settings = {};

  if (!isJSON) {
    settings.responseType = 'arraybuffer';
  }

  var promise;

  if (method === 'GET' || method === 'DELETE') {
    settings.params = signedData;
    promise = _axios2['default'][method.toLowerCase()](formatedUrl, settings);
  } else {
    data = signedData;
    promise = _axios2['default'][method.toLowerCase()](formatedUrl, data, settings);
  }

  return promise.then(function (res) {
    return callback(null, res);
  })['catch'](function (error) {
    return callback(error);
  });
};
/**
 * Post request.
 * @param {String} path
 * @param {Object} params
 * @param {Callback} callback
 */
JScramblerClient.prototype.post = function (path, params, callback) {
  return this.request('POST', path, params, callback);
};

exports = module.exports = JScramblerClient;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7MkJBQWtCLGNBQWM7Ozs7c0JBQ2IsUUFBUTs7Ozs4QkFDTixpQkFBaUI7Ozs7MEJBQ3JCLGFBQWE7Ozs7cUJBQ1YsT0FBTzs7OzttQkFDWCxLQUFLOzs7O3NCQUVMLFVBQVU7Ozs7b0NBQ08sMEJBQTBCOzs7O0FBRTNELElBQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQzs7Ozs7Ozs7Ozs7O0FBWWxDLFNBQVMsZ0JBQWdCLENBQUUsT0FBTyxFQUFFOztBQUVsQyxNQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFBLEFBQUMsRUFBRTtBQUN4RSxXQUFPLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNsQixXQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0FBQzNDLFdBQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7R0FDNUM7O0FBRUQsU0FBTyxDQUFDLElBQUksR0FBRyxpQ0FBUyxPQUFPLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFBRSxvQkFBSSxJQUFJLENBQUMsQ0FBQzs7Ozs7QUFLdEQsTUFBSSxDQUFDLE9BQU8sR0FBRyxpQ0FBUyxPQUFPLElBQUksRUFBRSxzQkFBTSxDQUFDO0NBQzdDOzs7Ozs7O0FBT0QsZ0JBQWdCLENBQUMsU0FBUyxVQUFPLEdBQUcsVUFBVSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRTtBQUNwRSxTQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7Q0FDdkQsQ0FBQzs7Ozs7OztBQU9GLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxHQUFH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QyxDQUFDOzs7Ozs7O0FBT0YsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxVQUFVLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0FBQ2xFLFNBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztDQUNyRCxDQUFDOztBQUVGLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLGdCQUFnQixDQUFDIiwiZmlsZSI6ImNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbG9uZSBmcm9tICdsb2Rhc2guY2xvbmUnO1xuaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJ2xvZGFzaC5kZWZhdWx0cyc7XG5pbXBvcnQga2V5cyBmcm9tICdsb2Rhc2gua2V5cyc7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdheGlvcyc7XG5pbXBvcnQgdXJsIGZyb20gJ3VybCc7XG5cbmltcG9ydCBjZmcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IGdlbmVyYXRlU2lnbmVkUGFyYW1zIGZyb20gJy4vZ2VuZXJhdGUtc2lnbmVkLXBhcmFtcyc7XG5cbmNvbnN0IGRlYnVnID0gISFwcm9jZXNzLmVudi5ERUJVRztcblxuLyoqXG4gKiBAY2xhc3MgSlNjcmFtYmxlckNsaWVudFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmFjY2Vzc0tleVxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuc2VjcmV0S2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuaG9zdD1hcGkuanNjcmFtYmxlci5jb21dXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMucG9ydD00NDNdXG4gKiBAYXV0aG9yIEpvc8OpIE1hZ2FsaMOjZXMgKG1hZ2FsaGFzQGdtYWlsLmNvbSlcbiAqIEBsaWNlbnNlIE1JVCA8aHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVD5cbiAqL1xuZnVuY3Rpb24gSlNjcmFtYmxlckNsaWVudCAob3B0aW9ucykge1xuICAvLyBTbHVnZ2lzaCBoYWNrIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICBpZiAob3B0aW9ucyAmJiAhb3B0aW9ucy5rZXlzICYmIChvcHRpb25zLmFjY2Vzc0tleSB8fCBvcHRpb25zLnNlY3JldEtleSkpIHtcbiAgICBvcHRpb25zLmtleXMgPSB7fTtcbiAgICBvcHRpb25zLmtleXMuYWNjZXNzS2V5ID0gb3B0aW9ucy5hY2Nlc3NLZXk7XG4gICAgb3B0aW9ucy5rZXlzLnNlY3JldEtleSA9IG9wdGlvbnMuc2VjcmV0S2V5O1xuICB9XG5cbiAgb3B0aW9ucy5rZXlzID0gZGVmYXVsdHMob3B0aW9ucy5rZXlzIHx8IHt9LCBjZmcua2V5cyk7XG5cbiAgLyoqXG4gICAqIEBtZW1iZXJcbiAgICovXG4gIHRoaXMub3B0aW9ucyA9IGRlZmF1bHRzKG9wdGlvbnMgfHwge30sIGNmZyk7XG59XG4vKipcbiAqIERlbGV0ZSByZXF1ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAqIEBwYXJhbSB7Q2FsbGJhY2t9IGNhbGxiYWNrXG4gKi9cbkpTY3JhbWJsZXJDbGllbnQucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uIChwYXRoLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIHJldHVybiB0aGlzLnJlcXVlc3QoJ0RFTEVURScsIHBhdGgsIHBhcmFtcywgY2FsbGJhY2spO1xufTtcbi8qKlxuICogR2V0IHJlcXVlc3QuXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICogQHBhcmFtIHtDYWxsYmFja30gY2FsbGJhY2tcbiAqL1xuSlNjcmFtYmxlckNsaWVudC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKHBhdGgsIHBhcmFtcywgY2FsbGJhY2ssIGlzSlNPTiA9IHRydWUpIHtcbiAgcmV0dXJuIHRoaXMucmVxdWVzdCgnR0VUJywgcGF0aCwgcGFyYW1zLCBjYWxsYmFjaywgaXNKU09OKTtcbn07XG4vKipcbiAqIEhUVFAgcmVxdWVzdC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gKiBAcGFyYW0ge0NhbGxiYWNrfSBjYWxsYmFja1xuICovXG5KU2NyYW1ibGVyQ2xpZW50LnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gKG1ldGhvZCwgcGF0aCwgcGFyYW1zID0ge30sIGNhbGxiYWNrID0gbnVsbCwgaXNKU09OID0gdHJ1ZSkge1xuICB2YXIgc2lnbmVkRGF0YTtcblxuICBpZiAodGhpcy50b2tlbikge1xuICAgIHBhcmFtcy50b2tlbiA9IHRoaXMudG9rZW47XG4gIH1cblxuICB2YXIgX2tleXMgPSBrZXlzKHBhcmFtcyk7XG4gIGZvciAodmFyIGkgPSAwLCBsID0gX2tleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgaWYocGFyYW1zW19rZXlzW2ldXSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICBwYXJhbXNbX2tleXNbaV1dID0gcGFyYW1zW19rZXlzW2ldXS5qb2luKCcsJyk7XG4gICAgfVxuICB9XG5cbiAgLy8gSWYgcG9zdCBzaWduIGRhdGEgYW5kIHNldCB0aGUgcmVxdWVzdCBhcyBtdWx0aXBhcnRcbiAgaWYgKHRoaXMub3B0aW9ucy5rZXlzLmFjY2Vzc0tleSAmJiB0aGlzLm9wdGlvbnMua2V5cy5zZWNyZXRLZXkpIHtcbiAgICBzaWduZWREYXRhID0gZ2VuZXJhdGVTaWduZWRQYXJhbXMobWV0aG9kLCBwYXRoLCB0aGlzLm9wdGlvbnMuaG9zdCwgdGhpcy5vcHRpb25zLmtleXMsIHBhcmFtcyk7XG4gIH0gZWxzZSB7XG4gICAgc2lnbmVkRGF0YSA9IHBhcmFtcztcbiAgfVxuXG4gIC8vIEZvcm1hdCBVUkxcbiAgdmFyIHByb3RvY29sID0gdGhpcy5vcHRpb25zLnBvcnQgPT09IDQ0MyA/ICdodHRwcycgOiAnaHR0cCc7XG5cbiAgdmFyIGZvcm1hdGVkVXJsID0gdXJsLmZvcm1hdCh7XG4gICAgaG9zdG5hbWU6IHRoaXMub3B0aW9ucy5ob3N0LFxuICAgIHBvcnQ6IHRoaXMub3B0aW9ucy5wb3J0LFxuICAgIHByb3RvY29sOiBwcm90b2NvbFxuICB9KSArIHBhdGg7XG5cbiAgdmFyIGRhdGEsIHNldHRpbmdzID0ge307XG5cbiAgaWYgKCFpc0pTT04pIHtcbiAgICBzZXR0aW5ncy5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuICB9XG5cbiAgdmFyIHByb21pc2U7XG5cbiAgaWYgKG1ldGhvZCA9PT0gJ0dFVCcgfHwgbWV0aG9kID09PSAnREVMRVRFJykge1xuICAgIHNldHRpbmdzLnBhcmFtcyA9IHNpZ25lZERhdGE7XG4gICAgcHJvbWlzZSA9IHJlcXVlc3RbbWV0aG9kLnRvTG93ZXJDYXNlKCldKGZvcm1hdGVkVXJsLCBzZXR0aW5ncyk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YSA9IHNpZ25lZERhdGE7XG4gICAgcHJvbWlzZSA9IHJlcXVlc3RbbWV0aG9kLnRvTG93ZXJDYXNlKCldKGZvcm1hdGVkVXJsLCBkYXRhLCBzZXR0aW5ncyk7XG4gIH1cblxuICByZXR1cm4gcHJvbWlzZVxuICAgIC50aGVuKChyZXMpID0+IGNhbGxiYWNrKG51bGwsIHJlcykpXG4gICAgLmNhdGNoKChlcnJvcikgPT4gY2FsbGJhY2soZXJyb3IpKTtcbn07XG4vKipcbiAqIFBvc3QgcmVxdWVzdC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gKiBAcGFyYW0ge0NhbGxiYWNrfSBjYWxsYmFja1xuICovXG5KU2NyYW1ibGVyQ2xpZW50LnByb3RvdHlwZS5wb3N0ID0gZnVuY3Rpb24gKHBhdGgsIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgcmV0dXJuIHRoaXMucmVxdWVzdCgnUE9TVCcsIHBhdGgsIHBhcmFtcywgY2FsbGJhY2spO1xufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gSlNjcmFtYmxlckNsaWVudDtcbiJdfQ==
