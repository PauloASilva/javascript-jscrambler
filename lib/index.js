'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

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
  //
  protectAndDownload: function protectAndDownload(configPathOrObject, destCallback) {
    var config, applicationId, host, port, keys, filesDest, filesSrc, cwd, params, accessKey, secretKey, client, _filesSrc, i, l, _zip, removeSourceRes, addApplicationSourceRes, updateApplicationRes, createApplicationProtectionRes, protectionId, download;

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
          if (!filesSrc) {
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
            context$1$0.next = 38;
            break;
          }

          context$1$0.next = 35;
          return regeneratorRuntime.awrap(this.updateApplication(client, {
            _id: applicationId,
            parameters: JSON.stringify(params)
          }));

        case 35:
          updateApplicationRes = context$1$0.sent;

          if (!updateApplicationRes.errors) {
            context$1$0.next = 38;
            break;
          }

          throw new Error('Error updating the application');

        case 38:
          context$1$0.next = 40;
          return regeneratorRuntime.awrap(this.createApplicationProtection(client, applicationId));

        case 40:
          createApplicationProtectionRes = context$1$0.sent;

          if (!createApplicationProtectionRes.errors) {
            context$1$0.next = 43;
            break;
          }

          throw new Error('Error creating application protection');

        case 43:
          protectionId = createApplicationProtectionRes.data.createApplicationProtection._id;
          context$1$0.next = 46;
          return regeneratorRuntime.awrap(this.pollProtection(client, applicationId, protectionId));

        case 46:
          context$1$0.next = 48;
          return regeneratorRuntime.awrap(this.downloadApplicationProtection(client, protectionId));

        case 48:
          download = context$1$0.sent;

          console.log(download);
          context$1$0.next = 52;
          return regeneratorRuntime.awrap((0, _zip2.unzip)(download, filesDest || destCallback));

        case 52:
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

          client.get('/application/download/' + protectionId, null, responseHandler(deferred, false), false);
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
  _superagent2['default'].get(url).end(function (err, res) {
    var file;
    if (err) {
      deferred.reject(err);
    } else {
      file = {
        content: res.text,
        filename: _path2['default'].basename(url),
        extension: _path2['default'].extname(url).substr(1)
      };
      deferred.resolve(file);
    }
  });
  return deferred.promise;
}

function responseHandler(deferred) {
  var parseJSON = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  return function (err, res) {
    var body;
    if (Buffer.isBuffer(res.body) || Object.keys(res.body).length) {
      body = res.body;
    } else {
      body = res.text;
    }
    try {
      if (err) deferred.reject(err);else if (res.statusCode >= 400) {
        if (Buffer.isBuffer(body)) {
          deferred.reject(JSON.parse(body));
        } else {
          deferred.reject(body);
        }
      } else {
        if (Buffer.isBuffer(body)) {
          deferred.resolve(parseJSON ? JSON.parse(body) : body);
        } else {
          deferred.resolve(body);
        }
      }
    } catch (ex) {
      deferred.reject(body);
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
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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TTtBQUNMLFlBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN6QixrQkFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztTQUN2RCxNQUFNO0FBQ0wsa0JBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEI7T0FDRjtLQUNGLENBQUMsT0FBTyxFQUFFLEVBQUU7QUFDWCxjQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3ZCO0dBQ0YsQ0FBQztDQUNIOztBQUVELFNBQVMsWUFBWSxDQUFFLEdBQUcsRUFBRTtBQUMxQixNQUFJLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUU7QUFDbkMsT0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFLLEVBQUU7QUFDbEMsYUFBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDOUIsQ0FBQyxDQUFDO0dBQ0o7O0FBRUQsU0FBTyxHQUFHLENBQUM7Q0FDWiIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdzdXBlcmFnZW50JztcbmltcG9ydCBRIGZyb20gJ3EnO1xuXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCBnZW5lcmF0ZVNpZ25lZFBhcmFtcyBmcm9tICcuL2dlbmVyYXRlLXNpZ25lZC1wYXJhbXMnO1xuaW1wb3J0IEpTY3JhbWJsZXJDbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IHtcbiAgYWRkQXBwbGljYXRpb25Tb3VyY2UsXG4gIGNyZWF0ZUFwcGxpY2F0aW9uLFxuICByZW1vdmVBcHBsaWNhdGlvbixcbiAgdXBkYXRlQXBwbGljYXRpb24sXG4gIHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlLFxuICByZW1vdmVTb3VyY2VGcm9tQXBwbGljYXRpb24sXG4gIGNyZWF0ZVRlbXBsYXRlLFxuICByZW1vdmVUZW1wbGF0ZSxcbiAgdXBkYXRlVGVtcGxhdGUsXG4gIGNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvbixcbiAgcmVtb3ZlUHJvdGVjdGlvbixcbiAgZHVwbGljYXRlQXBwbGljYXRpb25cbn0gZnJvbSAnLi9tdXRhdGlvbnMnO1xuaW1wb3J0IHtcbiAgZ2V0QXBwbGljYXRpb24sXG4gIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnMsXG4gIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNDb3VudCxcbiAgZ2V0QXBwbGljYXRpb25zLFxuICBnZXRBcHBsaWNhdGlvblNvdXJjZSxcbiAgZ2V0VGVtcGxhdGVzLFxuICBnZXRQcm90ZWN0aW9uXG59IGZyb20gJy4vcXVlcmllcyc7XG5pbXBvcnQge1xuICB6aXAsXG4gIHVuemlwXG59IGZyb20gJy4vemlwJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBDbGllbnQ6IEpTY3JhbWJsZXJDbGllbnQsXG4gIGNvbmZpZyxcbiAgZ2VuZXJhdGVTaWduZWRQYXJhbXMsXG4gIC8vXG4gIGFzeW5jIHByb3RlY3RBbmREb3dubG9hZCAoY29uZmlnUGF0aE9yT2JqZWN0LCBkZXN0Q2FsbGJhY2spIHtcbiAgICBjb25zdCBjb25maWcgPSB0eXBlb2YgY29uZmlnUGF0aE9yT2JqZWN0ID09PSAnc3RyaW5nJyA/XG4gICAgICByZXF1aXJlKGNvbmZpZ1BhdGhPck9iamVjdCkgOiBjb25maWdQYXRoT3JPYmplY3Q7XG5cbiAgICBjb25zdCB7XG4gICAgICBhcHBsaWNhdGlvbklkLFxuICAgICAgaG9zdCxcbiAgICAgIHBvcnQsXG4gICAgICBrZXlzLFxuICAgICAgZmlsZXNEZXN0LFxuICAgICAgZmlsZXNTcmMsXG4gICAgICBjd2QsXG4gICAgICBwYXJhbXNcbiAgICB9ID0gY29uZmlnO1xuXG4gICAgY29uc3Qge1xuICAgICAgYWNjZXNzS2V5LFxuICAgICAgc2VjcmV0S2V5XG4gICAgfSA9IGtleXM7XG5cbiAgICBjb25zdCBjbGllbnQgPSBuZXcgdGhpcy5DbGllbnQoe1xuICAgICAgYWNjZXNzS2V5LFxuICAgICAgc2VjcmV0S2V5LFxuICAgICAgaG9zdCxcbiAgICAgIHBvcnRcbiAgICB9KTtcblxuICAgIGlmICghYXBwbGljYXRpb25JZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXF1aXJlZCAqYXBwbGljYXRpb25JZCogbm90IHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKCFmaWxlc0Rlc3QgJiYgIWRlc3RDYWxsYmFjaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXF1aXJlZCAqZmlsZXNEZXN0KiBub3QgcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoZmlsZXNTcmMpIHtcbiAgICAgIGxldCBfZmlsZXNTcmMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZmlsZXNTcmMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZmlsZXNTcmNbaV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgLy8gVE9ETyBSZXBsYWNlIGBnbG9iLnN5bmNgIHdpdGggYXN5bmMgdmVyc2lvblxuICAgICAgICAgIF9maWxlc1NyYyA9IF9maWxlc1NyYy5jb25jYXQoZ2xvYi5zeW5jKGZpbGVzU3JjW2ldLCB7ZG90OiB0cnVlfSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9maWxlc1NyYy5wdXNoKGZpbGVzU3JjW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBfemlwID0gYXdhaXQgemlwKGZpbGVzU3JjLCBjd2QpO1xuXG4gICAgICBjb25zdCByZW1vdmVTb3VyY2VSZXMgPSBhd2FpdCB0aGlzLnJlbW92ZVNvdXJjZUZyb21BcHBsaWNhdGlvbihjbGllbnQsICcnLCBhcHBsaWNhdGlvbklkKTtcbiAgICAgIGlmIChyZW1vdmVTb3VyY2VSZXMuZXJyb3JzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgcmVtb3ZpbmcgYXBwbGljYXRpb24gc291cmNlcycpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBhZGRBcHBsaWNhdGlvblNvdXJjZVJlcyA9IGF3YWl0IHRoaXMuYWRkQXBwbGljYXRpb25Tb3VyY2UoY2xpZW50LCBhcHBsaWNhdGlvbklkLCB7XG4gICAgICAgIGNvbnRlbnQ6IF96aXAuZ2VuZXJhdGUoe3R5cGU6ICdiYXNlNjQnfSksXG4gICAgICAgIGZpbGVuYW1lOiAnYXBwbGljYXRpb24uemlwJyxcbiAgICAgICAgZXh0ZW5zaW9uOiAnemlwJ1xuICAgICAgfSk7XG4gICAgICBpZiAoYWRkQXBwbGljYXRpb25Tb3VyY2VSZXMuZXJyb3JzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgdXBsb2FkaW5nIGZpbGVzJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcyAmJiBPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCkge1xuICAgICAgY29uc3QgdXBkYXRlQXBwbGljYXRpb25SZXMgPSBhd2FpdCB0aGlzLnVwZGF0ZUFwcGxpY2F0aW9uKGNsaWVudCwge1xuICAgICAgICBfaWQ6IGFwcGxpY2F0aW9uSWQsXG4gICAgICAgIHBhcmFtZXRlcnM6IEpTT04uc3RyaW5naWZ5KHBhcmFtcylcbiAgICAgIH0pO1xuICAgICAgaWYgKHVwZGF0ZUFwcGxpY2F0aW9uUmVzLmVycm9ycykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIHVwZGF0aW5nIHRoZSBhcHBsaWNhdGlvbicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvblJlcyA9IGF3YWl0IHRoaXMuY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uKGNsaWVudCwgYXBwbGljYXRpb25JZCk7XG4gICAgaWYgKGNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvblJlcy5lcnJvcnMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgY3JlYXRpbmcgYXBwbGljYXRpb24gcHJvdGVjdGlvbicpO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3RlY3Rpb25JZCA9IGNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvblJlcy5kYXRhLmNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvbi5faWQ7XG4gICAgYXdhaXQgdGhpcy5wb2xsUHJvdGVjdGlvbihjbGllbnQsIGFwcGxpY2F0aW9uSWQsIHByb3RlY3Rpb25JZCk7XG5cbiAgICBjb25zdCBkb3dubG9hZCA9IGF3YWl0IHRoaXMuZG93bmxvYWRBcHBsaWNhdGlvblByb3RlY3Rpb24oY2xpZW50LCBwcm90ZWN0aW9uSWQpO1xuICAgIGNvbnNvbGUubG9nKGRvd25sb2FkKTtcbiAgICBhd2FpdCB1bnppcChkb3dubG9hZCwgZmlsZXNEZXN0IHx8IGRlc3RDYWxsYmFjayk7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHBvbGxQcm90ZWN0aW9uIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIHByb3RlY3Rpb25JZCkge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gICAgY29uc3QgcG9sbCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcGxpY2F0aW9uUHJvdGVjdGlvbiA9IGF3YWl0IHRoaXMuZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uKGNsaWVudCwgYXBwbGljYXRpb25JZCwgcHJvdGVjdGlvbklkKTtcbiAgICAgIGlmIChhcHBsaWNhdGlvblByb3RlY3Rpb24uZXJyb3JzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgcG9sbGluZyBwcm90ZWN0aW9uJyk7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdCgnRXJyb3IgcG9sbGluZyBwcm90ZWN0aW9uJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IGFwcGxpY2F0aW9uUHJvdGVjdGlvbi5kYXRhLmFwcGxpY2F0aW9uUHJvdGVjdGlvbi5zdGF0ZTtcbiAgICAgICAgaWYgKHN0YXRlICE9PSAnZmluaXNoZWQnICYmIHN0YXRlICE9PSAnZXJyb3JlZCcpIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KHBvbGwsIDUwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBvbGwoKTtcblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyBjcmVhdGVBcHBsaWNhdGlvbiAoY2xpZW50LCBkYXRhLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgY3JlYXRlQXBwbGljYXRpb24oZGF0YSwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBkdXBsaWNhdGVBcHBsaWNhdGlvbiAoY2xpZW50LCBkYXRhLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgZHVwbGljYXRlQXBwbGljYXRpb24oZGF0YSwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyByZW1vdmVBcHBsaWNhdGlvbiAoY2xpZW50LCBpZCkge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCByZW1vdmVBcHBsaWNhdGlvbihpZCksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgcmVtb3ZlUHJvdGVjdGlvbiAoY2xpZW50LCBpZCwgYXBwSWQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCByZW1vdmVQcm90ZWN0aW9uKGlkLCBhcHBJZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyB1cGRhdGVBcHBsaWNhdGlvbiAoY2xpZW50LCBhcHBsaWNhdGlvbiwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHVwZGF0ZUFwcGxpY2F0aW9uKGFwcGxpY2F0aW9uLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGdldEFwcGxpY2F0aW9uIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldEFwcGxpY2F0aW9uKGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZ2V0QXBwbGljYXRpb25Tb3VyY2UgKGNsaWVudCwgc291cmNlSWQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldEFwcGxpY2F0aW9uU291cmNlKHNvdXJjZUlkLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnMgKGNsaWVudCwgYXBwbGljYXRpb25JZCwgcGFyYW1zLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KCcvYXBwbGljYXRpb24nLCBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zKGFwcGxpY2F0aW9uSWQsIHBhcmFtcywgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zQ291bnQgKGNsaWVudCwgYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LmdldCgnL2FwcGxpY2F0aW9uJywgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uc0NvdW50KGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgY3JlYXRlVGVtcGxhdGUgKGNsaWVudCwgdGVtcGxhdGUsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCBjcmVhdGVUZW1wbGF0ZSh0ZW1wbGF0ZSwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyByZW1vdmVUZW1wbGF0ZSAoY2xpZW50LCBpZCkge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCByZW1vdmVUZW1wbGF0ZShpZCksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZ2V0VGVtcGxhdGVzIChjbGllbnQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldFRlbXBsYXRlcyhmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGdldEFwcGxpY2F0aW9ucyAoY2xpZW50LCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KCcvYXBwbGljYXRpb24nLCBnZXRBcHBsaWNhdGlvbnMoZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBhZGRBcHBsaWNhdGlvblNvdXJjZSAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBhcHBsaWNhdGlvblNvdXJjZSwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIGFkZEFwcGxpY2F0aW9uU291cmNlKGFwcGxpY2F0aW9uSWQsIGFwcGxpY2F0aW9uU291cmNlLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGFkZEFwcGxpY2F0aW9uU291cmNlRnJvbVVSTCAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCB1cmwsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIHJldHVybiBnZXRGaWxlRnJvbVVybChjbGllbnQsIHVybClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIGFkZEFwcGxpY2F0aW9uU291cmNlKGFwcGxpY2F0aW9uSWQsIGZpbGUsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH0pXG4gICAgICAudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyB1cGRhdGVBcHBsaWNhdGlvblNvdXJjZSAoY2xpZW50LCBhcHBsaWNhdGlvblNvdXJjZSwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlKGFwcGxpY2F0aW9uU291cmNlLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHJlbW92ZVNvdXJjZUZyb21BcHBsaWNhdGlvbiAoY2xpZW50LCBzb3VyY2VJZCwgYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHJlbW92ZVNvdXJjZUZyb21BcHBsaWNhdGlvbihzb3VyY2VJZCwgYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyB1cGRhdGVUZW1wbGF0ZSAoY2xpZW50LCB0ZW1wbGF0ZSwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHVwZGF0ZVRlbXBsYXRlKHRlbXBsYXRlLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvbiAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uKGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIHByb3RlY3Rpb25JZCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LmdldCgnL2FwcGxpY2F0aW9uJywgZ2V0UHJvdGVjdGlvbihhcHBsaWNhdGlvbklkLCBwcm90ZWN0aW9uSWQsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZG93bmxvYWRBcHBsaWNhdGlvblByb3RlY3Rpb24gKGNsaWVudCwgcHJvdGVjdGlvbklkKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LmdldChgL2FwcGxpY2F0aW9uL2Rvd25sb2FkLyR7cHJvdGVjdGlvbklkfWAsIG51bGwsIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCwgZmFsc2UpLCBmYWxzZSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBnZXRGaWxlRnJvbVVybCAoY2xpZW50LCB1cmwpIHtcbiAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gIHJlcXVlc3QuZ2V0KHVybCkuZW5kKGZ1bmN0aW9uIChlcnIsIHJlcykge1xuICAgIHZhciBmaWxlO1xuICAgIGlmKGVycikge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbGUgPSB7XG4gICAgICAgIGNvbnRlbnQ6IHJlcy50ZXh0LFxuICAgICAgICBmaWxlbmFtZTogcGF0aC5iYXNlbmFtZSh1cmwpLFxuICAgICAgICBleHRlbnNpb246IHBhdGguZXh0bmFtZSh1cmwpLnN1YnN0cigxKVxuICAgICAgfTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoZmlsZSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cbmZ1bmN0aW9uIHJlc3BvbnNlSGFuZGxlciAoZGVmZXJyZWQsIHBhcnNlSlNPTiA9IHRydWUpIHtcbiAgcmV0dXJuIChlcnIsIHJlcykgPT4ge1xuICAgIHZhciBib2R5O1xuICAgIGlmIChCdWZmZXIuaXNCdWZmZXIocmVzLmJvZHkpIHx8IE9iamVjdC5rZXlzKHJlcy5ib2R5KS5sZW5ndGgpIHtcbiAgICAgIGJvZHkgPSByZXMuYm9keTtcbiAgICB9IGVsc2Uge1xuICAgICAgYm9keSA9IHJlcy50ZXh0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgaWYgKGVycikgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgICBlbHNlIGlmIChyZXMuc3RhdHVzQ29kZSA+PSA0MDApIHtcbiAgICAgICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihib2R5KSkge1xuICAgICAgICAgIGRlZmVycmVkLnJlamVjdChKU09OLnBhcnNlKGJvZHkpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoYm9keSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoYm9keSkpIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHBhcnNlSlNPTiA/IEpTT04ucGFyc2UoYm9keSkgOiBib2R5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGJvZHkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgIGRlZmVycmVkLnJlamVjdChib2R5KTtcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGVycm9ySGFuZGxlciAocmVzKSB7XG4gIGlmIChyZXMuZXJyb3JzICYmIHJlcy5lcnJvcnMubGVuZ3RoKSB7XG4gICAgcmVzLmVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiByZXM7XG59XG4iXX0=
