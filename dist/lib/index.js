'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('babel-polyfill');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _generateSignedParams = require('./generate-signed-params');

var _generateSignedParams2 = _interopRequireDefault(_generateSignedParams);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _mutations = require('./mutations');

var _queries = require('./queries');

var _zip2 = require('./zip');

exports['default'] = {
  Client: _client2['default'],
  config: _config2['default'],
  generateSignedParams: _generateSignedParams2['default'],
  // This method is a shortcut method that accepts an object with everything needed
  // for the entire process of requesting an application protection and downloading
  // that same protection when the same ends.
  //
  // `configPathOrObject` can be a path to a JSON or directly an object containing
  // the following structure:
  //
  // ```json
  // {
  //   "keys": {
  //     "accessKey": "",
  //     "secretKey": ""
  //   },
  //   "applicationId": "",
  //   "filesDest": ""
  // }
  // ```
  //
  // Also the following optional parameters are accepted:
  //
  // ```json
  // {
  //   "filesSrc": [""],
  //   "params": {},
  //   "cwd": "",
  //   "host": "api.jscrambler.com",
  //   "port": "443"
  // }
  // ```
  //
  // `filesSrc` supports glob patterns, and if it's provided it will replace the
  // entire application sources.
  //
  // `params` if provided will replace all the application transformation parameters.
  //
  // `cwd` allows you to set the current working directory to resolve problems with
  // relative paths with your `filesSrc` is outside the current working directory.
  //
  // Finally, `host` and `port` can be overridden if you to engage with a different
  // endpoint than the default one, useful if you're running an enterprise version of
  // Jscrambler or if you're provided access to beta features of our product.
  //
  protectAndDownload: function protectAndDownload(configPathOrObject, destCallback) {
    var config, applicationId, host, port, keys, filesDest, filesSrc, cwd, params, accessKey, secretKey, client, _filesSrc, i, l, _zip, removeSourceRes, addApplicationSourceRes, areParametersOrdered, updateApplicationRes, createApplicationProtectionRes, protectionId, download;

    return regeneratorRuntime.async(function protectAndDownload$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          config = typeof configPathOrObject === 'string' ? require(configPathOrObject) : configPathOrObject;
          applicationId = config.applicationId;
          host = config.host;
          port = config.port;
          keys = config.keys;
          filesDest = config.filesDest;
          filesSrc = config.filesSrc;
          cwd = config.cwd;
          params = config.params;
          accessKey = keys.accessKey;
          secretKey = keys.secretKey;
          client = new this.Client({
            accessKey: accessKey,
            secretKey: secretKey,
            host: host,
            port: port
          });

          if (applicationId) {
            context$1$0.next = 14;
            break;
          }

          throw new Error('Required *applicationId* not provided');

        case 14:
          if (!(!filesDest && !destCallback)) {
            context$1$0.next = 16;
            break;
          }

          throw new Error('Required *filesDest* not provided');

        case 16:
          if (!(filesSrc && filesSrc.length)) {
            context$1$0.next = 32;
            break;
          }

          _filesSrc = [];

          for (i = 0, l = filesSrc.length; i < l; ++i) {
            if (typeof filesSrc[i] === 'string') {
              // TODO Replace `glob.sync` with async version
              _filesSrc = _filesSrc.concat(_glob2['default'].sync(filesSrc[i], { dot: true }));
            } else {
              _filesSrc.push(filesSrc[i]);
            }
          }

          context$1$0.next = 21;
          return regeneratorRuntime.awrap((0, _zip2.zip)(filesSrc, cwd));

        case 21:
          _zip = context$1$0.sent;
          context$1$0.next = 24;
          return regeneratorRuntime.awrap(this.removeSourceFromApplication(client, '', applicationId));

        case 24:
          removeSourceRes = context$1$0.sent;

          if (!removeSourceRes.errors) {
            context$1$0.next = 27;
            break;
          }

          throw new Error('Error removing application sources');

        case 27:
          context$1$0.next = 29;
          return regeneratorRuntime.awrap(this.addApplicationSource(client, applicationId, {
            content: _zip.generate({ type: 'base64' }),
            filename: 'application.zip',
            extension: 'zip'
          }));

        case 29:
          addApplicationSourceRes = context$1$0.sent;

          if (!addApplicationSourceRes.errors) {
            context$1$0.next = 32;
            break;
          }

          throw new Error('Error uploading files');

        case 32:
          if (!(params && Object.keys(params).length)) {
            context$1$0.next = 40;
            break;
          }

          areParametersOrdered = Array.isArray(params);
          context$1$0.next = 36;
          return regeneratorRuntime.awrap(this.updateApplication(client, {
            _id: applicationId,
            parameters: JSON.stringify(normalizeParameters(params)),
            areParametersOrdered: areParametersOrdered
          }));

        case 36:
          updateApplicationRes = context$1$0.sent;

          if (!updateApplicationRes.errors) {
            context$1$0.next = 40;
            break;
          }

          console.error(updateApplicationRes.errors);
          throw new Error('Error updating the application');

        case 40:
          context$1$0.next = 42;
          return regeneratorRuntime.awrap(this.createApplicationProtection(client, applicationId));

        case 42:
          createApplicationProtectionRes = context$1$0.sent;

          if (!createApplicationProtectionRes.errors) {
            context$1$0.next = 46;
            break;
          }

          console.error(createApplicationProtectionRes.errors);
          throw new Error('Error creating application protection');

        case 46:
          protectionId = createApplicationProtectionRes.data.createApplicationProtection._id;
          context$1$0.next = 49;
          return regeneratorRuntime.awrap(this.pollProtection(client, applicationId, protectionId));

        case 49:
          context$1$0.next = 51;
          return regeneratorRuntime.awrap(this.downloadApplicationProtection(client, protectionId));

        case 51:
          download = context$1$0.sent;

          (0, _zip2.unzip)(download, filesDest || destCallback);

        case 53:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  pollProtection: function pollProtection(client, applicationId, protectionId) {
    var deferred, poll;
    return regeneratorRuntime.async(function pollProtection$(context$1$0) {
      var _this = this;

      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          poll = function poll() {
            var applicationProtection, state;
            return regeneratorRuntime.async(function poll$(context$2$0) {
              while (1) switch (context$2$0.prev = context$2$0.next) {
                case 0:
                  context$2$0.next = 2;
                  return regeneratorRuntime.awrap(this.getApplicationProtection(client, applicationId, protectionId));

                case 2:
                  applicationProtection = context$2$0.sent;

                  if (!applicationProtection.errors) {
                    context$2$0.next = 8;
                    break;
                  }

                  throw new Error('Error polling protection');

                case 8:
                  state = applicationProtection.data.applicationProtection.state;

                  if (state !== 'finished' && state !== 'errored') {
                    setTimeout(poll, 500);
                  } else {
                    deferred.resolve();
                  }

                case 10:
                case 'end':
                  return context$2$0.stop();
              }
            }, null, _this);
          };

          poll();

          return context$1$0.abrupt('return', deferred.promise);

        case 4:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  createApplication: function createApplication(client, data, fragments) {
    var deferred;
    return regeneratorRuntime.async(function createApplication$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.post('/application', (0, _mutations.createApplication)(data, fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  duplicateApplication: function duplicateApplication(client, data, fragments) {
    var deferred;
    return regeneratorRuntime.async(function duplicateApplication$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.post('/application', (0, _mutations.duplicateApplication)(data, fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  removeApplication: function removeApplication(client, id) {
    var deferred;
    return regeneratorRuntime.async(function removeApplication$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.post('/application', (0, _mutations.removeApplication)(id), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  removeProtection: function removeProtection(client, id, appId, fragments) {
    var deferred;
    return regeneratorRuntime.async(function removeProtection$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.post('/application', (0, _mutations.removeProtection)(id, appId, fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  updateApplication: function updateApplication(client, application, fragments) {
    var deferred;
    return regeneratorRuntime.async(function updateApplication$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.post('/application', (0, _mutations.updateApplication)(application, fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  unlockApplication: function unlockApplication(client, application, fragments) {
    var deferred;
    return regeneratorRuntime.async(function unlockApplication$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.post('/application', (0, _mutations.unlockApplication)(application, fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  getApplication: function getApplication(client, applicationId, fragments) {
    var deferred;
    return regeneratorRuntime.async(function getApplication$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.get('/application', (0, _queries.getApplication)(applicationId, fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  getApplicationSource: function getApplicationSource(client, sourceId, fragments, limits) {
    var deferred;
    return regeneratorRuntime.async(function getApplicationSource$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.get('/application', (0, _queries.getApplicationSource)(sourceId, fragments, limits), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  getApplicationProtections: function getApplicationProtections(client, applicationId, params, fragments) {
    var deferred;
    return regeneratorRuntime.async(function getApplicationProtections$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.get('/application', (0, _queries.getApplicationProtections)(applicationId, params, fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  getApplicationProtectionsCount: function getApplicationProtectionsCount(client, applicationId, fragments) {
    var deferred;
    return regeneratorRuntime.async(function getApplicationProtectionsCount$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.get('/application', (0, _queries.getApplicationProtectionsCount)(applicationId, fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  createTemplate: function createTemplate(client, template, fragments) {
    var deferred;
    return regeneratorRuntime.async(function createTemplate$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.post('/application', (0, _mutations.createTemplate)(template, fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  removeTemplate: function removeTemplate(client, id) {
    var deferred;
    return regeneratorRuntime.async(function removeTemplate$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.post('/application', (0, _mutations.removeTemplate)(id), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  getTemplates: function getTemplates(client, fragments) {
    var deferred;
    return regeneratorRuntime.async(function getTemplates$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.get('/application', (0, _queries.getTemplates)(fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  getApplications: function getApplications(client, fragments) {
    var deferred;
    return regeneratorRuntime.async(function getApplications$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.get('/application', (0, _queries.getApplications)(fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  addApplicationSource: function addApplicationSource(client, applicationId, applicationSource, fragments) {
    var deferred;
    return regeneratorRuntime.async(function addApplicationSource$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.post('/application', (0, _mutations.addApplicationSource)(applicationId, applicationSource, fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  addApplicationSourceFromURL: function addApplicationSourceFromURL(client, applicationId, url, fragments) {
    var deferred;
    return regeneratorRuntime.async(function addApplicationSourceFromURL$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();
          return context$1$0.abrupt('return', getFileFromUrl(client, url).then(function (file) {
            client.post('/application', (0, _mutations.addApplicationSource)(applicationId, file, fragments), responseHandler(deferred));
            return deferred.promise;
          }).then(errorHandler));

        case 2:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  updateApplicationSource: function updateApplicationSource(client, applicationSource, fragments) {
    var deferred;
    return regeneratorRuntime.async(function updateApplicationSource$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.post('/application', (0, _mutations.updateApplicationSource)(applicationSource, fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  removeSourceFromApplication: function removeSourceFromApplication(client, sourceId, applicationId, fragments) {
    var deferred;
    return regeneratorRuntime.async(function removeSourceFromApplication$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.post('/application', (0, _mutations.removeSourceFromApplication)(sourceId, applicationId, fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  applyTemplate: function applyTemplate(client, templateId, appId, fragments) {
    var deferred;
    return regeneratorRuntime.async(function applyTemplate$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.post('/application', (0, _mutations.applyTemplate)(templateId, appId, fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  updateTemplate: function updateTemplate(client, template, fragments) {
    var deferred;
    return regeneratorRuntime.async(function updateTemplate$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.post('/application', (0, _mutations.updateTemplate)(template, fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  createApplicationProtection: function createApplicationProtection(client, applicationId, fragments) {
    var deferred;
    return regeneratorRuntime.async(function createApplicationProtection$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.post('/application', (0, _mutations.createApplicationProtection)(applicationId, fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  getApplicationProtection: function getApplicationProtection(client, applicationId, protectionId, fragments) {
    var deferred;
    return regeneratorRuntime.async(function getApplicationProtection$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.get('/application', (0, _queries.getProtection)(applicationId, protectionId, fragments), responseHandler(deferred));
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  },
  //
  downloadApplicationProtection: function downloadApplicationProtection(client, protectionId) {
    var deferred;
    return regeneratorRuntime.async(function downloadApplicationProtection$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.get('/application/download/' + protectionId, null, responseHandler(deferred), false);
          return context$1$0.abrupt('return', deferred.promise.then(errorHandler));

        case 3:
        case 'end':
          return context$1$0.stop();
      }
    }, null, this);
  }
};

function getFileFromUrl(client, url) {
  var deferred = _q2['default'].defer();
  var file;
  _axios2['default'].get(url).then(function (res) {
    file = {
      content: res.data,
      filename: _path2['default'].basename(url),
      extension: _path2['default'].extname(url).substr(1)
    };
    deferred.resolve(file);
  })['catch'](function (err) {
    deferred.reject(err);
  });
  return deferred.promise;
}

function responseHandler(deferred) {
  return function (err, res) {
    if (err) {
      deferred.reject(err);
    } else {
      var body = res.data;
      try {
        if (res.status >= 400) {
          deferred.reject(body);
        } else {
          deferred.resolve(body);
        }
      } catch (ex) {
        deferred.reject(body);
      }
    }
  };
}

function errorHandler(res) {
  if (res.errors && res.errors.length) {
    res.errors.forEach(function (error) {
      console.error(error.message);
    });
  }

  return res;
}

function normalizeParameters(parameters) {
  var result;

  if (!Array.isArray(parameters)) {
    result = [];
    Object.keys(parameters).forEach(function (name) {
      result.push({
        name: name,
        options: parameters[name]
      });
    });
  } else {
    result = parameters;
  }

  return result;
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFBTyxnQkFBZ0I7O29CQUVOLE1BQU07Ozs7b0JBQ04sTUFBTTs7OztxQkFDSCxPQUFPOzs7O2lCQUNiLEdBQUc7Ozs7c0JBRUUsVUFBVTs7OztvQ0FDSSwwQkFBMEI7Ozs7c0JBQzlCLFVBQVU7Ozs7eUJBZ0JoQyxhQUFhOzt1QkFTYixXQUFXOztvQkFJWCxPQUFPOztxQkFFQztBQUNiLFFBQU0scUJBQWtCO0FBQ3hCLFFBQU0scUJBQUE7QUFDTixzQkFBb0IsbUNBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQ3BCLEFBQU0sb0JBQWtCLEVBQUMsNEJBQUMsa0JBQWtCLEVBQUUsWUFBWTtRQUNsRCxNQUFNLEVBSVYsYUFBYSxFQUNiLElBQUksRUFDSixJQUFJLEVBQ0osSUFBSSxFQUNKLFNBQVMsRUFDVCxRQUFRLEVBQ1IsR0FBRyxFQUNILE1BQU0sRUFJTixTQUFTLEVBQ1QsU0FBUyxFQUdMLE1BQU0sRUFnQk4sU0FBUyxFQUNKLENBQUMsRUFBTSxDQUFDLEVBU1gsSUFBSSxFQUVKLGVBQWUsRUFLZix1QkFBdUIsRUFXdkIsb0JBQW9CLEVBQ3BCLG9CQUFvQixFQVd0Qiw4QkFBOEIsRUFNOUIsWUFBWSxFQUdaLFFBQVE7Ozs7O0FBcEZSLGdCQUFNLEdBQUcsT0FBTyxrQkFBa0IsS0FBSyxRQUFRLEdBQ25ELE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLGtCQUFrQjtBQUdoRCx1QkFBYSxHQVFYLE1BQU0sQ0FSUixhQUFhO0FBQ2IsY0FBSSxHQU9GLE1BQU0sQ0FQUixJQUFJO0FBQ0osY0FBSSxHQU1GLE1BQU0sQ0FOUixJQUFJO0FBQ0osY0FBSSxHQUtGLE1BQU0sQ0FMUixJQUFJO0FBQ0osbUJBQVMsR0FJUCxNQUFNLENBSlIsU0FBUztBQUNULGtCQUFRLEdBR04sTUFBTSxDQUhSLFFBQVE7QUFDUixhQUFH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QUksTUFBTSxDQUFDOztBQUVYLE1BQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQzlCLFVBQU0sR0FBRyxFQUFFLENBQUM7QUFDWixVQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBSztBQUN4QyxZQUFNLENBQUMsSUFBSSxDQUFDO0FBQ1YsWUFBSSxFQUFKLElBQUk7QUFDSixlQUFPLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQztPQUMxQixDQUFDLENBQUE7S0FDSCxDQUFDLENBQUM7R0FDSixNQUFNO0FBQ0wsVUFBTSxHQUFHLFVBQVUsQ0FBQztHQUNyQjs7QUFFRCxTQUFPLE1BQU0sQ0FBQztDQUNmIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdiYWJlbC1wb2x5ZmlsbCc7XG5cbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdheGlvcyc7XG5pbXBvcnQgUSBmcm9tICdxJztcblxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgZ2VuZXJhdGVTaWduZWRQYXJhbXMgZnJvbSAnLi9nZW5lcmF0ZS1zaWduZWQtcGFyYW1zJztcbmltcG9ydCBKU2NyYW1ibGVyQ2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCB7XG4gIGFkZEFwcGxpY2F0aW9uU291cmNlLFxuICBjcmVhdGVBcHBsaWNhdGlvbixcbiAgcmVtb3ZlQXBwbGljYXRpb24sXG4gIHVwZGF0ZUFwcGxpY2F0aW9uLFxuICB1cGRhdGVBcHBsaWNhdGlvblNvdXJjZSxcbiAgcmVtb3ZlU291cmNlRnJvbUFwcGxpY2F0aW9uLFxuICBjcmVhdGVUZW1wbGF0ZSxcbiAgcmVtb3ZlVGVtcGxhdGUsXG4gIHVwZGF0ZVRlbXBsYXRlLFxuICBjcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb24sXG4gIHJlbW92ZVByb3RlY3Rpb24sXG4gIGR1cGxpY2F0ZUFwcGxpY2F0aW9uLFxuICB1bmxvY2tBcHBsaWNhdGlvbixcbiAgYXBwbHlUZW1wbGF0ZVxufSBmcm9tICcuL211dGF0aW9ucyc7XG5pbXBvcnQge1xuICBnZXRBcHBsaWNhdGlvbixcbiAgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9ucyxcbiAgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uc0NvdW50LFxuICBnZXRBcHBsaWNhdGlvbnMsXG4gIGdldEFwcGxpY2F0aW9uU291cmNlLFxuICBnZXRUZW1wbGF0ZXMsXG4gIGdldFByb3RlY3Rpb25cbn0gZnJvbSAnLi9xdWVyaWVzJztcbmltcG9ydCB7XG4gIHppcCxcbiAgdW56aXBcbn0gZnJvbSAnLi96aXAnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIENsaWVudDogSlNjcmFtYmxlckNsaWVudCxcbiAgY29uZmlnLFxuICBnZW5lcmF0ZVNpZ25lZFBhcmFtcyxcbiAgLy8gVGhpcyBtZXRob2QgaXMgYSBzaG9ydGN1dCBtZXRob2QgdGhhdCBhY2NlcHRzIGFuIG9iamVjdCB3aXRoIGV2ZXJ5dGhpbmcgbmVlZGVkXG4gIC8vIGZvciB0aGUgZW50aXJlIHByb2Nlc3Mgb2YgcmVxdWVzdGluZyBhbiBhcHBsaWNhdGlvbiBwcm90ZWN0aW9uIGFuZCBkb3dubG9hZGluZ1xuICAvLyB0aGF0IHNhbWUgcHJvdGVjdGlvbiB3aGVuIHRoZSBzYW1lIGVuZHMuXG4gIC8vXG4gIC8vIGBjb25maWdQYXRoT3JPYmplY3RgIGNhbiBiZSBhIHBhdGggdG8gYSBKU09OIG9yIGRpcmVjdGx5IGFuIG9iamVjdCBjb250YWluaW5nXG4gIC8vIHRoZSBmb2xsb3dpbmcgc3RydWN0dXJlOlxuICAvL1xuICAvLyBgYGBqc29uXG4gIC8vIHtcbiAgLy8gICBcImtleXNcIjoge1xuICAvLyAgICAgXCJhY2Nlc3NLZXlcIjogXCJcIixcbiAgLy8gICAgIFwic2VjcmV0S2V5XCI6IFwiXCJcbiAgLy8gICB9LFxuICAvLyAgIFwiYXBwbGljYXRpb25JZFwiOiBcIlwiLFxuICAvLyAgIFwiZmlsZXNEZXN0XCI6IFwiXCJcbiAgLy8gfVxuICAvLyBgYGBcbiAgLy9cbiAgLy8gQWxzbyB0aGUgZm9sbG93aW5nIG9wdGlvbmFsIHBhcmFtZXRlcnMgYXJlIGFjY2VwdGVkOlxuICAvL1xuICAvLyBgYGBqc29uXG4gIC8vIHtcbiAgLy8gICBcImZpbGVzU3JjXCI6IFtcIlwiXSxcbiAgLy8gICBcInBhcmFtc1wiOiB7fSxcbiAgLy8gICBcImN3ZFwiOiBcIlwiLFxuICAvLyAgIFwiaG9zdFwiOiBcImFwaS5qc2NyYW1ibGVyLmNvbVwiLFxuICAvLyAgIFwicG9ydFwiOiBcIjQ0M1wiXG4gIC8vIH1cbiAgLy8gYGBgXG4gIC8vXG4gIC8vIGBmaWxlc1NyY2Agc3VwcG9ydHMgZ2xvYiBwYXR0ZXJucywgYW5kIGlmIGl0J3MgcHJvdmlkZWQgaXQgd2lsbCByZXBsYWNlIHRoZVxuICAvLyBlbnRpcmUgYXBwbGljYXRpb24gc291cmNlcy5cbiAgLy9cbiAgLy8gYHBhcmFtc2AgaWYgcHJvdmlkZWQgd2lsbCByZXBsYWNlIGFsbCB0aGUgYXBwbGljYXRpb24gdHJhbnNmb3JtYXRpb24gcGFyYW1ldGVycy5cbiAgLy9cbiAgLy8gYGN3ZGAgYWxsb3dzIHlvdSB0byBzZXQgdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkgdG8gcmVzb2x2ZSBwcm9ibGVtcyB3aXRoXG4gIC8vIHJlbGF0aXZlIHBhdGhzIHdpdGggeW91ciBgZmlsZXNTcmNgIGlzIG91dHNpZGUgdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuXG4gIC8vXG4gIC8vIEZpbmFsbHksIGBob3N0YCBhbmQgYHBvcnRgIGNhbiBiZSBvdmVycmlkZGVuIGlmIHlvdSB0byBlbmdhZ2Ugd2l0aCBhIGRpZmZlcmVudFxuICAvLyBlbmRwb2ludCB0aGFuIHRoZSBkZWZhdWx0IG9uZSwgdXNlZnVsIGlmIHlvdSdyZSBydW5uaW5nIGFuIGVudGVycHJpc2UgdmVyc2lvbiBvZlxuICAvLyBKc2NyYW1ibGVyIG9yIGlmIHlvdSdyZSBwcm92aWRlZCBhY2Nlc3MgdG8gYmV0YSBmZWF0dXJlcyBvZiBvdXIgcHJvZHVjdC5cbiAgLy9cbiAgYXN5bmMgcHJvdGVjdEFuZERvd25sb2FkIChjb25maWdQYXRoT3JPYmplY3QsIGRlc3RDYWxsYmFjaykge1xuICAgIGNvbnN0IGNvbmZpZyA9IHR5cGVvZiBjb25maWdQYXRoT3JPYmplY3QgPT09ICdzdHJpbmcnID9cbiAgICAgIHJlcXVpcmUoY29uZmlnUGF0aE9yT2JqZWN0KSA6IGNvbmZpZ1BhdGhPck9iamVjdDtcblxuICAgIGNvbnN0IHtcbiAgICAgIGFwcGxpY2F0aW9uSWQsXG4gICAgICBob3N0LFxuICAgICAgcG9ydCxcbiAgICAgIGtleXMsXG4gICAgICBmaWxlc0Rlc3QsXG4gICAgICBmaWxlc1NyYyxcbiAgICAgIGN3ZCxcbiAgICAgIHBhcmFtc1xuICAgIH0gPSBjb25maWc7XG5cbiAgICBjb25zdCB7XG4gICAgICBhY2Nlc3NLZXksXG4gICAgICBzZWNyZXRLZXlcbiAgICB9ID0ga2V5cztcblxuICAgIGNvbnN0IGNsaWVudCA9IG5ldyB0aGlzLkNsaWVudCh7XG4gICAgICBhY2Nlc3NLZXksXG4gICAgICBzZWNyZXRLZXksXG4gICAgICBob3N0LFxuICAgICAgcG9ydFxuICAgIH0pO1xuXG4gICAgaWYgKCFhcHBsaWNhdGlvbklkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkICphcHBsaWNhdGlvbklkKiBub3QgcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoIWZpbGVzRGVzdCAmJiAhZGVzdENhbGxiYWNrKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkICpmaWxlc0Rlc3QqIG5vdCBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIGlmIChmaWxlc1NyYyAmJiBmaWxlc1NyYy5sZW5ndGgpIHtcbiAgICAgIGxldCBfZmlsZXNTcmMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZmlsZXNTcmMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZmlsZXNTcmNbaV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgLy8gVE9ETyBSZXBsYWNlIGBnbG9iLnN5bmNgIHdpdGggYXN5bmMgdmVyc2lvblxuICAgICAgICAgIF9maWxlc1NyYyA9IF9maWxlc1NyYy5jb25jYXQoZ2xvYi5zeW5jKGZpbGVzU3JjW2ldLCB7ZG90OiB0cnVlfSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9maWxlc1NyYy5wdXNoKGZpbGVzU3JjW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBfemlwID0gYXdhaXQgemlwKGZpbGVzU3JjLCBjd2QpO1xuXG4gICAgICBjb25zdCByZW1vdmVTb3VyY2VSZXMgPSBhd2FpdCB0aGlzLnJlbW92ZVNvdXJjZUZyb21BcHBsaWNhdGlvbihjbGllbnQsICcnLCBhcHBsaWNhdGlvbklkKTtcbiAgICAgIGlmIChyZW1vdmVTb3VyY2VSZXMuZXJyb3JzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgcmVtb3ZpbmcgYXBwbGljYXRpb24gc291cmNlcycpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBhZGRBcHBsaWNhdGlvblNvdXJjZVJlcyA9IGF3YWl0IHRoaXMuYWRkQXBwbGljYXRpb25Tb3VyY2UoY2xpZW50LCBhcHBsaWNhdGlvbklkLCB7XG4gICAgICAgIGNvbnRlbnQ6IF96aXAuZ2VuZXJhdGUoe3R5cGU6ICdiYXNlNjQnfSksXG4gICAgICAgIGZpbGVuYW1lOiAnYXBwbGljYXRpb24uemlwJyxcbiAgICAgICAgZXh0ZW5zaW9uOiAnemlwJ1xuICAgICAgfSk7XG4gICAgICBpZiAoYWRkQXBwbGljYXRpb25Tb3VyY2VSZXMuZXJyb3JzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgdXBsb2FkaW5nIGZpbGVzJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcyAmJiBPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCkge1xuICAgICAgY29uc3QgYXJlUGFyYW1ldGVyc09yZGVyZWQgPSBBcnJheS5pc0FycmF5KHBhcmFtcyk7XG4gICAgICBjb25zdCB1cGRhdGVBcHBsaWNhdGlvblJlcyA9IGF3YWl0IHRoaXMudXBkYXRlQXBwbGljYXRpb24oY2xpZW50LCB7XG4gICAgICAgIF9pZDogYXBwbGljYXRpb25JZCxcbiAgICAgICAgcGFyYW1ldGVyczogSlNPTi5zdHJpbmdpZnkobm9ybWFsaXplUGFyYW1ldGVycyhwYXJhbXMpKSxcbiAgICAgICAgYXJlUGFyYW1ldGVyc09yZGVyZWRcbiAgICAgIH0pO1xuICAgICAgaWYgKHVwZGF0ZUFwcGxpY2F0aW9uUmVzLmVycm9ycykge1xuICAgICAgICBjb25zb2xlLmVycm9yKHVwZGF0ZUFwcGxpY2F0aW9uUmVzLmVycm9ycyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgdXBkYXRpbmcgdGhlIGFwcGxpY2F0aW9uJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uUmVzID0gYXdhaXQgdGhpcy5jcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb24oY2xpZW50LCBhcHBsaWNhdGlvbklkKTtcbiAgICBpZiAoY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uUmVzLmVycm9ycykge1xuICAgICAgY29uc29sZS5lcnJvcihjcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb25SZXMuZXJyb3JzKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgY3JlYXRpbmcgYXBwbGljYXRpb24gcHJvdGVjdGlvbicpO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3RlY3Rpb25JZCA9IGNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvblJlcy5kYXRhLmNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvbi5faWQ7XG4gICAgYXdhaXQgdGhpcy5wb2xsUHJvdGVjdGlvbihjbGllbnQsIGFwcGxpY2F0aW9uSWQsIHByb3RlY3Rpb25JZCk7XG5cbiAgICBjb25zdCBkb3dubG9hZCA9IGF3YWl0IHRoaXMuZG93bmxvYWRBcHBsaWNhdGlvblByb3RlY3Rpb24oY2xpZW50LCBwcm90ZWN0aW9uSWQpO1xuICAgIHVuemlwKGRvd25sb2FkLCBmaWxlc0Rlc3QgfHwgZGVzdENhbGxiYWNrKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgcG9sbFByb3RlY3Rpb24gKGNsaWVudCwgYXBwbGljYXRpb25JZCwgcHJvdGVjdGlvbklkKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgICBjb25zdCBwb2xsID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwbGljYXRpb25Qcm90ZWN0aW9uID0gYXdhaXQgdGhpcy5nZXRBcHBsaWNhdGlvblByb3RlY3Rpb24oY2xpZW50LCBhcHBsaWNhdGlvbklkLCBwcm90ZWN0aW9uSWQpO1xuICAgICAgaWYgKGFwcGxpY2F0aW9uUHJvdGVjdGlvbi5lcnJvcnMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBwb2xsaW5nIHByb3RlY3Rpb24nKTtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdFcnJvciBwb2xsaW5nIHByb3RlY3Rpb24nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gYXBwbGljYXRpb25Qcm90ZWN0aW9uLmRhdGEuYXBwbGljYXRpb25Qcm90ZWN0aW9uLnN0YXRlO1xuICAgICAgICBpZiAoc3RhdGUgIT09ICdmaW5pc2hlZCcgJiYgc3RhdGUgIT09ICdlcnJvcmVkJykge1xuICAgICAgICAgIHNldFRpbWVvdXQocG9sbCwgNTAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcG9sbCgpO1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGNyZWF0ZUFwcGxpY2F0aW9uIChjbGllbnQsIGRhdGEsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCBjcmVhdGVBcHBsaWNhdGlvbihkYXRhLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGR1cGxpY2F0ZUFwcGxpY2F0aW9uIChjbGllbnQsIGRhdGEsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCBkdXBsaWNhdGVBcHBsaWNhdGlvbihkYXRhLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHJlbW92ZUFwcGxpY2F0aW9uIChjbGllbnQsIGlkKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHJlbW92ZUFwcGxpY2F0aW9uKGlkKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyByZW1vdmVQcm90ZWN0aW9uIChjbGllbnQsIGlkLCBhcHBJZCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHJlbW92ZVByb3RlY3Rpb24oaWQsIGFwcElkLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHVwZGF0ZUFwcGxpY2F0aW9uIChjbGllbnQsIGFwcGxpY2F0aW9uLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgdXBkYXRlQXBwbGljYXRpb24oYXBwbGljYXRpb24sIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgdW5sb2NrQXBwbGljYXRpb24gKGNsaWVudCwgYXBwbGljYXRpb24sIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCB1bmxvY2tBcHBsaWNhdGlvbihhcHBsaWNhdGlvbiwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBnZXRBcHBsaWNhdGlvbiAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KCcvYXBwbGljYXRpb24nLCBnZXRBcHBsaWNhdGlvbihhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGdldEFwcGxpY2F0aW9uU291cmNlIChjbGllbnQsIHNvdXJjZUlkLCBmcmFnbWVudHMsIGxpbWl0cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldEFwcGxpY2F0aW9uU291cmNlKHNvdXJjZUlkLCBmcmFnbWVudHMsIGxpbWl0cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9ucyAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBwYXJhbXMsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnMoYXBwbGljYXRpb25JZCwgcGFyYW1zLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNDb3VudCAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KCcvYXBwbGljYXRpb24nLCBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zQ291bnQoYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBjcmVhdGVUZW1wbGF0ZSAoY2xpZW50LCB0ZW1wbGF0ZSwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIGNyZWF0ZVRlbXBsYXRlKHRlbXBsYXRlLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHJlbW92ZVRlbXBsYXRlIChjbGllbnQsIGlkKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHJlbW92ZVRlbXBsYXRlKGlkKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBnZXRUZW1wbGF0ZXMgKGNsaWVudCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LmdldCgnL2FwcGxpY2F0aW9uJywgZ2V0VGVtcGxhdGVzKGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZ2V0QXBwbGljYXRpb25zIChjbGllbnQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldEFwcGxpY2F0aW9ucyhmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGFkZEFwcGxpY2F0aW9uU291cmNlIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIGFwcGxpY2F0aW9uU291cmNlLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgYWRkQXBwbGljYXRpb25Tb3VyY2UoYXBwbGljYXRpb25JZCwgYXBwbGljYXRpb25Tb3VyY2UsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgYWRkQXBwbGljYXRpb25Tb3VyY2VGcm9tVVJMIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIHVybCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgcmV0dXJuIGdldEZpbGVGcm9tVXJsKGNsaWVudCwgdXJsKVxuICAgICAgLnRoZW4oZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgYWRkQXBwbGljYXRpb25Tb3VyY2UoYXBwbGljYXRpb25JZCwgZmlsZSwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlIChjbGllbnQsIGFwcGxpY2F0aW9uU291cmNlLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgdXBkYXRlQXBwbGljYXRpb25Tb3VyY2UoYXBwbGljYXRpb25Tb3VyY2UsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgcmVtb3ZlU291cmNlRnJvbUFwcGxpY2F0aW9uIChjbGllbnQsIHNvdXJjZUlkLCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgcmVtb3ZlU291cmNlRnJvbUFwcGxpY2F0aW9uKHNvdXJjZUlkLCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGFwcGx5VGVtcGxhdGUgKGNsaWVudCwgdGVtcGxhdGVJZCwgYXBwSWQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCBhcHBseVRlbXBsYXRlKHRlbXBsYXRlSWQsIGFwcElkLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHVwZGF0ZVRlbXBsYXRlIChjbGllbnQsIHRlbXBsYXRlLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgdXBkYXRlVGVtcGxhdGUodGVtcGxhdGUsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCBjcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb24oYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb24gKGNsaWVudCwgYXBwbGljYXRpb25JZCwgcHJvdGVjdGlvbklkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KCcvYXBwbGljYXRpb24nLCBnZXRQcm90ZWN0aW9uKGFwcGxpY2F0aW9uSWQsIHByb3RlY3Rpb25JZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBkb3dubG9hZEFwcGxpY2F0aW9uUHJvdGVjdGlvbiAoY2xpZW50LCBwcm90ZWN0aW9uSWQpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KGAvYXBwbGljYXRpb24vZG93bmxvYWQvJHtwcm90ZWN0aW9uSWR9YCwgbnVsbCwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSwgZmFsc2UpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZ2V0RmlsZUZyb21VcmwgKGNsaWVudCwgdXJsKSB7XG4gIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICB2YXIgZmlsZTtcbiAgcmVxdWVzdC5nZXQodXJsKVxuICAgIC50aGVuKChyZXMpID0+IHtcbiAgICAgIGZpbGUgPSB7XG4gICAgICAgIGNvbnRlbnQ6IHJlcy5kYXRhLFxuICAgICAgICBmaWxlbmFtZTogcGF0aC5iYXNlbmFtZSh1cmwpLFxuICAgICAgICBleHRlbnNpb246IHBhdGguZXh0bmFtZSh1cmwpLnN1YnN0cigxKVxuICAgICAgfTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoZmlsZSk7XG4gICAgfSlcbiAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5mdW5jdGlvbiByZXNwb25zZUhhbmRsZXIgKGRlZmVycmVkKSB7XG4gIHJldHVybiAoZXJyLCByZXMpID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJvZHkgPSByZXMuZGF0YTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChyZXMuc3RhdHVzID49IDQwMCkge1xuICAgICAgICAgIGRlZmVycmVkLnJlamVjdChib2R5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGJvZHkpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoYm9keSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBlcnJvckhhbmRsZXIgKHJlcykge1xuICBpZiAocmVzLmVycm9ycyAmJiByZXMuZXJyb3JzLmxlbmd0aCkge1xuICAgIHJlcy5lcnJvcnMuZm9yRWFjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVQYXJhbWV0ZXJzIChwYXJhbWV0ZXJzKSB7XG4gIHZhciByZXN1bHQ7XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KHBhcmFtZXRlcnMpKSB7XG4gICAgcmVzdWx0ID0gW107XG4gICAgT2JqZWN0LmtleXMocGFyYW1ldGVycykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICBuYW1lLFxuICAgICAgICBvcHRpb25zOiBwYXJhbWV0ZXJzW25hbWVdXG4gICAgICB9KVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9IHBhcmFtZXRlcnM7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIl19
