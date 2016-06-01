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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxRQUFRLENBQUMsQ0FBQyxRQUFRLEdBQVIsQ0FBWSxLQUE1Qjs7Ozs7Ozs7Ozs7O0FBWUEsU0FBUyxnQkFBVCxDQUEyQixPQUEzQixFQUFvQzs7QUFFbEMsTUFBSSxXQUFXLENBQUMsUUFBUSxJQUFwQixLQUE2QixRQUFRLFNBQVIsSUFBcUIsUUFBUSxTQUExRCxDQUFKLEVBQTBFO0FBQ3hFLFlBQVEsSUFBUixHQUFlLEVBQWY7QUFDQSxZQUFRLElBQVIsQ0FBYSxTQUFiLEdBQXlCLFFBQVEsU0FBakM7QUFDQSxZQUFRLElBQVIsQ0FBYSxTQUFiLEdBQXlCLFFBQVEsU0FBakM7QUFDRDs7QUFFRCxVQUFRLElBQVIsR0FBZSxzQkFBUyxRQUFRLElBQVIsSUFBZ0IsRUFBekIsRUFBNkIsaUJBQUksSUFBakMsQ0FBZjs7Ozs7QUFLQSxPQUFLLE9BQUwsR0FBZSxzQkFBUyxXQUFXLEVBQXBCLG1CQUFmO0FBQ0Q7Ozs7Ozs7QUFPRCxpQkFBaUIsU0FBakIsQ0FBMkIsTUFBM0IsR0FBb0MsVUFBVSxJQUFWLEVBQWdCLE1BQWhCLEVBQXdCLFFBQXhCLEVBQWtDO0FBQ3BFLFNBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixFQUF1QixJQUF2QixFQUE2QixNQUE3QixFQUFxQyxRQUFyQyxDQUFQO0FBQ0QsQ0FGRDs7Ozs7OztBQVNBLGlCQUFpQixTQUFqQixDQUEyQixHQUEzQixHQUFpQyxVQUFVLElBQVYsRUFBZ0IsTUFBaEIsRUFBd0IsUUFBeEIsRUFBaUQ7QUFBQSxNQUFmLE1BQWUseURBQU4sSUFBTTs7QUFDaEYsU0FBTyxLQUFLLE9BQUwsQ0FBYSxLQUFiLEVBQW9CLElBQXBCLEVBQTBCLE1BQTFCLEVBQWtDLFFBQWxDLEVBQTRDLE1BQTVDLENBQVA7QUFDRCxDQUZEOzs7Ozs7OztBQVVBLGlCQUFpQixTQUFqQixDQUEyQixPQUEzQixHQUFxQyxVQUFVLE1BQVYsRUFBa0IsSUFBbEIsRUFBcUU7QUFBQSxNQUE3QyxNQUE2Qyx5REFBcEMsRUFBb0M7QUFBQSxNQUFoQyxRQUFnQyx5REFBckIsSUFBcUI7QUFBQSxNQUFmLE1BQWUseURBQU4sSUFBTTs7QUFDeEcsTUFBSSxVQUFKOztBQUVBLE1BQUksS0FBSyxLQUFULEVBQWdCO0FBQ2QsV0FBTyxLQUFQLEdBQWUsS0FBSyxLQUFwQjtBQUNEOztBQUVELE1BQUksUUFBUSxzQkFBSyxNQUFMLENBQVo7QUFDQSxPQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsSUFBSSxNQUFNLE1BQTFCLEVBQWtDLElBQUksQ0FBdEMsRUFBeUMsR0FBekMsRUFBOEM7QUFDNUMsUUFBRyxPQUFPLE1BQU0sQ0FBTixDQUFQLGFBQTRCLEtBQS9CLEVBQXNDO0FBQ3BDLGFBQU8sTUFBTSxDQUFOLENBQVAsSUFBbUIsT0FBTyxNQUFNLENBQU4sQ0FBUCxFQUFpQixJQUFqQixDQUFzQixHQUF0QixDQUFuQjtBQUNEO0FBQ0Y7OztBQUdELE1BQUksS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQixTQUFsQixJQUErQixLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLFNBQXJELEVBQWdFO0FBQzlELGlCQUFhLG9DQUFxQixNQUFyQixFQUE2QixJQUE3QixFQUFtQyxLQUFLLE9BQUwsQ0FBYSxJQUFoRCxFQUFzRCxLQUFLLE9BQUwsQ0FBYSxJQUFuRSxFQUF5RSxNQUF6RSxDQUFiO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsaUJBQWEsTUFBYjtBQUNEOzs7QUFHRCxNQUFJLFdBQVcsS0FBSyxPQUFMLENBQWEsSUFBYixLQUFzQixHQUF0QixHQUE0QixPQUE1QixHQUFzQyxNQUFyRDs7QUFFQSxNQUFJLGNBQWMsY0FBSSxNQUFKLENBQVc7QUFDM0IsY0FBVSxLQUFLLE9BQUwsQ0FBYSxJQURJO0FBRTNCLFVBQU0sS0FBSyxPQUFMLENBQWEsSUFGUTtBQUczQixjQUFVO0FBSGlCLEdBQVgsSUFJYixJQUpMOztBQU1BLE1BQUksSUFBSjtNQUFVLFdBQVcsRUFBckI7O0FBRUEsTUFBSSxDQUFDLE1BQUwsRUFBYTtBQUNYLGFBQVMsWUFBVCxHQUF3QixhQUF4QjtBQUNEOztBQUVELE1BQUksT0FBSjs7QUFFQSxNQUFJLFdBQVcsS0FBWCxJQUFvQixXQUFXLFFBQW5DLEVBQTZDO0FBQzNDLGFBQVMsTUFBVCxHQUFrQixVQUFsQjtBQUNBLGNBQVUsZ0JBQVEsT0FBTyxXQUFQLEVBQVIsRUFBOEIsV0FBOUIsRUFBMkMsUUFBM0MsQ0FBVjtBQUNELEdBSEQsTUFHTztBQUNMLFdBQU8sVUFBUDtBQUNBLGNBQVUsZ0JBQVEsT0FBTyxXQUFQLEVBQVIsRUFBOEIsV0FBOUIsRUFBMkMsSUFBM0MsRUFBaUQsUUFBakQsQ0FBVjtBQUNEOztBQUVELFNBQU8sUUFDSixJQURJLENBQ0MsVUFBQyxHQUFEO0FBQUEsV0FBUyxTQUFTLElBQVQsRUFBZSxHQUFmLENBQVQ7QUFBQSxHQURELEVBRUosS0FGSSxDQUVFLFVBQUMsS0FBRDtBQUFBLFdBQVcsU0FBUyxLQUFULENBQVg7QUFBQSxHQUZGLENBQVA7QUFHRCxDQWpERDs7Ozs7OztBQXdEQSxpQkFBaUIsU0FBakIsQ0FBMkIsSUFBM0IsR0FBa0MsVUFBVSxJQUFWLEVBQWdCLE1BQWhCLEVBQXdCLFFBQXhCLEVBQWtDO0FBQ2xFLFNBQU8sS0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixJQUFyQixFQUEyQixNQUEzQixFQUFtQyxRQUFuQyxDQUFQO0FBQ0QsQ0FGRDs7QUFJQSxVQUFVLE9BQU8sT0FBUCxHQUFpQixnQkFBM0IiLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsb25lIGZyb20gJ2xvZGFzaC5jbG9uZSc7XG5pbXBvcnQgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnbG9kYXNoLmRlZmF1bHRzJztcbmltcG9ydCBrZXlzIGZyb20gJ2xvZGFzaC5rZXlzJztcbmltcG9ydCByZXF1ZXN0IGZyb20gJ2F4aW9zJztcbmltcG9ydCB1cmwgZnJvbSAndXJsJztcblxuaW1wb3J0IGNmZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgZ2VuZXJhdGVTaWduZWRQYXJhbXMgZnJvbSAnLi9nZW5lcmF0ZS1zaWduZWQtcGFyYW1zJztcblxuY29uc3QgZGVidWcgPSAhIXByb2Nlc3MuZW52LkRFQlVHO1xuXG4vKipcbiAqIEBjbGFzcyBKU2NyYW1ibGVyQ2xpZW50XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuYWNjZXNzS2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5zZWNyZXRLZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5ob3N0PWFwaS5qc2NyYW1ibGVyLmNvbV1cbiAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5wb3J0PTQ0M11cbiAqIEBhdXRob3IgSm9zw6kgTWFnYWxow6NlcyAobWFnYWxoYXNAZ21haWwuY29tKVxuICogQGxpY2Vuc2UgTUlUIDxodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUPlxuICovXG5mdW5jdGlvbiBKU2NyYW1ibGVyQ2xpZW50IChvcHRpb25zKSB7XG4gIC8vIFNsdWdnaXNoIGhhY2sgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gIGlmIChvcHRpb25zICYmICFvcHRpb25zLmtleXMgJiYgKG9wdGlvbnMuYWNjZXNzS2V5IHx8IG9wdGlvbnMuc2VjcmV0S2V5KSkge1xuICAgIG9wdGlvbnMua2V5cyA9IHt9O1xuICAgIG9wdGlvbnMua2V5cy5hY2Nlc3NLZXkgPSBvcHRpb25zLmFjY2Vzc0tleTtcbiAgICBvcHRpb25zLmtleXMuc2VjcmV0S2V5ID0gb3B0aW9ucy5zZWNyZXRLZXk7XG4gIH1cblxuICBvcHRpb25zLmtleXMgPSBkZWZhdWx0cyhvcHRpb25zLmtleXMgfHwge30sIGNmZy5rZXlzKTtcblxuICAvKipcbiAgICogQG1lbWJlclxuICAgKi9cbiAgdGhpcy5vcHRpb25zID0gZGVmYXVsdHMob3B0aW9ucyB8fCB7fSwgY2ZnKTtcbn1cbi8qKlxuICogRGVsZXRlIHJlcXVlc3QuXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICogQHBhcmFtIHtDYWxsYmFja30gY2FsbGJhY2tcbiAqL1xuSlNjcmFtYmxlckNsaWVudC5wcm90b3R5cGUuZGVsZXRlID0gZnVuY3Rpb24gKHBhdGgsIHBhcmFtcywgY2FsbGJhY2spIHtcbiAgcmV0dXJuIHRoaXMucmVxdWVzdCgnREVMRVRFJywgcGF0aCwgcGFyYW1zLCBjYWxsYmFjayk7XG59O1xuLyoqXG4gKiBHZXQgcmVxdWVzdC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gKiBAcGFyYW0ge0NhbGxiYWNrfSBjYWxsYmFja1xuICovXG5KU2NyYW1ibGVyQ2xpZW50LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAocGF0aCwgcGFyYW1zLCBjYWxsYmFjaywgaXNKU09OID0gdHJ1ZSkge1xuICByZXR1cm4gdGhpcy5yZXF1ZXN0KCdHRVQnLCBwYXRoLCBwYXJhbXMsIGNhbGxiYWNrLCBpc0pTT04pO1xufTtcbi8qKlxuICogSFRUUCByZXF1ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAqIEBwYXJhbSB7Q2FsbGJhY2t9IGNhbGxiYWNrXG4gKi9cbkpTY3JhbWJsZXJDbGllbnQucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiAobWV0aG9kLCBwYXRoLCBwYXJhbXMgPSB7fSwgY2FsbGJhY2sgPSBudWxsLCBpc0pTT04gPSB0cnVlKSB7XG4gIHZhciBzaWduZWREYXRhO1xuXG4gIGlmICh0aGlzLnRva2VuKSB7XG4gICAgcGFyYW1zLnRva2VuID0gdGhpcy50b2tlbjtcbiAgfVxuXG4gIHZhciBfa2V5cyA9IGtleXMocGFyYW1zKTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBfa2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBpZihwYXJhbXNbX2tleXNbaV1dIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHBhcmFtc1tfa2V5c1tpXV0gPSBwYXJhbXNbX2tleXNbaV1dLmpvaW4oJywnKTtcbiAgICB9XG4gIH1cblxuICAvLyBJZiBwb3N0IHNpZ24gZGF0YSBhbmQgc2V0IHRoZSByZXF1ZXN0IGFzIG11bHRpcGFydFxuICBpZiAodGhpcy5vcHRpb25zLmtleXMuYWNjZXNzS2V5ICYmIHRoaXMub3B0aW9ucy5rZXlzLnNlY3JldEtleSkge1xuICAgIHNpZ25lZERhdGEgPSBnZW5lcmF0ZVNpZ25lZFBhcmFtcyhtZXRob2QsIHBhdGgsIHRoaXMub3B0aW9ucy5ob3N0LCB0aGlzLm9wdGlvbnMua2V5cywgcGFyYW1zKTtcbiAgfSBlbHNlIHtcbiAgICBzaWduZWREYXRhID0gcGFyYW1zO1xuICB9XG5cbiAgLy8gRm9ybWF0IFVSTFxuICB2YXIgcHJvdG9jb2wgPSB0aGlzLm9wdGlvbnMucG9ydCA9PT0gNDQzID8gJ2h0dHBzJyA6ICdodHRwJztcblxuICB2YXIgZm9ybWF0ZWRVcmwgPSB1cmwuZm9ybWF0KHtcbiAgICBob3N0bmFtZTogdGhpcy5vcHRpb25zLmhvc3QsXG4gICAgcG9ydDogdGhpcy5vcHRpb25zLnBvcnQsXG4gICAgcHJvdG9jb2w6IHByb3RvY29sXG4gIH0pICsgcGF0aDtcblxuICB2YXIgZGF0YSwgc2V0dGluZ3MgPSB7fTtcblxuICBpZiAoIWlzSlNPTikge1xuICAgIHNldHRpbmdzLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG4gIH1cblxuICB2YXIgcHJvbWlzZTtcblxuICBpZiAobWV0aG9kID09PSAnR0VUJyB8fCBtZXRob2QgPT09ICdERUxFVEUnKSB7XG4gICAgc2V0dGluZ3MucGFyYW1zID0gc2lnbmVkRGF0YTtcbiAgICBwcm9taXNlID0gcmVxdWVzdFttZXRob2QudG9Mb3dlckNhc2UoKV0oZm9ybWF0ZWRVcmwsIHNldHRpbmdzKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhID0gc2lnbmVkRGF0YTtcbiAgICBwcm9taXNlID0gcmVxdWVzdFttZXRob2QudG9Mb3dlckNhc2UoKV0oZm9ybWF0ZWRVcmwsIGRhdGEsIHNldHRpbmdzKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlXG4gICAgLnRoZW4oKHJlcykgPT4gY2FsbGJhY2sobnVsbCwgcmVzKSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiBjYWxsYmFjayhlcnJvcikpO1xufTtcbi8qKlxuICogUG9zdCByZXF1ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAqIEBwYXJhbSB7Q2FsbGJhY2t9IGNhbGxiYWNrXG4gKi9cbkpTY3JhbWJsZXJDbGllbnQucHJvdG90eXBlLnBvc3QgPSBmdW5jdGlvbiAocGF0aCwgcGFyYW1zLCBjYWxsYmFjaykge1xuICByZXR1cm4gdGhpcy5yZXF1ZXN0KCdQT1NUJywgcGF0aCwgcGFyYW1zLCBjYWxsYmFjayk7XG59O1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBKU2NyYW1ibGVyQ2xpZW50O1xuIl19
