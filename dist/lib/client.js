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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxRQUFRLENBQUMsQ0FBQyxRQUFRLEdBQVIsQ0FBWSxLQUE1Qjs7Ozs7Ozs7Ozs7O0FBWUEsU0FBUyxnQkFBVCxDQUEyQixPQUEzQixFQUFvQzs7QUFFbEMsTUFBSSxXQUFXLENBQUMsUUFBUSxJQUFwQixLQUE2QixRQUFRLFNBQVIsSUFBcUIsUUFBUSxTQUExRCxDQUFKLEVBQTBFO0FBQ3hFLFlBQVEsSUFBUixHQUFlLEVBQWY7QUFDQSxZQUFRLElBQVIsQ0FBYSxTQUFiLEdBQXlCLFFBQVEsU0FBakM7QUFDQSxZQUFRLElBQVIsQ0FBYSxTQUFiLEdBQXlCLFFBQVEsU0FBakM7QUFDRDs7QUFFRCxVQUFRLElBQVIsR0FBZSxzQkFBUyxRQUFRLElBQVIsSUFBZ0IsRUFBekIsRUFBNkIsaUJBQUksSUFBakMsQ0FBZjs7Ozs7QUFLQSxPQUFLLE9BQUwsR0FBZSxzQkFBUyxXQUFXLEVBQXBCLG1CQUFmO0FBQ0Q7Ozs7Ozs7QUFPRCxpQkFBaUIsU0FBakIsQ0FBMkIsTUFBM0IsR0FBb0MsVUFBVSxJQUFWLEVBQWdCLE1BQWhCLEVBQXdCLFFBQXhCLEVBQWtDO0FBQ3BFLFNBQU8sS0FBSyxPQUFMLENBQWEsUUFBYixFQUF1QixJQUF2QixFQUE2QixNQUE3QixFQUFxQyxRQUFyQyxDQUFQO0FBQ0QsQ0FGRDs7Ozs7OztBQVNBLGlCQUFpQixTQUFqQixDQUEyQixHQUEzQixHQUFpQyxVQUFVLElBQVYsRUFBZ0IsTUFBaEIsRUFBd0IsUUFBeEIsRUFBaUQ7QUFBQSxNQUFmLE1BQWUseURBQU4sSUFBTTs7QUFDaEYsU0FBTyxLQUFLLE9BQUwsQ0FBYSxLQUFiLEVBQW9CLElBQXBCLEVBQTBCLE1BQTFCLEVBQWtDLFFBQWxDLEVBQTRDLE1BQTVD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QUFDRCxDQUZEOztBQUlBLFVBQVUsT0FBTyxPQUFQLEdBQWlCLGdCQUEzQiIsImZpbGUiOiJjbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lJztcbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCBkZWZhdWx0cyBmcm9tICdsb2Rhc2guZGVmYXVsdHMnO1xuaW1wb3J0IGtleXMgZnJvbSAnbG9kYXNoLmtleXMnO1xuaW1wb3J0IHJlcXVlc3QgZnJvbSAnYXhpb3MnO1xuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xuXG5pbXBvcnQgY2ZnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCBnZW5lcmF0ZVNpZ25lZFBhcmFtcyBmcm9tICcuL2dlbmVyYXRlLXNpZ25lZC1wYXJhbXMnO1xuXG5jb25zdCBkZWJ1ZyA9ICEhcHJvY2Vzcy5lbnYuREVCVUc7XG5cbi8qKlxuICogQGNsYXNzIEpTY3JhbWJsZXJDbGllbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5hY2Nlc3NLZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnNlY3JldEtleVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmhvc3Q9YXBpLmpzY3JhbWJsZXIuY29tXVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnBvcnQ9NDQzXVxuICogQGF1dGhvciBKb3PDqSBNYWdhbGjDo2VzIChtYWdhbGhhc0BnbWFpbC5jb20pXG4gKiBAbGljZW5zZSBNSVQgPGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQ+XG4gKi9cbmZ1bmN0aW9uIEpTY3JhbWJsZXJDbGllbnQgKG9wdGlvbnMpIHtcbiAgLy8gU2x1Z2dpc2ggaGFjayBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgaWYgKG9wdGlvbnMgJiYgIW9wdGlvbnMua2V5cyAmJiAob3B0aW9ucy5hY2Nlc3NLZXkgfHwgb3B0aW9ucy5zZWNyZXRLZXkpKSB7XG4gICAgb3B0aW9ucy5rZXlzID0ge307XG4gICAgb3B0aW9ucy5rZXlzLmFjY2Vzc0tleSA9IG9wdGlvbnMuYWNjZXNzS2V5O1xuICAgIG9wdGlvbnMua2V5cy5zZWNyZXRLZXkgPSBvcHRpb25zLnNlY3JldEtleTtcbiAgfVxuXG4gIG9wdGlvbnMua2V5cyA9IGRlZmF1bHRzKG9wdGlvbnMua2V5cyB8fCB7fSwgY2ZnLmtleXMpO1xuXG4gIC8qKlxuICAgKiBAbWVtYmVyXG4gICAqL1xuICB0aGlzLm9wdGlvbnMgPSBkZWZhdWx0cyhvcHRpb25zIHx8IHt9LCBjZmcpO1xufVxuLyoqXG4gKiBEZWxldGUgcmVxdWVzdC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gKiBAcGFyYW0ge0NhbGxiYWNrfSBjYWxsYmFja1xuICovXG5KU2NyYW1ibGVyQ2xpZW50LnByb3RvdHlwZS5kZWxldGUgPSBmdW5jdGlvbiAocGF0aCwgcGFyYW1zLCBjYWxsYmFjaykge1xuICByZXR1cm4gdGhpcy5yZXF1ZXN0KCdERUxFVEUnLCBwYXRoLCBwYXJhbXMsIGNhbGxiYWNrKTtcbn07XG4vKipcbiAqIEdldCByZXF1ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAqIEBwYXJhbSB7Q2FsbGJhY2t9IGNhbGxiYWNrXG4gKi9cbkpTY3JhbWJsZXJDbGllbnQucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChwYXRoLCBwYXJhbXMsIGNhbGxiYWNrLCBpc0pTT04gPSB0cnVlKSB7XG4gIHJldHVybiB0aGlzLnJlcXVlc3QoJ0dFVCcsIHBhdGgsIHBhcmFtcywgY2FsbGJhY2ssIGlzSlNPTik7XG59O1xuLyoqXG4gKiBIVFRQIHJlcXVlc3QuXG4gKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICogQHBhcmFtIHtDYWxsYmFja30gY2FsbGJhY2tcbiAqL1xuSlNjcmFtYmxlckNsaWVudC5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uIChtZXRob2QsIHBhdGgsIHBhcmFtcyA9IHt9LCBjYWxsYmFjayA9IG51bGwsIGlzSlNPTiA9IHRydWUpIHtcbiAgdmFyIHNpZ25lZERhdGE7XG5cbiAgaWYgKHRoaXMudG9rZW4pIHtcbiAgICBwYXJhbXMudG9rZW4gPSB0aGlzLnRva2VuO1xuICB9IGVsc2Uge1xuICAgIGlmICghdGhpcy5vcHRpb25zLmtleXMuYWNjZXNzS2V5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkICphY2Nlc3NLZXkqIG5vdCBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5vcHRpb25zLmtleXMuc2VjcmV0S2V5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkICpzZWNyZXRLZXkqIG5vdCBwcm92aWRlZCcpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBfa2V5cyA9IGtleXMocGFyYW1zKTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBfa2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBpZihwYXJhbXNbX2tleXNbaV1dIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHBhcmFtc1tfa2V5c1tpXV0gPSBwYXJhbXNbX2tleXNbaV1dLmpvaW4oJywnKTtcbiAgICB9XG4gIH1cblxuICAvLyBJZiBwb3N0IHNpZ24gZGF0YSBhbmQgc2V0IHRoZSByZXF1ZXN0IGFzIG11bHRpcGFydFxuICBpZiAodGhpcy5vcHRpb25zLmtleXMuYWNjZXNzS2V5ICYmIHRoaXMub3B0aW9ucy5rZXlzLnNlY3JldEtleSkge1xuICAgIHNpZ25lZERhdGEgPSBnZW5lcmF0ZVNpZ25lZFBhcmFtcyhtZXRob2QsIHBhdGgsIHRoaXMub3B0aW9ucy5ob3N0LCB0aGlzLm9wdGlvbnMua2V5cywgcGFyYW1zKTtcbiAgfSBlbHNlIHtcbiAgICBzaWduZWREYXRhID0gcGFyYW1zO1xuICB9XG5cbiAgLy8gRm9ybWF0IFVSTFxuICB2YXIgcHJvdG9jb2wgPSB0aGlzLm9wdGlvbnMucG9ydCA9PT0gNDQzID8gJ2h0dHBzJyA6ICdodHRwJztcblxuICB2YXIgZm9ybWF0ZWRVcmwgPSB1cmwuZm9ybWF0KHtcbiAgICBob3N0bmFtZTogdGhpcy5vcHRpb25zLmhvc3QsXG4gICAgcG9ydDogdGhpcy5vcHRpb25zLnBvcnQsXG4gICAgcHJvdG9jb2w6IHByb3RvY29sXG4gIH0pICsgcGF0aDtcblxuICB2YXIgZGF0YSwgc2V0dGluZ3MgPSB7fTtcblxuICBpZiAoIWlzSlNPTikge1xuICAgIHNldHRpbmdzLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG4gIH1cblxuICB2YXIgcHJvbWlzZTtcblxuICBpZiAobWV0aG9kID09PSAnR0VUJyB8fCBtZXRob2QgPT09ICdERUxFVEUnKSB7XG4gICAgc2V0dGluZ3MucGFyYW1zID0gc2lnbmVkRGF0YTtcbiAgICBwcm9taXNlID0gcmVxdWVzdFttZXRob2QudG9Mb3dlckNhc2UoKV0oZm9ybWF0ZWRVcmwsIHNldHRpbmdzKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhID0gc2lnbmVkRGF0YTtcbiAgICBwcm9taXNlID0gcmVxdWVzdFttZXRob2QudG9Mb3dlckNhc2UoKV0oZm9ybWF0ZWRVcmwsIGRhdGEsIHNldHRpbmdzKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlXG4gICAgLnRoZW4oKHJlcykgPT4gY2FsbGJhY2sobnVsbCwgcmVzKSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiBjYWxsYmFjayhlcnJvcikpO1xufTtcbi8qKlxuICogUG9zdCByZXF1ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAqIEBwYXJhbSB7Q2FsbGJhY2t9IGNhbGxiYWNrXG4gKi9cbkpTY3JhbWJsZXJDbGllbnQucHJvdG90eXBlLnBvc3QgPSBmdW5jdGlvbiAocGF0aCwgcGFyYW1zLCBjYWxsYmFjaykge1xuICByZXR1cm4gdGhpcy5yZXF1ZXN0KCdQT1NUJywgcGF0aCwgcGFyYW1zLCBjYWxsYmFjayk7XG59O1xuXG5leHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBKU2NyYW1ibGVyQ2xpZW50O1xuIl19
