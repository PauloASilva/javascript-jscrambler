import clone from 'lodash.clone';
import crypto from 'crypto';
import defaults from 'lodash.defaults';
import keys from 'lodash.keys';
import request from 'superagent';
import url from 'url';

import cfg from './config';

//import fs from 'fs';

const debug = !!process.env.DEBUG;

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
function JScramblerClient (options) {
  // Sluggish hack for backwards compatibility
  if (options && !options.keys && (options.accessKey || options.secretKey)) {
    options.keys = {};
    options.keys.accessKey = options.accessKey;
    options.keys.secretKey = options.secretKey;
  }

  options.keys = defaults(options.keys || {}, cfg.keys);

  this.webSocket = options.webSocket;

  /**
   * @member
   */
  this.options = defaults(options || {}, cfg);
  if (!this.options.keys.accessKey || !this.options.keys.secretKey)
    throw new Error('Missing access or secret keys');
}
/**
 * It builds a query string sorted by key.
 * @private
 * @static
 * @param {Object} params
 * @memberof JScramblerClient
 * @returns {String} The query string.
 */
function buildSortedQuery (params) {
  // Sorted keys
  var _keys = keys(params).sort();
  var query = '';
  for (var i = 0, l = _keys.length; i < l; i++)
    query += encodeURIComponent(_keys[i]) + '=' + encodeURIComponent(params[_keys[i]]) + '&';
  query = query
            .replace(/\*/g, '%2A')
            .replace(/[!'()]/g, escape)
            .replace(/%7E/g, '~')
            .replace(/\+/g, '%20');
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
function generateHmacSignature (method, path, params) {
  var paramsCopy = clone(params);
  for (var key in params) {
    if (key.indexOf('file_') !== -1) {
      paramsCopy[key] = crypto.createHash('md5').update(
        fs.readFileSync(params[key].file)).digest('hex');
    }
  }
  var signatureData = method.toUpperCase() + ';' + this.options.host.toLowerCase() +
    ';' + path + ';' + buildSortedQuery(paramsCopy);
  debug && console.log('Signature data: ' + signatureData);
  var hmac = crypto.createHmac('sha256', this.options.keys.secretKey.toUpperCase());
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
function handleFileParams (params) {
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
function signedParams (method, path, params) {
  params = defaults(clone(params), {
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
JScramblerClient.prototype.delete = function (path, params, callback) {
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
JScramblerClient.prototype.request = function (method, path, params = {}, callback = null) {
  var signedData;

  var _keys = keys(params);
  for (var i = 0, l = _keys.length; i < l; i++) {
    if(params[_keys[i]] instanceof Array && _keys[i] !== 'files') {
      params[_keys[i]] = params[_keys[i]].join(',');
    }
  }

  // If post sign data and set the request as multipart
  signedData = signedParams.apply(this, arguments);

  // Format URL
  var protocol = this.options.port === 443 ? 'https' : 'http';

  var formatedUrl = url.format({
    hostname: this.options.host,
    port: this.options.port,
    protocol: protocol
  }) + path;

  const req = request[method.toLowerCase()](formatedUrl).type('json');

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
