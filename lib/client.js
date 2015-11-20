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

  this.webSocket = options.webSocket;

  /**
   * @member
   */
  this.options = (0, _lodashDefaults2['default'])(options || {}, _config2['default']);
  if (!this.options.keys.accessKey || !this.options.keys.secretKey) throw new Error('Missing access or secret keys');
}
/**
 * It builds a query string sorted by key.
 * @private
 * @static
 * @param {Object} params
 * @memberof JScramblerClient
 * @returns {String} The query string.
 */
function buildSortedQuery(params) {
  // Sorted keys
  var _keys = (0, _lodashKeys2['default'])(params).sort();
  var query = '';
  for (var i = 0, l = _keys.length; i < l; i++) query += encodeURIComponent(_keys[i]) + '=' + encodeURIComponent(params[_keys[i]]) + '&';
  query = query.replace(/\*/g, '%2A').replace(/[!'()]/g, escape).replace(/%7E/g, '~').replace(/\+/g, '%20');
  // Strip the last separator and return
  return query.substring(0, query.length - 1);
}
/**
 * Generates the needed HMAC signature for the request.
 * @memberof JScramblerClient
 * @param {String} method
 * @param {String} path
 * @param {Object} params
 * @returns {String} The digested signature.
 */
function generateHmacSignature(method, path, params) {
  var paramsCopy = (0, _lodashClone2['default'])(params);
  for (var key in params) {
    if (key.indexOf('file_') !== -1) {
      paramsCopy[key] = _crypto2['default'].createHash('md5').update(fs.readFileSync(params[key].file)).digest('hex');
    }
  }
  var signatureData = method.toUpperCase() + ';' + this.options.host.toLowerCase() + ';' + path + ';' + buildSortedQuery(paramsCopy);
  debug && console.log('Signature data: ' + signatureData);
  var hmac = _crypto2['default'].createHmac('sha256', this.options.keys.secretKey.toUpperCase());
  hmac.update(signatureData);
  return hmac.digest('base64');
}
/**
 * Iterate each passed file inside params.files and creates the corresponding
 params.file_{index}. It deletes params.files after iterating.
 * @private
 * @static
 * @memberof JScramblerClient
 * @param {String} method
 * @param {String} path
 * @param {Object} params
 */
function handleFileParams(params) {
  if (params.files) {
    for (var i = 0, l = params.files.length; i < l; i++) {
      params['file_' + i] = {
        file: params.files[i],
        content_type: 'application/octet-stream'
      };
    }
    delete params.files;
  }
}
/**
 * Signs all the parameters.
 ^ @private
 * @memberof JScramblerClient
 * @param {String} method
 * @param {String} path
 * @param {Object} params
 * @returns {Object} Params containing the access_key, timestamp and signature
 properties.
 */
function signedParams(method, path, params) {
  params = (0, _lodashDefaults2['default'])((0, _lodashClone2['default'])(params), {
    access_key: this.options.keys.accessKey,
    timestamp: new Date().toISOString(),
    user_agent: 'Node'
  });
  if (method === 'POST' && params.files) handleFileParams(params);
  params.signature = generateHmacSignature.call(this, method, path, params);
  return params;
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
    if (params[_keys[i]] instanceof Array && _keys[i] !== 'files') {
      params[_keys[i]] = params[_keys[i]].join(',');
    }
  }

  // If post sign data and set the request as multipart
  signedData = signedParams.apply(this, arguments);

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
//# sourceMappingURL=data:application/json;base64,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LENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxVQUFVLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFO0FBQ2xFLE1BQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7Q0FDOUMsQ0FBQzs7QUFFRixPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyIsImZpbGUiOiJjbGllbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xvbmUgZnJvbSAnbG9kYXNoLmNsb25lJztcbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcbmltcG9ydCBkZWZhdWx0cyBmcm9tICdsb2Rhc2guZGVmYXVsdHMnO1xuaW1wb3J0IGtleXMgZnJvbSAnbG9kYXNoLmtleXMnO1xuaW1wb3J0IHJlcXVlc3QgZnJvbSAnc3VwZXJhZ2VudCc7XG5pbXBvcnQgdXJsIGZyb20gJ3VybCc7XG5cbmltcG9ydCBjZmcgZnJvbSAnLi9jb25maWcnO1xuXG4vL2ltcG9ydCBmcyBmcm9tICdmcyc7XG5cbmNvbnN0IGRlYnVnID0gISFwcm9jZXNzLmVudi5ERUJVRztcblxuLyoqXG4gKiBAY2xhc3MgSlNjcmFtYmxlckNsaWVudFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLmFjY2Vzc0tleVxuICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMuc2VjcmV0S2V5XG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuaG9zdD1hcGkuanNjcmFtYmxlci5jb21dXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMucG9ydD00NDNdXG4gKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMuYXBpVmVyc2lvbj0zXVxuICogQGF1dGhvciBKb3PDqSBNYWdhbGjDo2VzIChtYWdhbGhhc0BnbWFpbC5jb20pXG4gKiBAbGljZW5zZSBNSVQgPGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVQ+XG4gKi9cbmZ1bmN0aW9uIEpTY3JhbWJsZXJDbGllbnQgKG9wdGlvbnMpIHtcbiAgLy8gU2x1Z2dpc2ggaGFjayBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcbiAgaWYgKG9wdGlvbnMgJiYgIW9wdGlvbnMua2V5cyAmJiAob3B0aW9ucy5hY2Nlc3NLZXkgfHwgb3B0aW9ucy5zZWNyZXRLZXkpKSB7XG4gICAgb3B0aW9ucy5rZXlzID0ge307XG4gICAgb3B0aW9ucy5rZXlzLmFjY2Vzc0tleSA9IG9wdGlvbnMuYWNjZXNzS2V5O1xuICAgIG9wdGlvbnMua2V5cy5zZWNyZXRLZXkgPSBvcHRpb25zLnNlY3JldEtleTtcbiAgfVxuXG4gIG9wdGlvbnMua2V5cyA9IGRlZmF1bHRzKG9wdGlvbnMua2V5cyB8fCB7fSwgY2ZnLmtleXMpO1xuXG4gIHRoaXMud2ViU29ja2V0ID0gb3B0aW9ucy53ZWJTb2NrZXQ7XG5cbiAgLyoqXG4gICAqIEBtZW1iZXJcbiAgICovXG4gIHRoaXMub3B0aW9ucyA9IGRlZmF1bHRzKG9wdGlvbnMgfHwge30sIGNmZyk7XG4gIGlmICghdGhpcy5vcHRpb25zLmtleXMuYWNjZXNzS2V5IHx8ICF0aGlzLm9wdGlvbnMua2V5cy5zZWNyZXRLZXkpXG4gICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGFjY2VzcyBvciBzZWNyZXQga2V5cycpO1xufVxuLyoqXG4gKiBJdCBidWlsZHMgYSBxdWVyeSBzdHJpbmcgc29ydGVkIGJ5IGtleS5cbiAqIEBwcml2YXRlXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gKiBAbWVtYmVyb2YgSlNjcmFtYmxlckNsaWVudFxuICogQHJldHVybnMge1N0cmluZ30gVGhlIHF1ZXJ5IHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYnVpbGRTb3J0ZWRRdWVyeSAocGFyYW1zKSB7XG4gIC8vIFNvcnRlZCBrZXlzXG4gIHZhciBfa2V5cyA9IGtleXMocGFyYW1zKS5zb3J0KCk7XG4gIHZhciBxdWVyeSA9ICcnO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IF9rZXlzLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICBxdWVyeSArPSBlbmNvZGVVUklDb21wb25lbnQoX2tleXNbaV0pICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtc1tfa2V5c1tpXV0pICsgJyYnO1xuICBxdWVyeSA9IHF1ZXJ5XG4gICAgICAgICAgICAucmVwbGFjZSgvXFwqL2csICclMkEnKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1shJygpXS9nLCBlc2NhcGUpXG4gICAgICAgICAgICAucmVwbGFjZSgvJTdFL2csICd+JylcbiAgICAgICAgICAgIC5yZXBsYWNlKC9cXCsvZywgJyUyMCcpO1xuICAvLyBTdHJpcCB0aGUgbGFzdCBzZXBhcmF0b3IgYW5kIHJldHVyblxuICByZXR1cm4gcXVlcnkuc3Vic3RyaW5nKDAsIHF1ZXJ5Lmxlbmd0aCAtIDEpO1xufVxuLyoqXG4gKiBHZW5lcmF0ZXMgdGhlIG5lZWRlZCBITUFDIHNpZ25hdHVyZSBmb3IgdGhlIHJlcXVlc3QuXG4gKiBAbWVtYmVyb2YgSlNjcmFtYmxlckNsaWVudFxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAqIEByZXR1cm5zIHtTdHJpbmd9IFRoZSBkaWdlc3RlZCBzaWduYXR1cmUuXG4gKi9cbmZ1bmN0aW9uIGdlbmVyYXRlSG1hY1NpZ25hdHVyZSAobWV0aG9kLCBwYXRoLCBwYXJhbXMpIHtcbiAgdmFyIHBhcmFtc0NvcHkgPSBjbG9uZShwYXJhbXMpO1xuICBmb3IgKHZhciBrZXkgaW4gcGFyYW1zKSB7XG4gICAgaWYgKGtleS5pbmRleE9mKCdmaWxlXycpICE9PSAtMSkge1xuICAgICAgcGFyYW1zQ29weVtrZXldID0gY3J5cHRvLmNyZWF0ZUhhc2goJ21kNScpLnVwZGF0ZShcbiAgICAgICAgZnMucmVhZEZpbGVTeW5jKHBhcmFtc1trZXldLmZpbGUpKS5kaWdlc3QoJ2hleCcpO1xuICAgIH1cbiAgfVxuICB2YXIgc2lnbmF0dXJlRGF0YSA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpICsgJzsnICsgdGhpcy5vcHRpb25zLmhvc3QudG9Mb3dlckNhc2UoKSArXG4gICAgJzsnICsgcGF0aCArICc7JyArIGJ1aWxkU29ydGVkUXVlcnkocGFyYW1zQ29weSk7XG4gIGRlYnVnICYmIGNvbnNvbGUubG9nKCdTaWduYXR1cmUgZGF0YTogJyArIHNpZ25hdHVyZURhdGEpO1xuICB2YXIgaG1hYyA9IGNyeXB0by5jcmVhdGVIbWFjKCdzaGEyNTYnLCB0aGlzLm9wdGlvbnMua2V5cy5zZWNyZXRLZXkudG9VcHBlckNhc2UoKSk7XG4gIGhtYWMudXBkYXRlKHNpZ25hdHVyZURhdGEpO1xuICByZXR1cm4gaG1hYy5kaWdlc3QoJ2Jhc2U2NCcpO1xufVxuLyoqXG4gKiBJdGVyYXRlIGVhY2ggcGFzc2VkIGZpbGUgaW5zaWRlIHBhcmFtcy5maWxlcyBhbmQgY3JlYXRlcyB0aGUgY29ycmVzcG9uZGluZ1xuIHBhcmFtcy5maWxlX3tpbmRleH0uIEl0IGRlbGV0ZXMgcGFyYW1zLmZpbGVzIGFmdGVyIGl0ZXJhdGluZy5cbiAqIEBwcml2YXRlXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyb2YgSlNjcmFtYmxlckNsaWVudFxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAqL1xuZnVuY3Rpb24gaGFuZGxlRmlsZVBhcmFtcyAocGFyYW1zKSB7XG4gIGlmIChwYXJhbXMuZmlsZXMpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHBhcmFtcy5maWxlcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHBhcmFtc1snZmlsZV8nICsgaV0gPSB7XG4gICAgICAgIGZpbGU6IHBhcmFtcy5maWxlc1tpXSxcbiAgICAgICAgY29udGVudF90eXBlOiAnYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtJ1xuICAgICAgfTtcbiAgICB9XG4gICAgZGVsZXRlIHBhcmFtcy5maWxlcztcbiAgfVxufVxuLyoqXG4gKiBTaWducyBhbGwgdGhlIHBhcmFtZXRlcnMuXG4gXiBAcHJpdmF0ZVxuICogQG1lbWJlcm9mIEpTY3JhbWJsZXJDbGllbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBQYXJhbXMgY29udGFpbmluZyB0aGUgYWNjZXNzX2tleSwgdGltZXN0YW1wIGFuZCBzaWduYXR1cmVcbiBwcm9wZXJ0aWVzLlxuICovXG5mdW5jdGlvbiBzaWduZWRQYXJhbXMgKG1ldGhvZCwgcGF0aCwgcGFyYW1zKSB7XG4gIHBhcmFtcyA9IGRlZmF1bHRzKGNsb25lKHBhcmFtcyksIHtcbiAgICBhY2Nlc3Nfa2V5OiB0aGlzLm9wdGlvbnMua2V5cy5hY2Nlc3NLZXksXG4gICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgdXNlcl9hZ2VudDogJ05vZGUnXG4gIH0pO1xuICBpZiAobWV0aG9kID09PSAnUE9TVCcgJiYgcGFyYW1zLmZpbGVzKSBoYW5kbGVGaWxlUGFyYW1zKHBhcmFtcyk7XG4gIHBhcmFtcy5zaWduYXR1cmUgPSBnZW5lcmF0ZUhtYWNTaWduYXR1cmUuY2FsbCh0aGlzLCBtZXRob2QsIHBhdGgsIHBhcmFtcyk7XG4gIHJldHVybiBwYXJhbXM7XG59XG4vKipcbiAqIERlbGV0ZSByZXF1ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAqIEBwYXJhbSB7Q2FsbGJhY2t9IGNhbGxiYWNrXG4gKi9cbkpTY3JhbWJsZXJDbGllbnQucHJvdG90eXBlLmRlbGV0ZSA9IGZ1bmN0aW9uIChwYXRoLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIHRoaXMucmVxdWVzdCgnREVMRVRFJywgcGF0aCwgcGFyYW1zLCBjYWxsYmFjayk7XG59O1xuLyoqXG4gKiBHZXQgcmVxdWVzdC5cbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gKiBAcGFyYW0ge0NhbGxiYWNrfSBjYWxsYmFja1xuICovXG5KU2NyYW1ibGVyQ2xpZW50LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAocGF0aCwgcGFyYW1zLCBjYWxsYmFjaykge1xuICB0aGlzLnJlcXVlc3QoJ0dFVCcsIHBhdGgsIHBhcmFtcywgY2FsbGJhY2spO1xufTtcbi8qKlxuICogSFRUUCByZXF1ZXN0LlxuICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAqIEBwYXJhbSB7Q2FsbGJhY2t9IGNhbGxiYWNrXG4gKi9cbkpTY3JhbWJsZXJDbGllbnQucHJvdG90eXBlLnJlcXVlc3QgPSBmdW5jdGlvbiAobWV0aG9kLCBwYXRoLCBwYXJhbXMgPSB7fSwgY2FsbGJhY2sgPSBudWxsKSB7XG4gIHZhciBzaWduZWREYXRhO1xuXG4gIHZhciBfa2V5cyA9IGtleXMocGFyYW1zKTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBfa2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICBpZihwYXJhbXNbX2tleXNbaV1dIGluc3RhbmNlb2YgQXJyYXkgJiYgX2tleXNbaV0gIT09ICdmaWxlcycpIHtcbiAgICAgIHBhcmFtc1tfa2V5c1tpXV0gPSBwYXJhbXNbX2tleXNbaV1dLmpvaW4oJywnKTtcbiAgICB9XG4gIH1cblxuICAvLyBJZiBwb3N0IHNpZ24gZGF0YSBhbmQgc2V0IHRoZSByZXF1ZXN0IGFzIG11bHRpcGFydFxuICBzaWduZWREYXRhID0gc2lnbmVkUGFyYW1zLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cbiAgLy8gRm9ybWF0IFVSTFxuICB2YXIgcHJvdG9jb2wgPSB0aGlzLm9wdGlvbnMucG9ydCA9PT0gNDQzID8gJ2h0dHBzJyA6ICdodHRwJztcblxuICB2YXIgZm9ybWF0ZWRVcmwgPSB1cmwuZm9ybWF0KHtcbiAgICBob3N0bmFtZTogdGhpcy5vcHRpb25zLmhvc3QsXG4gICAgcG9ydDogdGhpcy5vcHRpb25zLnBvcnQsXG4gICAgcHJvdG9jb2w6IHByb3RvY29sXG4gIH0pICsgcGF0aDtcblxuICBjb25zdCByZXEgPSByZXF1ZXN0W21ldGhvZC50b0xvd2VyQ2FzZSgpXShmb3JtYXRlZFVybCkudHlwZSgnanNvbicpO1xuXG4gIGlmIChtZXRob2QgPT09ICdQT1NUJyB8fCBtZXRob2QgPT09ICdQVVQnKSB7XG4gICAgcmVxLnNlbmQoc2lnbmVkRGF0YSk7XG4gIH0gZWxzZSB7XG4gICAgcmVxLnF1ZXJ5KHNpZ25lZERhdGEpO1xuICB9XG5cbiAgcmVxLmVuZChjYWxsYmFjayk7XG59O1xuLyoqXG4gKiBQb3N0IHJlcXVlc3QuXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aFxuICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICogQHBhcmFtIHtDYWxsYmFja30gY2FsbGJhY2tcbiAqL1xuSlNjcmFtYmxlckNsaWVudC5wcm90b3R5cGUucG9zdCA9IGZ1bmN0aW9uIChwYXRoLCBwYXJhbXMsIGNhbGxiYWNrKSB7XG4gIHRoaXMucmVxdWVzdCgnUE9TVCcsIHBhdGgsIHBhcmFtcywgY2FsbGJhY2spO1xufTtcblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gSlNjcmFtYmxlckNsaWVudDtcbiJdfQ==
