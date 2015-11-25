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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGllbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OzsyQkFBa0IsY0FBYzs7OztzQkFDYixRQUFROzs7OzhCQUNOLGlCQUFpQjs7OzswQkFDckIsYUFBYTs7OzswQkFDVixZQUFZOzs7O21CQUNoQixLQUFLOzs7O3NCQUVMLFVBQVU7Ozs7b0NBQ08sMEJBQTBCOzs7Ozs7QUFJM0QsSUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDOzs7Ozs7Ozs7Ozs7O0FBYWxDLFNBQVMsZ0JBQWdCLENBQUUsT0FBTyxFQUFFOztBQUVsQyxNQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssT0FBTyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFBLEFBQUMsRUFBRTtBQUN4RSxXQUFPLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNsQixXQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO0FBQzNDLFdBQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7R0FDNUM7O0FBRUQsU0FBTyxDQUFDLElBQUksR0FBRyxpQ0FBUyxPQUFPLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFBRSxvQkFBSSxJQUFJLENBQUMsQ0FBQzs7Ozs7QUFLdEQsTUFBSSxDQUFDLE9BQU8sR0FBRyxpQ0FBUyxPQUFPLElBQUksRUFBRSxzQkFBTSxDQUFDO0FBQzVDLE1BQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQzlELE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztDQUNwRDs7Ozs7OztBQU9ELGdCQUFnQixDQUFDLFNBQVMsVUFBTyxHQUFHLFVBQVUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7QUFDcEUsTUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztDQUNoRCxDQUFDOzs7Ozs7O0FBT0YsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxVQUFVLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0FBQ2pFLE1BQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7Q0FDN0MsQ0FBQzs7Ozs7Ozs7QUFRRixnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFVBQVUsTUFBTSxFQUFFLElBQUksRUFBZ0M7TUFBOUIsTUFBTSx5REFBRyxFQUFFO01BQUUsUUFBUSx5REFBRyxJQUFJOztBQUN2RixNQUFJLFVBQVUsQ0FBQzs7QUFFZixNQUFJLEtBQUssR0FBRyw2QkFBSyxNQUFNLENBQUMsQ0FBQztBQUN6QixPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVDLFFBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEtBQUssRUFBRTtBQUNwQyxZQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMvQztHQUNGOzs7QUFHRCxZQUFVLEdBQUcsdUNBQXFCLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7OztBQUc5RixNQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxHQUFHLEdBQUcsT0FBTyxHQUFHLE1BQU0sQ0FBQzs7QUFFNUQsTUFBSSxXQUFXLEdBQUcsaUJBQUksTUFBTSxDQUFDO0FBQzNCLFlBQVEsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUk7QUFDM0IsUUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSTtBQUN2QixZQUFRLEVBQUUsUUFBUTtHQUNuQixDQUFDLEdBQUcsSUFBSSxDQUFDOztBQUVWLE1BQU0sR0FBRyxHQUFHLHdCQUFRLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFcEUsTUFBSSxNQUFNLEtBQUssTUFBTSxJQUFJLE1BQU0sS0FBSyxLQUFLLEVBQUU7QUFDekMsT0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztHQUN0QixNQUFNO0FBQ0wsT0FBRyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztHQUN2Qjs7QUFFRCxLQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0NBQ25CLENBQUM7Ozs7Ozs7QUFPRixnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFVBQVUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUU7QUFDbEUsTUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztDQUM5QyxDQUFDOztBQUVGLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxHQUFHLGdCQUFnQixDQUFDIiwiZmlsZSI6ImNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbG9uZSBmcm9tICdsb2Rhc2guY2xvbmUnO1xuaW1wb3J0IGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJ2xvZGFzaC5kZWZhdWx0cyc7XG5pbXBvcnQga2V5cyBmcm9tICdsb2Rhc2gua2V5cyc7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdzdXBlcmFnZW50JztcbmltcG9ydCB1cmwgZnJvbSAndXJsJztcblxuaW1wb3J0IGNmZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgZ2VuZXJhdGVTaWduZWRQYXJhbXMgZnJvbSAnLi9nZW5lcmF0ZS1zaWduZWQtcGFyYW1zJztcblxuLy9pbXBvcnQgZnMgZnJvbSAnZnMnO1xuXG5jb25zdCBkZWJ1ZyA9ICEhcHJvY2Vzcy5lbnYuREVCVUc7XG5cbi8qKlxuICogQGNsYXNzIEpTY3JhbWJsZXJDbGllbnRcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zXG4gKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy5hY2Nlc3NLZXlcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnNlY3JldEtleVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmhvc3Q9YXBpLmpzY3JhbWJsZXIuY29tXVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnBvcnQ9NDQzXVxuICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLmFwaVZlcnNpb249M11cbiAqIEBhdXRob3IgSm9zw6kgTWFnYWxow6NlcyAobWFnYWxoYXNAZ21haWwuY29tKVxuICogQGxpY2Vuc2UgTUlUIDxodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUPlxuICovXG5mdW5jdGlvbiBKU2NyYW1ibGVyQ2xpZW50IChvcHRpb25zKSB7XG4gIC8vIFNsdWdnaXNoIGhhY2sgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG4gIGlmIChvcHRpb25zICYmICFvcHRpb25zLmtleXMgJiYgKG9wdGlvbnMuYWNjZXNzS2V5IHx8IG9wdGlvbnMuc2VjcmV0S2V5KSkge1xuICAgIG9wdGlvbnMua2V5cyA9IHt9O1xuICAgIG9wdGlvbnMua2V5cy5hY2Nlc3NLZXkgPSBvcHRpb25zLmFjY2Vzc0tleTtcbiAgICBvcHRpb25zLmtleXMuc2VjcmV0S2V5ID0gb3B0aW9ucy5zZWNyZXRLZXk7XG4gIH1cblxuICBvcHRpb25zLmtleXMgPSBkZWZhdWx0cyhvcHRpb25zLmtleXMgfHwge30sIGNmZy5rZXlzKTtcblxuICAvKipcbiAgICogQG1lbWJlclxuICAgKi9cbiAgdGhpcy5vcHRpb25zID0gZGVmYXVsdHMob3B0aW9ucyB8fCB7fSwgY2ZnKTtcbiAgaWYgKCF0aGlzLm9wdGlvbnMua2V5cy5hY2Nlc3NLZXkgfHwgIXRoaXMub3B0aW9ucy5rZXlzLnNlY3JldEtleSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgYWNjZXNzIG9yIHNlY3JldCBrZXlzJyk7XG59XG4vKipcbiAqIERlbGV0ZSByZXF1ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAqIEBwYXJhbSB7Q2FsbGJhY2t9IGNhbGxiYWNrXG4gKi9cbkpTY3JhbWJsZXJDbGllbnQucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uIChwYXRoLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIHRoaXMucmVxdWVzdCgnREVMRVRFJywgcGF0aCwgcGFyYW1zLCBjYWxsYmFjayk7XG59O1xuLyoqXG4gKiBHZXQgcmVxdWVzdC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gKiBAcGFyYW0ge0NhbGxiYWNrfSBjYWxsYmFja1xuICovXG5KU2NyYW1ibGVyQ2xpZW50LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAocGF0aCwgcGFyYW1zLCBjYWxsYmFjaykge1xuICB0aGlzLnJlcXVlc3QoJ0dFVCcsIHBhdGgsIHBhcmFtcywgY2FsbGJhY2spO1xufTtcbi8qKlxuICogSFRUUCByZXF1ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAqIEBwYXJhbSB7Q2FsbGJhY2t9IGNhbGxiYWNrXG4gKi9cbkpTY3JhbWJsZXJDbGllbnQucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiAobWV0aG9kLCBwYXRoLCBwYXJhbXMgPSB7fSwgY2FsbGJhY2sgPSBudWxsKSB7XG4gIHZhciBzaWduZWREYXRhO1xuXG4gIHZhciBfa2V5cyA9IGtleXMocGFyYW1zKTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBfa2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBpZihwYXJhbXNbX2tleXNbaV1dIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgIHBhcmFtc1tfa2V5c1tpXV0gPSBwYXJhbXNbX2tleXNbaV1dLmpvaW4oJywnKTtcbiAgICB9XG4gIH1cblxuICAvLyBJZiBwb3N0IHNpZ24gZGF0YSBhbmQgc2V0IHRoZSByZXF1ZXN0IGFzIG11bHRpcGFydFxuICBzaWduZWREYXRhID0gZ2VuZXJhdGVTaWduZWRQYXJhbXMobWV0aG9kLCBwYXRoLCB0aGlzLm9wdGlvbnMuaG9zdCwgdGhpcy5vcHRpb25zLmtleXMsIHBhcmFtcyk7XG5cbiAgLy8gRm9ybWF0IFVSTFxuICB2YXIgcHJvdG9jb2wgPSB0aGlzLm9wdGlvbnMucG9ydCA9PT0gNDQzID8gJ2h0dHBzJyA6ICdodHRwJztcblxuICB2YXIgZm9ybWF0ZWRVcmwgPSB1cmwuZm9ybWF0KHtcbiAgICBob3N0bmFtZTogdGhpcy5vcHRpb25zLmhvc3QsXG4gICAgcG9ydDogdGhpcy5vcHRpb25zLnBvcnQsXG4gICAgcHJvdG9jb2w6IHByb3RvY29sXG4gIH0pICsgcGF0aDtcblxuICBjb25zdCByZXEgPSByZXF1ZXN0W21ldGhvZC50b0xvd2VyQ2FzZSgpXShmb3JtYXRlZFVybCkudHlwZSgnanNvbicpO1xuXG4gIGlmIChtZXRob2QgPT09ICdQT1NUJyB8fCBtZXRob2QgPT09ICdQVVQnKSB7XG4gICAgcmVxLnNlbmQoc2lnbmVkRGF0YSk7XG4gIH0gZWxzZSB7XG4gICAgcmVxLnF1ZXJ5KHNpZ25lZERhdGEpO1xuICB9XG5cbiAgcmVxLmVuZChjYWxsYmFjayk7XG59O1xuLyoqXG4gKiBQb3N0IHJlcXVlc3QuXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICogQHBhcmFtIHtDYWxsYmFja30gY2FsbGJhY2tcbiAqL1xuSlNjcmFtYmxlckNsaWVudC5wcm90b3R5cGUucG9zdCA9IGZ1bmN0aW9uIChwYXRoLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIHRoaXMucmVxdWVzdCgnUE9TVCcsIHBhdGgsIHBhcmFtcywgY2FsbGJhY2spO1xufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gSlNjcmFtYmxlckNsaWVudDtcbiJdfQ==
