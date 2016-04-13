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
  getApplicationSource: function getApplicationSource(client, sourceId, fragments) {
    var deferred;
    return regeneratorRuntime.async(function getApplicationSource$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          deferred = _q2['default'].defer();

          client.get('/application', (0, _queries.getApplicationSource)(sourceId, fragments), responseHandler(deferred));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7UUFBTyxnQkFBZ0I7O29CQUVOLE1BQU07Ozs7b0JBQ04sTUFBTTs7OztxQkFDSCxPQUFPOzs7O2lCQUNiLEdBQUc7Ozs7c0JBRUUsVUFBVTs7OztvQ0FDSSwwQkFBMEI7Ozs7c0JBQzlCLFVBQVU7Ozs7eUJBZWhDLGFBQWE7O3VCQVNiLFdBQVc7O29CQUlYLE9BQU87O3FCQUVDO0FBQ2IsUUFBTSxxQkFBa0I7QUFDeEIsUUFBTSxxQkFBQTtBQUNOLHNCQUFvQixtQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJDcEIsQUFBTSxvQkFBa0IsRUFBQyw0QkFBQyxrQkFBa0IsRUFBRSxZQUFZO1FBQ2xELE1BQU0sRUFJVixhQUFhLEVBQ2IsSUFBSSxFQUNKLElBQUksRUFDSixJQUFJLEVBQ0osU0FBUyxFQUNULFFBQVEsRUFDUixHQUFHLEVBQ0gsTUFBTSxFQUlOLFNBQVMsRUFDVCxTQUFTLEVBR0wsTUFBTSxFQWdCTixTQUFTLEVBQ0osQ0FBQyxFQUFNLENBQUMsRUFTWCxJQUFJLEVBRUosZUFBZSxFQUtmLHVCQUF1QixFQVd2QixvQkFBb0IsRUFDcEIsb0JBQW9CLEVBV3RCLDhCQUE4QixFQU05QixZQUFZLEVBR1osUUFBUTs7Ozs7QUFwRlIsZ0JBQU0sR0FBRyxPQUFPLGtCQUFrQixLQUFLLFFBQVEsR0FDbkQsT0FBTyxDQUFDLGtCQUFrQixDQUFDLEdBQUcsa0JBQWtCO0FBR2hELHVCQUFhLEdBUVgsTUFBTSxDQVJSLGFBQWE7QUFDYixjQUFJLEdBT0YsTUFBTSxDQVBSLElBQUk7QUFDSixjQUFJLEdBTUYsTUFBTSxDQU5SLElBQUk7QUFDSixjQUFJLEdBS0YsTUFBTSxDQUxSLElBQUk7QUFDSixtQkFBUyxHQUlQLE1BQU0sQ0FKUixTQUFTO0FBQ1Qsa0JBQVEsR0FHTixNQUFNLENBSFIsUUFBUTtBQUNSLGFBQUcs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LENBQUM7R0FDckI7O0FBRUQsU0FBTyxNQUFNLENBQUM7Q0FDZiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnYmFiZWwtcG9seWZpbGwnO1xuXG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHJlcXVlc3QgZnJvbSAnYXhpb3MnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5cbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IGdlbmVyYXRlU2lnbmVkUGFyYW1zIGZyb20gJy4vZ2VuZXJhdGUtc2lnbmVkLXBhcmFtcyc7XG5pbXBvcnQgSlNjcmFtYmxlckNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQge1xuICBhZGRBcHBsaWNhdGlvblNvdXJjZSxcbiAgY3JlYXRlQXBwbGljYXRpb24sXG4gIHJlbW92ZUFwcGxpY2F0aW9uLFxuICB1cGRhdGVBcHBsaWNhdGlvbixcbiAgdXBkYXRlQXBwbGljYXRpb25Tb3VyY2UsXG4gIHJlbW92ZVNvdXJjZUZyb21BcHBsaWNhdGlvbixcbiAgY3JlYXRlVGVtcGxhdGUsXG4gIHJlbW92ZVRlbXBsYXRlLFxuICB1cGRhdGVUZW1wbGF0ZSxcbiAgY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uLFxuICByZW1vdmVQcm90ZWN0aW9uLFxuICBkdXBsaWNhdGVBcHBsaWNhdGlvbixcbiAgdW5sb2NrQXBwbGljYXRpb25cbn0gZnJvbSAnLi9tdXRhdGlvbnMnO1xuaW1wb3J0IHtcbiAgZ2V0QXBwbGljYXRpb24sXG4gIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnMsXG4gIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNDb3VudCxcbiAgZ2V0QXBwbGljYXRpb25zLFxuICBnZXRBcHBsaWNhdGlvblNvdXJjZSxcbiAgZ2V0VGVtcGxhdGVzLFxuICBnZXRQcm90ZWN0aW9uXG59IGZyb20gJy4vcXVlcmllcyc7XG5pbXBvcnQge1xuICB6aXAsXG4gIHVuemlwXG59IGZyb20gJy4vemlwJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBDbGllbnQ6IEpTY3JhbWJsZXJDbGllbnQsXG4gIGNvbmZpZyxcbiAgZ2VuZXJhdGVTaWduZWRQYXJhbXMsXG4gIC8vIFRoaXMgbWV0aG9kIGlzIGEgc2hvcnRjdXQgbWV0aG9kIHRoYXQgYWNjZXB0cyBhbiBvYmplY3Qgd2l0aCBldmVyeXRoaW5nIG5lZWRlZFxuICAvLyBmb3IgdGhlIGVudGlyZSBwcm9jZXNzIG9mIHJlcXVlc3RpbmcgYW4gYXBwbGljYXRpb24gcHJvdGVjdGlvbiBhbmQgZG93bmxvYWRpbmdcbiAgLy8gdGhhdCBzYW1lIHByb3RlY3Rpb24gd2hlbiB0aGUgc2FtZSBlbmRzLlxuICAvL1xuICAvLyBgY29uZmlnUGF0aE9yT2JqZWN0YCBjYW4gYmUgYSBwYXRoIHRvIGEgSlNPTiBvciBkaXJlY3RseSBhbiBvYmplY3QgY29udGFpbmluZ1xuICAvLyB0aGUgZm9sbG93aW5nIHN0cnVjdHVyZTpcbiAgLy9cbiAgLy8gYGBganNvblxuICAvLyB7XG4gIC8vICAgXCJrZXlzXCI6IHtcbiAgLy8gICAgIFwiYWNjZXNzS2V5XCI6IFwiXCIsXG4gIC8vICAgICBcInNlY3JldEtleVwiOiBcIlwiXG4gIC8vICAgfSxcbiAgLy8gICBcImFwcGxpY2F0aW9uSWRcIjogXCJcIixcbiAgLy8gICBcImZpbGVzRGVzdFwiOiBcIlwiXG4gIC8vIH1cbiAgLy8gYGBgXG4gIC8vXG4gIC8vIEFsc28gdGhlIGZvbGxvd2luZyBvcHRpb25hbCBwYXJhbWV0ZXJzIGFyZSBhY2NlcHRlZDpcbiAgLy9cbiAgLy8gYGBganNvblxuICAvLyB7XG4gIC8vICAgXCJmaWxlc1NyY1wiOiBbXCJcIl0sXG4gIC8vICAgXCJwYXJhbXNcIjoge30sXG4gIC8vICAgXCJjd2RcIjogXCJcIixcbiAgLy8gICBcImhvc3RcIjogXCJhcGkuanNjcmFtYmxlci5jb21cIixcbiAgLy8gICBcInBvcnRcIjogXCI0NDNcIlxuICAvLyB9XG4gIC8vIGBgYFxuICAvL1xuICAvLyBgZmlsZXNTcmNgIHN1cHBvcnRzIGdsb2IgcGF0dGVybnMsIGFuZCBpZiBpdCdzIHByb3ZpZGVkIGl0IHdpbGwgcmVwbGFjZSB0aGVcbiAgLy8gZW50aXJlIGFwcGxpY2F0aW9uIHNvdXJjZXMuXG4gIC8vXG4gIC8vIGBwYXJhbXNgIGlmIHByb3ZpZGVkIHdpbGwgcmVwbGFjZSBhbGwgdGhlIGFwcGxpY2F0aW9uIHRyYW5zZm9ybWF0aW9uIHBhcmFtZXRlcnMuXG4gIC8vXG4gIC8vIGBjd2RgIGFsbG93cyB5b3UgdG8gc2V0IHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5IHRvIHJlc29sdmUgcHJvYmxlbXMgd2l0aFxuICAvLyByZWxhdGl2ZSBwYXRocyB3aXRoIHlvdXIgYGZpbGVzU3JjYCBpcyBvdXRzaWRlIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LlxuICAvL1xuICAvLyBGaW5hbGx5LCBgaG9zdGAgYW5kIGBwb3J0YCBjYW4gYmUgb3ZlcnJpZGRlbiBpZiB5b3UgdG8gZW5nYWdlIHdpdGggYSBkaWZmZXJlbnRcbiAgLy8gZW5kcG9pbnQgdGhhbiB0aGUgZGVmYXVsdCBvbmUsIHVzZWZ1bCBpZiB5b3UncmUgcnVubmluZyBhbiBlbnRlcnByaXNlIHZlcnNpb24gb2ZcbiAgLy8gSnNjcmFtYmxlciBvciBpZiB5b3UncmUgcHJvdmlkZWQgYWNjZXNzIHRvIGJldGEgZmVhdHVyZXMgb2Ygb3VyIHByb2R1Y3QuXG4gIC8vXG4gIGFzeW5jIHByb3RlY3RBbmREb3dubG9hZCAoY29uZmlnUGF0aE9yT2JqZWN0LCBkZXN0Q2FsbGJhY2spIHtcbiAgICBjb25zdCBjb25maWcgPSB0eXBlb2YgY29uZmlnUGF0aE9yT2JqZWN0ID09PSAnc3RyaW5nJyA/XG4gICAgICByZXF1aXJlKGNvbmZpZ1BhdGhPck9iamVjdCkgOiBjb25maWdQYXRoT3JPYmplY3Q7XG5cbiAgICBjb25zdCB7XG4gICAgICBhcHBsaWNhdGlvbklkLFxuICAgICAgaG9zdCxcbiAgICAgIHBvcnQsXG4gICAgICBrZXlzLFxuICAgICAgZmlsZXNEZXN0LFxuICAgICAgZmlsZXNTcmMsXG4gICAgICBjd2QsXG4gICAgICBwYXJhbXNcbiAgICB9ID0gY29uZmlnO1xuXG4gICAgY29uc3Qge1xuICAgICAgYWNjZXNzS2V5LFxuICAgICAgc2VjcmV0S2V5XG4gICAgfSA9IGtleXM7XG5cbiAgICBjb25zdCBjbGllbnQgPSBuZXcgdGhpcy5DbGllbnQoe1xuICAgICAgYWNjZXNzS2V5LFxuICAgICAgc2VjcmV0S2V5LFxuICAgICAgaG9zdCxcbiAgICAgIHBvcnRcbiAgICB9KTtcblxuICAgIGlmICghYXBwbGljYXRpb25JZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXF1aXJlZCAqYXBwbGljYXRpb25JZCogbm90IHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKCFmaWxlc0Rlc3QgJiYgIWRlc3RDYWxsYmFjaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXF1aXJlZCAqZmlsZXNEZXN0KiBub3QgcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoZmlsZXNTcmMgJiYgZmlsZXNTcmMubGVuZ3RoKSB7XG4gICAgICBsZXQgX2ZpbGVzU3JjID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGZpbGVzU3JjLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICBpZiAodHlwZW9mIGZpbGVzU3JjW2ldID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIC8vIFRPRE8gUmVwbGFjZSBgZ2xvYi5zeW5jYCB3aXRoIGFzeW5jIHZlcnNpb25cbiAgICAgICAgICBfZmlsZXNTcmMgPSBfZmlsZXNTcmMuY29uY2F0KGdsb2Iuc3luYyhmaWxlc1NyY1tpXSwge2RvdDogdHJ1ZX0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfZmlsZXNTcmMucHVzaChmaWxlc1NyY1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgX3ppcCA9IGF3YWl0IHppcChmaWxlc1NyYywgY3dkKTtcblxuICAgICAgY29uc3QgcmVtb3ZlU291cmNlUmVzID0gYXdhaXQgdGhpcy5yZW1vdmVTb3VyY2VGcm9tQXBwbGljYXRpb24oY2xpZW50LCAnJywgYXBwbGljYXRpb25JZCk7XG4gICAgICBpZiAocmVtb3ZlU291cmNlUmVzLmVycm9ycykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIHJlbW92aW5nIGFwcGxpY2F0aW9uIHNvdXJjZXMnKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYWRkQXBwbGljYXRpb25Tb3VyY2VSZXMgPSBhd2FpdCB0aGlzLmFkZEFwcGxpY2F0aW9uU291cmNlKGNsaWVudCwgYXBwbGljYXRpb25JZCwge1xuICAgICAgICBjb250ZW50OiBfemlwLmdlbmVyYXRlKHt0eXBlOiAnYmFzZTY0J30pLFxuICAgICAgICBmaWxlbmFtZTogJ2FwcGxpY2F0aW9uLnppcCcsXG4gICAgICAgIGV4dGVuc2lvbjogJ3ppcCdcbiAgICAgIH0pO1xuICAgICAgaWYgKGFkZEFwcGxpY2F0aW9uU291cmNlUmVzLmVycm9ycykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIHVwbG9hZGluZyBmaWxlcycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwYXJhbXMgJiYgT2JqZWN0LmtleXMocGFyYW1zKS5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGFyZVBhcmFtZXRlcnNPcmRlcmVkID0gQXJyYXkuaXNBcnJheShwYXJhbXMpO1xuICAgICAgY29uc3QgdXBkYXRlQXBwbGljYXRpb25SZXMgPSBhd2FpdCB0aGlzLnVwZGF0ZUFwcGxpY2F0aW9uKGNsaWVudCwge1xuICAgICAgICBfaWQ6IGFwcGxpY2F0aW9uSWQsXG4gICAgICAgIHBhcmFtZXRlcnM6IEpTT04uc3RyaW5naWZ5KG5vcm1hbGl6ZVBhcmFtZXRlcnMocGFyYW1zKSksXG4gICAgICAgIGFyZVBhcmFtZXRlcnNPcmRlcmVkXG4gICAgICB9KTtcbiAgICAgIGlmICh1cGRhdGVBcHBsaWNhdGlvblJlcy5lcnJvcnMpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih1cGRhdGVBcHBsaWNhdGlvblJlcy5lcnJvcnMpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIHVwZGF0aW5nIHRoZSBhcHBsaWNhdGlvbicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvblJlcyA9IGF3YWl0IHRoaXMuY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uKGNsaWVudCwgYXBwbGljYXRpb25JZCk7XG4gICAgaWYgKGNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvblJlcy5lcnJvcnMpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uUmVzLmVycm9ycyk7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGNyZWF0aW5nIGFwcGxpY2F0aW9uIHByb3RlY3Rpb24nKTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm90ZWN0aW9uSWQgPSBjcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb25SZXMuZGF0YS5jcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb24uX2lkO1xuICAgIGF3YWl0IHRoaXMucG9sbFByb3RlY3Rpb24oY2xpZW50LCBhcHBsaWNhdGlvbklkLCBwcm90ZWN0aW9uSWQpO1xuXG4gICAgY29uc3QgZG93bmxvYWQgPSBhd2FpdCB0aGlzLmRvd25sb2FkQXBwbGljYXRpb25Qcm90ZWN0aW9uKGNsaWVudCwgcHJvdGVjdGlvbklkKTtcbiAgICB1bnppcChkb3dubG9hZCwgZmlsZXNEZXN0IHx8IGRlc3RDYWxsYmFjayk7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHBvbGxQcm90ZWN0aW9uIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIHByb3RlY3Rpb25JZCkge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gICAgY29uc3QgcG9sbCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcGxpY2F0aW9uUHJvdGVjdGlvbiA9IGF3YWl0IHRoaXMuZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uKGNsaWVudCwgYXBwbGljYXRpb25JZCwgcHJvdGVjdGlvbklkKTtcbiAgICAgIGlmIChhcHBsaWNhdGlvblByb3RlY3Rpb24uZXJyb3JzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgcG9sbGluZyBwcm90ZWN0aW9uJyk7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdCgnRXJyb3IgcG9sbGluZyBwcm90ZWN0aW9uJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IGFwcGxpY2F0aW9uUHJvdGVjdGlvbi5kYXRhLmFwcGxpY2F0aW9uUHJvdGVjdGlvbi5zdGF0ZTtcbiAgICAgICAgaWYgKHN0YXRlICE9PSAnZmluaXNoZWQnICYmIHN0YXRlICE9PSAnZXJyb3JlZCcpIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KHBvbGwsIDUwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBvbGwoKTtcblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyBjcmVhdGVBcHBsaWNhdGlvbiAoY2xpZW50LCBkYXRhLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgY3JlYXRlQXBwbGljYXRpb24oZGF0YSwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBkdXBsaWNhdGVBcHBsaWNhdGlvbiAoY2xpZW50LCBkYXRhLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgZHVwbGljYXRlQXBwbGljYXRpb24oZGF0YSwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyByZW1vdmVBcHBsaWNhdGlvbiAoY2xpZW50LCBpZCkge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCByZW1vdmVBcHBsaWNhdGlvbihpZCksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgcmVtb3ZlUHJvdGVjdGlvbiAoY2xpZW50LCBpZCwgYXBwSWQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCByZW1vdmVQcm90ZWN0aW9uKGlkLCBhcHBJZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyB1cGRhdGVBcHBsaWNhdGlvbiAoY2xpZW50LCBhcHBsaWNhdGlvbiwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHVwZGF0ZUFwcGxpY2F0aW9uKGFwcGxpY2F0aW9uLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHVubG9ja0FwcGxpY2F0aW9uIChjbGllbnQsIGFwcGxpY2F0aW9uLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgdW5sb2NrQXBwbGljYXRpb24oYXBwbGljYXRpb24sIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZ2V0QXBwbGljYXRpb24gKGNsaWVudCwgYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LmdldCgnL2FwcGxpY2F0aW9uJywgZ2V0QXBwbGljYXRpb24oYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBnZXRBcHBsaWNhdGlvblNvdXJjZSAoY2xpZW50LCBzb3VyY2VJZCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LmdldCgnL2FwcGxpY2F0aW9uJywgZ2V0QXBwbGljYXRpb25Tb3VyY2Uoc291cmNlSWQsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9ucyAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBwYXJhbXMsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnMoYXBwbGljYXRpb25JZCwgcGFyYW1zLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNDb3VudCAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KCcvYXBwbGljYXRpb24nLCBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zQ291bnQoYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBjcmVhdGVUZW1wbGF0ZSAoY2xpZW50LCB0ZW1wbGF0ZSwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIGNyZWF0ZVRlbXBsYXRlKHRlbXBsYXRlLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHJlbW92ZVRlbXBsYXRlIChjbGllbnQsIGlkKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHJlbW92ZVRlbXBsYXRlKGlkKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBnZXRUZW1wbGF0ZXMgKGNsaWVudCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LmdldCgnL2FwcGxpY2F0aW9uJywgZ2V0VGVtcGxhdGVzKGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZ2V0QXBwbGljYXRpb25zIChjbGllbnQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldEFwcGxpY2F0aW9ucyhmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGFkZEFwcGxpY2F0aW9uU291cmNlIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIGFwcGxpY2F0aW9uU291cmNlLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgYWRkQXBwbGljYXRpb25Tb3VyY2UoYXBwbGljYXRpb25JZCwgYXBwbGljYXRpb25Tb3VyY2UsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgYWRkQXBwbGljYXRpb25Tb3VyY2VGcm9tVVJMIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIHVybCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgcmV0dXJuIGdldEZpbGVGcm9tVXJsKGNsaWVudCwgdXJsKVxuICAgICAgLnRoZW4oZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgYWRkQXBwbGljYXRpb25Tb3VyY2UoYXBwbGljYXRpb25JZCwgZmlsZSwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlIChjbGllbnQsIGFwcGxpY2F0aW9uU291cmNlLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgdXBkYXRlQXBwbGljYXRpb25Tb3VyY2UoYXBwbGljYXRpb25Tb3VyY2UsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgcmVtb3ZlU291cmNlRnJvbUFwcGxpY2F0aW9uIChjbGllbnQsIHNvdXJjZUlkLCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgcmVtb3ZlU291cmNlRnJvbUFwcGxpY2F0aW9uKHNvdXJjZUlkLCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHVwZGF0ZVRlbXBsYXRlIChjbGllbnQsIHRlbXBsYXRlLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgdXBkYXRlVGVtcGxhdGUodGVtcGxhdGUsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCBjcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb24oYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb24gKGNsaWVudCwgYXBwbGljYXRpb25JZCwgcHJvdGVjdGlvbklkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KCcvYXBwbGljYXRpb24nLCBnZXRQcm90ZWN0aW9uKGFwcGxpY2F0aW9uSWQsIHByb3RlY3Rpb25JZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBkb3dubG9hZEFwcGxpY2F0aW9uUHJvdGVjdGlvbiAoY2xpZW50LCBwcm90ZWN0aW9uSWQpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KGAvYXBwbGljYXRpb24vZG93bmxvYWQvJHtwcm90ZWN0aW9uSWR9YCwgbnVsbCwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSwgZmFsc2UpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZ2V0RmlsZUZyb21VcmwgKGNsaWVudCwgdXJsKSB7XG4gIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICB2YXIgZmlsZTtcbiAgcmVxdWVzdC5nZXQodXJsKVxuICAgIC50aGVuKChyZXMpID0+IHtcbiAgICAgIGZpbGUgPSB7XG4gICAgICAgIGNvbnRlbnQ6IHJlcy5kYXRhLFxuICAgICAgICBmaWxlbmFtZTogcGF0aC5iYXNlbmFtZSh1cmwpLFxuICAgICAgICBleHRlbnNpb246IHBhdGguZXh0bmFtZSh1cmwpLnN1YnN0cigxKVxuICAgICAgfTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoZmlsZSk7XG4gICAgfSlcbiAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5mdW5jdGlvbiByZXNwb25zZUhhbmRsZXIgKGRlZmVycmVkKSB7XG4gIHJldHVybiAoZXJyLCByZXMpID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJvZHkgPSByZXMuZGF0YTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChyZXMuc3RhdHVzID49IDQwMCkge1xuICAgICAgICAgIGRlZmVycmVkLnJlamVjdChib2R5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGJvZHkpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoYm9keSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBlcnJvckhhbmRsZXIgKHJlcykge1xuICBpZiAocmVzLmVycm9ycyAmJiByZXMuZXJyb3JzLmxlbmd0aCkge1xuICAgIHJlcy5lcnJvcnMuZm9yRWFjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVQYXJhbWV0ZXJzIChwYXJhbWV0ZXJzKSB7XG4gIHZhciByZXN1bHQ7XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KHBhcmFtZXRlcnMpKSB7XG4gICAgcmVzdWx0ID0gW107XG4gICAgT2JqZWN0LmtleXMocGFyYW1ldGVycykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICBuYW1lLFxuICAgICAgICBvcHRpb25zOiBwYXJhbWV0ZXJzW25hbWVdXG4gICAgICB9KVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9IHBhcmFtZXRlcnM7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIl19
