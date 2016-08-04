'use strict';

var _lodash = require('lodash.clone');

var _lodash2 = _interopRequireDefault(_lodash);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _lodash3 = require('lodash.defaults');

var _lodash4 = _interopRequireDefault(_lodash3);

var _lodash5 = require('lodash.keys');

var _lodash6 = _interopRequireDefault(_lodash5);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _generateSignedParams = require('./generate-signed-params');

var _generateSignedParams2 = _interopRequireDefault(_generateSignedParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

  options.keys = (0, _lodash4.default)(options.keys || {}, _config2.default.keys);

  /**
   * @member
   */
  this.options = (0, _lodash4.default)(options || {}, _config2.default);
}
/**
 * Delete request.
 * @param {String} path
 * @param {Object} params
 * @param {Callback} callback
 */
JScramblerClient.prototype.delete = function (path, params, callback) {
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
  } else {
    if (!this.options.keys.accessKey) {
      throw new Error('Required *accessKey* not provided');
    }

    if (!this.options.keys.secretKey) {
      throw new Error('Required *secretKey* not provided');
    }
  }

  var _keys = (0, _lodash6.default)(params);
  for (var i = 0, l = _keys.length; i < l; i++) {
    if (params[_keys[i]] instanceof Array) {
      params[_keys[i]] = params[_keys[i]].join(',');
    }
  }

  // If post sign data and set the request as multipart
  if (this.options.keys.accessKey && this.options.keys.secretKey) {
    signedData = (0, _generateSignedParams2.default)(method, path, this.options.host, this.options.keys, params);
  } else {
    signedData = params;
  }

  // Format URL
  var protocol = this.options.port === 443 ? 'https' : 'http';

  var formatedUrl = _url2.default.format({
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
    promise = _axios2.default[method.toLowerCase()](formatedUrl, settings);
  } else {
    data = signedData;
    promise = _axios2.default[method.toLowerCase()](formatedUrl, data, settings);
  }

  return promise.then(function (res) {
    return callback(null, res);
  }).catch(function (error) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxRQUFRLENBQUMsQ0FBQyxRQUFRLEdBQVIsQ0FBWSxLQUE1Qjs7QUFFQTs7Ozs7Ozs7OztBQVVBLFNBQVMsZ0JBQVQsQ0FBMkIsT0FBM0IsRUFBb0M7QUFDbEM7QUFDQSxNQUFJLFdBQVcsQ0FBQyxRQUFRLElBQXBCLEtBQTZCLFFBQVEsU0FBUixJQUFxQixRQUFRLFNBQTFELENBQUosRUFBMEU7QUFDeEUsWUFBUSxJQUFSLEdBQWUsRUFBZjtBQUNBLFlBQVEsSUFBUixDQUFhLFNBQWIsR0FBeUIsUUFBUSxTQUFqQztBQUNBLFlBQVEsSUFBUixDQUFhLFNBQWIsR0FBeUIsUUFBUSxTQUFqQztBQUNEOztBQUVELFVBQVEsSUFBUixHQUFlLHNCQUFTLFFBQVEsSUFBUixJQUFnQixFQUF6QixFQUE2QixpQkFBSSxJQUFqQyxDQUFmOztBQUVBOzs7QUFHQSxPQUFLLE9BQUwsR0FBZSxzQkFBUyxXQUFXLEVBQXBCLG1CQUFmO0FBQ0Q7QUFDRDs7Ozs7O0FBTUEsaUJBQWlCLFNBQWpCLENBQTJCLE1BQTNCLEdBQW9DLFVBQVUsSUFBVixFQUFnQixNQUFoQixFQUF3QixRQUF4QixFQUFrQztBQUNwRSxTQUFPLEtBQUssT0FBTCxDQUFhLFFBQWIsRUFBdUIsSUFBdkIsRUFBNkIsTUFBN0IsRUFBcUMsUUFBckMsQ0FBUDtBQUNELENBRkQ7QUFHQTs7Ozs7O0FBTUEsaUJBQWlCLFNBQWpCLENBQTJCLEdBQTNCLEdBQWlDLFVBQVUsSUFBVixFQUFnQixNQUFoQixFQUF3QixRQUF4QixFQUFpRDtBQUFBLE1BQWYsTUFBZSx5REFBTixJQUFNOztBQUNoRixTQUFPLEtBQUssT0FBTCxDQUFhLEtBQWIsRUFBb0IsSUFBcEIsRUFBMEIsTUFBMUIsRUFB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RUFBcUIsSUFBckIsRUFBMkIsTUFBM0IsRUFBbUMsUUFBbkMsQ0FBUDtBQUNELENBRkQ7O0FBSUEsVUFBVSxPQUFPLE9BQVAsR0FBaUIsZ0JBQTNCIiwiZmlsZSI6ImNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbG9uZSBmcm9tICdsb2Rhc2guY2xvbmUnO1xuaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJ2xvZGFzaC5kZWZhdWx0cyc7XG5pbXBvcnQga2V5cyBmcm9tICdsb2Rhc2gua2V5cyc7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdheGlvcyc7XG5pbXBvcnQgdXJsIGZyb20gJ3VybCc7XG5cbmltcG9ydCBjZmcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IGdlbmVyYXRlU2lnbmVkUGFyYW1zIGZyb20gJy4vZ2VuZXJhdGUtc2lnbmVkLXBhcmFtcyc7XG5cbmNvbnN0IGRlYnVnID0gISFwcm9jZXNzLmVudi5ERUJVRztcblxuLyoqXG4gKiBAY2xhc3MgSlNjcmFtYmxlckNsaWVudFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmFjY2Vzc0tleVxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuc2VjcmV0S2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuaG9zdD1hcGkuanNjcmFtYmxlci5jb21dXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMucG9ydD00NDNdXG4gKiBAYXV0aG9yIEpvc8OpIE1hZ2FsaMOjZXMgKG1hZ2FsaGFzQGdtYWlsLmNvbSlcbiAqIEBsaWNlbnNlIE1JVCA8aHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVD5cbiAqL1xuZnVuY3Rpb24gSlNjcmFtYmxlckNsaWVudCAob3B0aW9ucykge1xuICAvLyBTbHVnZ2lzaCBoYWNrIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxuICBpZiAob3B0aW9ucyAmJiAhb3B0aW9ucy5rZXlzICYmIChvcHRpb25zLmFjY2Vzc0tleSB8fCBvcHRpb25zLnNlY3JldEtleSkpIHtcbiAgICBvcHRpb25zLmtleXMgPSB7fTtcbiAgICBvcHRpb25zLmtleXMuYWNjZXNzS2V5ID0gb3B0aW9ucy5hY2Nlc3NLZXk7XG4gICAgb3B0aW9ucy5rZXlzLnNlY3JldEtleSA9IG9wdGlvbnMuc2VjcmV0S2V5O1xuICB9XG5cbiAgb3B0aW9ucy5rZXlzID0gZGVmYXVsdHMob3B0aW9ucy5rZXlzIHx8IHt9LCBjZmcua2V5cyk7XG5cbiAgLyoqXG4gICAqIEBtZW1iZXJcbiAgICovXG4gIHRoaXMub3B0aW9ucyA9IGRlZmF1bHRzKG9wdGlvbnMgfHwge30sIGNmZyk7XG59XG4vKipcbiAqIERlbGV0ZSByZXF1ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAqIEBwYXJhbSB7Q2FsbGJhY2t9IGNhbGxiYWNrXG4gKi9cbkpTY3JhbWJsZXJDbGllbnQucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uIChwYXRoLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIHJldHVybiB0aGlzLnJlcXVlc3QoJ0RFTEVURScsIHBhdGgsIHBhcmFtcywgY2FsbGJhY2spO1xufTtcbi8qKlxuICogR2V0IHJlcXVlc3QuXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICogQHBhcmFtIHtDYWxsYmFja30gY2FsbGJhY2tcbiAqL1xuSlNjcmFtYmxlckNsaWVudC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKHBhdGgsIHBhcmFtcywgY2FsbGJhY2ssIGlzSlNPTiA9IHRydWUpIHtcbiAgcmV0dXJuIHRoaXMucmVxdWVzdCgnR0VUJywgcGF0aCwgcGFyYW1zLCBjYWxsYmFjaywgaXNKU09OKTtcbn07XG4vKipcbiAqIEhUVFAgcmVxdWVzdC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gKiBAcGFyYW0ge0NhbGxiYWNrfSBjYWxsYmFja1xuICovXG5KU2NyYW1ibGVyQ2xpZW50LnByb3RvdHlwZS5yZXF1ZXN0ID0gZnVuY3Rpb24gKG1ldGhvZCwgcGF0aCwgcGFyYW1zID0ge30sIGNhbGxiYWNrID0gbnVsbCwgaXNKU09OID0gdHJ1ZSkge1xuICB2YXIgc2lnbmVkRGF0YTtcblxuICBpZiAodGhpcy50b2tlbikge1xuICAgIHBhcmFtcy50b2tlbiA9IHRoaXMudG9rZW47XG4gIH0gZWxzZSB7XG4gICAgaWYgKCF0aGlzLm9wdGlvbnMua2V5cy5hY2Nlc3NLZXkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVxdWlyZWQgKmFjY2Vzc0tleSogbm90IHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMua2V5cy5zZWNyZXRLZXkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUmVxdWlyZWQgKnNlY3JldEtleSogbm90IHByb3ZpZGVkJyk7XG4gICAgfVxuICB9XG5cbiAgdmFyIF9rZXlzID0ga2V5cyhwYXJhbXMpO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IF9rZXlzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgIGlmKHBhcmFtc1tfa2V5c1tpXV0gaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgcGFyYW1zW19rZXlzW2ldXSA9IHBhcmFtc1tfa2V5c1tpXV0uam9pbignLCcpO1xuICAgIH1cbiAgfVxuXG4gIC8vIElmIHBvc3Qgc2lnbiBkYXRhIGFuZCBzZXQgdGhlIHJlcXVlc3QgYXMgbXVsdGlwYXJ0XG4gIGlmICh0aGlzLm9wdGlvbnMua2V5cy5hY2Nlc3NLZXkgJiYgdGhpcy5vcHRpb25zLmtleXMuc2VjcmV0S2V5KSB7XG4gICAgc2lnbmVkRGF0YSA9IGdlbmVyYXRlU2lnbmVkUGFyYW1zKG1ldGhvZCwgcGF0aCwgdGhpcy5vcHRpb25zLmhvc3QsIHRoaXMub3B0aW9ucy5rZXlzLCBwYXJhbXMpO1xuICB9IGVsc2Uge1xuICAgIHNpZ25lZERhdGEgPSBwYXJhbXM7XG4gIH1cblxuICAvLyBGb3JtYXQgVVJMXG4gIHZhciBwcm90b2NvbCA9IHRoaXMub3B0aW9ucy5wb3J0ID09PSA0NDMgPyAnaHR0cHMnIDogJ2h0dHAnO1xuXG4gIHZhciBmb3JtYXRlZFVybCA9IHVybC5mb3JtYXQoe1xuICAgIGhvc3RuYW1lOiB0aGlzLm9wdGlvbnMuaG9zdCxcbiAgICBwb3J0OiB0aGlzLm9wdGlvbnMucG9ydCxcbiAgICBwcm90b2NvbDogcHJvdG9jb2xcbiAgfSkgKyBwYXRoO1xuXG4gIHZhciBkYXRhLCBzZXR0aW5ncyA9IHt9O1xuXG4gIGlmICghaXNKU09OKSB7XG4gICAgc2V0dGluZ3MucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcbiAgfVxuXG4gIHZhciBwcm9taXNlO1xuXG4gIGlmIChtZXRob2QgPT09ICdHRVQnIHx8IG1ldGhvZCA9PT0gJ0RFTEVURScpIHtcbiAgICBzZXR0aW5ncy5wYXJhbXMgPSBzaWduZWREYXRhO1xuICAgIHByb21pc2UgPSByZXF1ZXN0W21ldGhvZC50b0xvd2VyQ2FzZSgpXShmb3JtYXRlZFVybCwgc2V0dGluZ3MpO1xuICB9IGVsc2Uge1xuICAgIGRhdGEgPSBzaWduZWREYXRhO1xuICAgIHByb21pc2UgPSByZXF1ZXN0W21ldGhvZC50b0xvd2VyQ2FzZSgpXShmb3JtYXRlZFVybCwgZGF0YSwgc2V0dGluZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHByb21pc2VcbiAgICAudGhlbigocmVzKSA9PiBjYWxsYmFjayhudWxsLCByZXMpKVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IGNhbGxiYWNrKGVycm9yKSk7XG59O1xuLyoqXG4gKiBQb3N0IHJlcXVlc3QuXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICogQHBhcmFtIHtDYWxsYmFja30gY2FsbGJhY2tcbiAqL1xuSlNjcmFtYmxlckNsaWVudC5wcm90b3R5cGUucG9zdCA9IGZ1bmN0aW9uIChwYXRoLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIHJldHVybiB0aGlzLnJlcXVlc3QoJ1BPU1QnLCBwYXRoLCBwYXJhbXMsIGNhbGxiYWNrKTtcbn07XG5cbmV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IEpTY3JhbWJsZXJDbGllbnQ7XG4iXX0=
