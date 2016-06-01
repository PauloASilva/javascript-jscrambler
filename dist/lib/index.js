'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

exports.default = {
  Client: _client2.default,
  config: _config2.default,
  generateSignedParams: _generateSignedParams2.default,
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
    var _this = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
      var config, applicationId, host, port, keys, filesDest, filesSrc, cwd, params, accessKey, secretKey, client, _filesSrc, i, l, _zip, removeSourceRes, hadNoSources, addApplicationSourceRes, areParametersOrdered, updateApplicationRes, createApplicationProtectionRes, protectionId, download;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
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
              client = new _this.Client({
                accessKey: accessKey,
                secretKey: secretKey,
                host: host,
                port: port
              });

              if (applicationId) {
                _context.next = 14;
                break;
              }

              throw new Error('Required *applicationId* not provided');

            case 14:
              if (!(!filesDest && !destCallback)) {
                _context.next = 16;
                break;
              }

              throw new Error('Required *filesDest* not provided');

            case 16:
              if (!(filesSrc && filesSrc.length)) {
                _context.next = 35;
                break;
              }

              _filesSrc = [];

              for (i = 0, l = filesSrc.length; i < l; ++i) {
                if (typeof filesSrc[i] === 'string') {
                  // TODO Replace `glob.sync` with async version
                  _filesSrc = _filesSrc.concat(_glob2.default.sync(filesSrc[i], { dot: true }));
                } else {
                  _filesSrc.push(filesSrc[i]);
                }
              }

              _context.next = 21;
              return (0, _zip2.zip)(filesSrc, cwd);

            case 21:
              _zip = _context.sent;
              _context.next = 24;
              return _this.removeSourceFromApplication(client, '', applicationId);

            case 24:
              removeSourceRes = _context.sent;

              if (!removeSourceRes.errors) {
                _context.next = 30;
                break;
              }

              // TODO Implement error codes or fix this is on the services
              hadNoSources = false;

              removeSourceRes.errors.forEach(function (error) {
                if (error.message === 'Application Source with the given ID does not exist') {
                  hadNoSources = true;
                }
              });

              if (hadNoSources) {
                _context.next = 30;
                break;
              }

              throw new Error('Error removing application sources');

            case 30:
              _context.next = 32;
              return _this.addApplicationSource(client, applicationId, {
                content: _zip.generate({ type: 'base64' }),
                filename: 'application.zip',
                extension: 'zip'
              });

            case 32:
              addApplicationSourceRes = _context.sent;

              if (!addApplicationSourceRes.errors) {
                _context.next = 35;
                break;
              }

              throw new Error('Error uploading files');

            case 35:
              if (!(params && Object.keys(params).length)) {
                _context.next = 43;
                break;
              }

              areParametersOrdered = Array.isArray(params);
              _context.next = 39;
              return _this.updateApplication(client, {
                _id: applicationId,
                parameters: JSON.stringify(normalizeParameters(params)),
                areParametersOrdered: areParametersOrdered
              });

            case 39:
              updateApplicationRes = _context.sent;

              if (!updateApplicationRes.errors) {
                _context.next = 43;
                break;
              }

              console.error(updateApplicationRes.errors);
              throw new Error('Error updating the application');

            case 43:
              _context.next = 45;
              return _this.createApplicationProtection(client, applicationId);

            case 45:
              createApplicationProtectionRes = _context.sent;

              if (!createApplicationProtectionRes.errors) {
                _context.next = 49;
                break;
              }

              console.error(createApplicationProtectionRes.errors);
              throw new Error('Error creating application protection');

            case 49:
              protectionId = createApplicationProtectionRes.data.createApplicationProtection._id;
              _context.next = 52;
              return _this.pollProtection(client, applicationId, protectionId);

            case 52:
              _context.next = 54;
              return _this.downloadApplicationProtection(client, protectionId);

            case 54:
              download = _context.sent;

              (0, _zip2.unzip)(download, filesDest || destCallback);

            case 56:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }))();
  },

  //
  pollProtection: function pollProtection(client, applicationId, protectionId) {
    var _this2 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
      var deferred, poll;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              deferred = _q2.default.defer();

              poll = function () {
                var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                  var applicationProtection, state;
                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          _context2.next = 2;
                          return _this2.getApplicationProtection(client, applicationId, protectionId);

                        case 2:
                          applicationProtection = _context2.sent;

                          if (!applicationProtection.errors) {
                            _context2.next = 8;
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
                          return _context2.stop();
                      }
                    }
                  }, _callee2, _this2);
                }));

                return function poll() {
                  return ref.apply(this, arguments);
                };
              }();

              poll();

              return _context3.abrupt('return', deferred.promise);

            case 4:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this2);
    }))();
  },

  //
  createApplication: function createApplication(client, data, fragments) {
    var _this3 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee4() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              deferred = _q2.default.defer();

              client.post('/application', (0, _mutations.createApplication)(data, fragments), responseHandler(deferred));
              return _context4.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, _this3);
    }))();
  },

  //
  duplicateApplication: function duplicateApplication(client, data, fragments) {
    var _this4 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee5() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              deferred = _q2.default.defer();

              client.post('/application', (0, _mutations.duplicateApplication)(data, fragments), responseHandler(deferred));
              return _context5.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, _this4);
    }))();
  },

  //
  removeApplication: function removeApplication(client, id) {
    var _this5 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              deferred = _q2.default.defer();

              client.post('/application', (0, _mutations.removeApplication)(id), responseHandler(deferred));
              return _context6.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, _this5);
    }))();
  },

  //
  removeProtection: function removeProtection(client, id, appId, fragments) {
    var _this6 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee7() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              deferred = _q2.default.defer();

              client.post('/application', (0, _mutations.removeProtection)(id, appId, fragments), responseHandler(deferred));
              return _context7.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, _this6);
    }))();
  },

  //
  updateApplication: function updateApplication(client, application, fragments) {
    var _this7 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee8() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              deferred = _q2.default.defer();

              client.post('/application', (0, _mutations.updateApplication)(application, fragments), responseHandler(deferred));
              return _context8.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, _this7);
    }))();
  },

  //
  unlockApplication: function unlockApplication(client, application, fragments) {
    var _this8 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee9() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              deferred = _q2.default.defer();

              client.post('/application', (0, _mutations.unlockApplication)(application, fragments), responseHandler(deferred));
              return _context9.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, _this8);
    }))();
  },

  //
  getApplication: function getApplication(client, applicationId, fragments) {
    var _this9 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee10() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              deferred = _q2.default.defer();

              client.get('/application', (0, _queries.getApplication)(applicationId, fragments), responseHandler(deferred));
              return _context10.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context10.stop();
          }
        }
      }, _callee10, _this9);
    }))();
  },

  //
  getApplicationSource: function getApplicationSource(client, sourceId, fragments, limits) {
    var _this10 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee11() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              deferred = _q2.default.defer();

              client.get('/application', (0, _queries.getApplicationSource)(sourceId, fragments, limits), responseHandler(deferred));
              return _context11.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context11.stop();
          }
        }
      }, _callee11, _this10);
    }))();
  },

  //
  getApplicationProtections: function getApplicationProtections(client, applicationId, params, fragments) {
    var _this11 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee12() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              deferred = _q2.default.defer();

              client.get('/application', (0, _queries.getApplicationProtections)(applicationId, params, fragments), responseHandler(deferred));
              return _context12.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context12.stop();
          }
        }
      }, _callee12, _this11);
    }))();
  },

  //
  getApplicationProtectionsCount: function getApplicationProtectionsCount(client, applicationId, fragments) {
    var _this12 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee13() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              deferred = _q2.default.defer();

              client.get('/application', (0, _queries.getApplicationProtectionsCount)(applicationId, fragments), responseHandler(deferred));
              return _context13.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context13.stop();
          }
        }
      }, _callee13, _this12);
    }))();
  },

  //
  createTemplate: function createTemplate(client, template, fragments) {
    var _this13 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee14() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              deferred = _q2.default.defer();

              client.post('/application', (0, _mutations.createTemplate)(template, fragments), responseHandler(deferred));
              return _context14.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context14.stop();
          }
        }
      }, _callee14, _this13);
    }))();
  },

  //
  removeTemplate: function removeTemplate(client, id) {
    var _this14 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee15() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              deferred = _q2.default.defer();

              client.post('/application', (0, _mutations.removeTemplate)(id), responseHandler(deferred));
              return _context15.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context15.stop();
          }
        }
      }, _callee15, _this14);
    }))();
  },

  //
  getTemplates: function getTemplates(client, fragments) {
    var _this15 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee16() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              deferred = _q2.default.defer();

              client.get('/application', (0, _queries.getTemplates)(fragments), responseHandler(deferred));
              return _context16.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context16.stop();
          }
        }
      }, _callee16, _this15);
    }))();
  },

  //
  getApplications: function getApplications(client, fragments) {
    var _this16 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee17() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              deferred = _q2.default.defer();

              client.get('/application', (0, _queries.getApplications)(fragments), responseHandler(deferred));
              return _context17.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context17.stop();
          }
        }
      }, _callee17, _this16);
    }))();
  },

  //
  addApplicationSource: function addApplicationSource(client, applicationId, applicationSource, fragments) {
    var _this17 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee18() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              deferred = _q2.default.defer();

              client.post('/application', (0, _mutations.addApplicationSource)(applicationId, applicationSource, fragments), responseHandler(deferred));
              return _context18.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context18.stop();
          }
        }
      }, _callee18, _this17);
    }))();
  },

  //
  addApplicationSourceFromURL: function addApplicationSourceFromURL(client, applicationId, url, fragments) {
    var _this18 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee19() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              deferred = _q2.default.defer();
              return _context19.abrupt('return', getFileFromUrl(client, url).then(function (file) {
                client.post('/application', (0, _mutations.addApplicationSource)(applicationId, file, fragments), responseHandler(deferred));
                return deferred.promise;
              }).then(errorHandler));

            case 2:
            case 'end':
              return _context19.stop();
          }
        }
      }, _callee19, _this18);
    }))();
  },

  //
  updateApplicationSource: function updateApplicationSource(client, applicationSource, fragments) {
    var _this19 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee20() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee20$(_context20) {
        while (1) {
          switch (_context20.prev = _context20.next) {
            case 0:
              deferred = _q2.default.defer();

              client.post('/application', (0, _mutations.updateApplicationSource)(applicationSource, fragments), responseHandler(deferred));
              return _context20.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context20.stop();
          }
        }
      }, _callee20, _this19);
    }))();
  },

  //
  removeSourceFromApplication: function removeSourceFromApplication(client, sourceId, applicationId, fragments) {
    var _this20 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee21() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              deferred = _q2.default.defer();

              client.post('/application', (0, _mutations.removeSourceFromApplication)(sourceId, applicationId, fragments), responseHandler(deferred));
              return _context21.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context21.stop();
          }
        }
      }, _callee21, _this20);
    }))();
  },

  //
  applyTemplate: function applyTemplate(client, templateId, appId, fragments) {
    var _this21 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee22() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee22$(_context22) {
        while (1) {
          switch (_context22.prev = _context22.next) {
            case 0:
              deferred = _q2.default.defer();

              client.post('/application', (0, _mutations.applyTemplate)(templateId, appId, fragments), responseHandler(deferred));
              return _context22.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context22.stop();
          }
        }
      }, _callee22, _this21);
    }))();
  },

  //
  updateTemplate: function updateTemplate(client, template, fragments) {
    var _this22 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee23() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee23$(_context23) {
        while (1) {
          switch (_context23.prev = _context23.next) {
            case 0:
              deferred = _q2.default.defer();

              client.post('/application', (0, _mutations.updateTemplate)(template, fragments), responseHandler(deferred));
              return _context23.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context23.stop();
          }
        }
      }, _callee23, _this22);
    }))();
  },

  //
  createApplicationProtection: function createApplicationProtection(client, applicationId, fragments) {
    var _this23 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee24() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee24$(_context24) {
        while (1) {
          switch (_context24.prev = _context24.next) {
            case 0:
              deferred = _q2.default.defer();

              client.post('/application', (0, _mutations.createApplicationProtection)(applicationId, fragments), responseHandler(deferred));
              return _context24.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context24.stop();
          }
        }
      }, _callee24, _this23);
    }))();
  },

  //
  getApplicationProtection: function getApplicationProtection(client, applicationId, protectionId, fragments) {
    var _this24 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee25() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee25$(_context25) {
        while (1) {
          switch (_context25.prev = _context25.next) {
            case 0:
              deferred = _q2.default.defer();

              client.get('/application', (0, _queries.getProtection)(applicationId, protectionId, fragments), responseHandler(deferred));
              return _context25.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context25.stop();
          }
        }
      }, _callee25, _this24);
    }))();
  },

  //
  downloadApplicationProtection: function downloadApplicationProtection(client, protectionId) {
    var _this25 = this;

    return _asyncToGenerator(regeneratorRuntime.mark(function _callee26() {
      var deferred;
      return regeneratorRuntime.wrap(function _callee26$(_context26) {
        while (1) {
          switch (_context26.prev = _context26.next) {
            case 0:
              deferred = _q2.default.defer();

              client.get('/application/download/' + protectionId, null, responseHandler(deferred), false);
              return _context26.abrupt('return', deferred.promise.then(errorHandler));

            case 3:
            case 'end':
              return _context26.stop();
          }
        }
      }, _callee26, _this25);
    }))();
  }
};


function getFileFromUrl(client, url) {
  var deferred = _q2.default.defer();
  var file;
  _axios2.default.get(url).then(function (res) {
    file = {
      content: res.data,
      filename: _path2.default.basename(url),
      extension: _path2.default.extname(url).substr(1)
    };
    deferred.resolve(file);
  }).catch(function (err) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFnQkE7O0FBU0E7Ozs7OztrQkFLZTtBQUNiLDBCQURhO0FBRWIsMEJBRmE7QUFHYixzREFIYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQThDUCxvQkE5Q08sOEJBOENhLGtCQTlDYixFQThDaUMsWUE5Q2pDLEVBOEMrQztBQUFBOztBQUFBO0FBQUEsVUFDcEQsTUFEb0QsRUFLeEQsYUFMd0QsRUFNeEQsSUFOd0QsRUFPeEQsSUFQd0QsRUFReEQsSUFSd0QsRUFTeEQsU0FUd0QsRUFVeEQsUUFWd0QsRUFXeEQsR0FYd0QsRUFZeEQsTUFad0QsRUFnQnhELFNBaEJ3RCxFQWlCeEQsU0FqQndELEVBb0JwRCxNQXBCb0QsRUFvQ3BELFNBcENvRCxFQXFDL0MsQ0FyQytDLEVBcUN4QyxDQXJDd0MsRUE4Q2xELElBOUNrRCxFQWdEbEQsZUFoRGtELEVBbURsRCxZQW5Ea0QsRUE4RGxELHVCQTlEa0QsRUF5RWxELG9CQXpFa0QsRUEwRWxELG9CQTFFa0QsRUFxRnBELDhCQXJGb0QsRUEyRnBELFlBM0ZvRCxFQThGcEQsUUE5Rm9EOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ3BELG9CQURvRCxHQUMzQyxPQUFPLGtCQUFQLEtBQThCLFFBQTlCLEdBQ2IsUUFBUSxrQkFBUixDQURhLEdBQ2lCLGtCQUYwQjtBQUt4RCwyQkFMd0QsR0FhdEQsTUFic0QsQ0FLeEQsYUFMd0Q7QUFNeEQsa0JBTndELEdBYXRELE1BYnNELENBTXhELElBTndEO0FBT3hELGtCQVB3RCxHQWF0RCxNQWJzRCxDQU94RCxJQVB3RDtBQVF4RCxrQkFSd0QsR0FhdEQsTUFic0QsQ0FReEQsSUFSd0Q7QUFTeEQsdUJBVHdELEdBYXRELE1BYnNE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TUFFTztBQUNMLFVBQUksT0FBTyxJQUFJLElBQWY7QUFDQSxVQUFJO0FBQ0YsWUFBSSxJQUFJLE1BQUosSUFBYyxHQUFsQixFQUF1QjtBQUNyQixtQkFBUyxNQUFULENBQWdCLElBQWhCO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsbUJBQVMsT0FBVCxDQUFpQixJQUFqQjtBQUNEO0FBQ0YsT0FORCxDQU1FLE9BQU8sRUFBUCxFQUFXO0FBQ1gsaUJBQVMsTUFBVCxDQUFnQixJQUFoQjtBQUNEO0FBQ0Y7QUFDRixHQWZEO0FBZ0JEOztBQUVELFNBQVMsWUFBVCxDQUF1QixHQUF2QixFQUE0QjtBQUMxQixNQUFJLElBQUksTUFBSixJQUFjLElBQUksTUFBSixDQUFXLE1BQTdCLEVBQXFDO0FBQ25DLFFBQUksTUFBSixDQUFXLE9BQVgsQ0FBbUIsVUFBVSxLQUFWLEVBQWlCO0FBQ2xDLGNBQVEsS0FBUixDQUFjLE1BQU0sT0FBcEI7QUFDRCxLQUZEO0FBR0Q7O0FBRUQsU0FBTyxHQUFQO0FBQ0Q7O0FBRUQsU0FBUyxtQkFBVCxDQUE4QixVQUE5QixFQUEwQztBQUN4QyxNQUFJLE1BQUo7O0FBRUEsTUFBSSxDQUFDLE1BQU0sT0FBTixDQUFjLFVBQWQsQ0FBTCxFQUFnQztBQUM5QixhQUFTLEVBQVQ7QUFDQSxXQUFPLElBQVAsQ0FBWSxVQUFaLEVBQXdCLE9BQXhCLENBQWdDLFVBQUMsSUFBRCxFQUFVO0FBQ3hDLGFBQU8sSUFBUCxDQUFZO0FBQ1Ysa0JBRFU7QUFFVixpQkFBUyxXQUFXLElBQVg7QUFGQyxPQUFaO0FBSUQsS0FMRDtBQU1ELEdBUkQsTUFRTztBQUNMLGFBQVMsVUFBVDtBQUNEOztBQUVELFNBQU8sTUFBUDtBQUNEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdiYWJlbC1wb2x5ZmlsbCc7XG5cbmltcG9ydCBnbG9iIGZyb20gJ2dsb2InO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcmVxdWVzdCBmcm9tICdheGlvcyc7XG5pbXBvcnQgUSBmcm9tICdxJztcblxuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgZ2VuZXJhdGVTaWduZWRQYXJhbXMgZnJvbSAnLi9nZW5lcmF0ZS1zaWduZWQtcGFyYW1zJztcbmltcG9ydCBKU2NyYW1ibGVyQ2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCB7XG4gIGFkZEFwcGxpY2F0aW9uU291cmNlLFxuICBjcmVhdGVBcHBsaWNhdGlvbixcbiAgcmVtb3ZlQXBwbGljYXRpb24sXG4gIHVwZGF0ZUFwcGxpY2F0aW9uLFxuICB1cGRhdGVBcHBsaWNhdGlvblNvdXJjZSxcbiAgcmVtb3ZlU291cmNlRnJvbUFwcGxpY2F0aW9uLFxuICBjcmVhdGVUZW1wbGF0ZSxcbiAgcmVtb3ZlVGVtcGxhdGUsXG4gIHVwZGF0ZVRlbXBsYXRlLFxuICBjcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb24sXG4gIHJlbW92ZVByb3RlY3Rpb24sXG4gIGR1cGxpY2F0ZUFwcGxpY2F0aW9uLFxuICB1bmxvY2tBcHBsaWNhdGlvbixcbiAgYXBwbHlUZW1wbGF0ZVxufSBmcm9tICcuL211dGF0aW9ucyc7XG5pbXBvcnQge1xuICBnZXRBcHBsaWNhdGlvbixcbiAgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9ucyxcbiAgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uc0NvdW50LFxuICBnZXRBcHBsaWNhdGlvbnMsXG4gIGdldEFwcGxpY2F0aW9uU291cmNlLFxuICBnZXRUZW1wbGF0ZXMsXG4gIGdldFByb3RlY3Rpb25cbn0gZnJvbSAnLi9xdWVyaWVzJztcbmltcG9ydCB7XG4gIHppcCxcbiAgdW56aXBcbn0gZnJvbSAnLi96aXAnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIENsaWVudDogSlNjcmFtYmxlckNsaWVudCxcbiAgY29uZmlnLFxuICBnZW5lcmF0ZVNpZ25lZFBhcmFtcyxcbiAgLy8gVGhpcyBtZXRob2QgaXMgYSBzaG9ydGN1dCBtZXRob2QgdGhhdCBhY2NlcHRzIGFuIG9iamVjdCB3aXRoIGV2ZXJ5dGhpbmcgbmVlZGVkXG4gIC8vIGZvciB0aGUgZW50aXJlIHByb2Nlc3Mgb2YgcmVxdWVzdGluZyBhbiBhcHBsaWNhdGlvbiBwcm90ZWN0aW9uIGFuZCBkb3dubG9hZGluZ1xuICAvLyB0aGF0IHNhbWUgcHJvdGVjdGlvbiB3aGVuIHRoZSBzYW1lIGVuZHMuXG4gIC8vXG4gIC8vIGBjb25maWdQYXRoT3JPYmplY3RgIGNhbiBiZSBhIHBhdGggdG8gYSBKU09OIG9yIGRpcmVjdGx5IGFuIG9iamVjdCBjb250YWluaW5nXG4gIC8vIHRoZSBmb2xsb3dpbmcgc3RydWN0dXJlOlxuICAvL1xuICAvLyBgYGBqc29uXG4gIC8vIHtcbiAgLy8gICBcImtleXNcIjoge1xuICAvLyAgICAgXCJhY2Nlc3NLZXlcIjogXCJcIixcbiAgLy8gICAgIFwic2VjcmV0S2V5XCI6IFwiXCJcbiAgLy8gICB9LFxuICAvLyAgIFwiYXBwbGljYXRpb25JZFwiOiBcIlwiLFxuICAvLyAgIFwiZmlsZXNEZXN0XCI6IFwiXCJcbiAgLy8gfVxuICAvLyBgYGBcbiAgLy9cbiAgLy8gQWxzbyB0aGUgZm9sbG93aW5nIG9wdGlvbmFsIHBhcmFtZXRlcnMgYXJlIGFjY2VwdGVkOlxuICAvL1xuICAvLyBgYGBqc29uXG4gIC8vIHtcbiAgLy8gICBcImZpbGVzU3JjXCI6IFtcIlwiXSxcbiAgLy8gICBcInBhcmFtc1wiOiB7fSxcbiAgLy8gICBcImN3ZFwiOiBcIlwiLFxuICAvLyAgIFwiaG9zdFwiOiBcImFwaS5qc2NyYW1ibGVyLmNvbVwiLFxuICAvLyAgIFwicG9ydFwiOiBcIjQ0M1wiXG4gIC8vIH1cbiAgLy8gYGBgXG4gIC8vXG4gIC8vIGBmaWxlc1NyY2Agc3VwcG9ydHMgZ2xvYiBwYXR0ZXJucywgYW5kIGlmIGl0J3MgcHJvdmlkZWQgaXQgd2lsbCByZXBsYWNlIHRoZVxuICAvLyBlbnRpcmUgYXBwbGljYXRpb24gc291cmNlcy5cbiAgLy9cbiAgLy8gYHBhcmFtc2AgaWYgcHJvdmlkZWQgd2lsbCByZXBsYWNlIGFsbCB0aGUgYXBwbGljYXRpb24gdHJhbnNmb3JtYXRpb24gcGFyYW1ldGVycy5cbiAgLy9cbiAgLy8gYGN3ZGAgYWxsb3dzIHlvdSB0byBzZXQgdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkgdG8gcmVzb2x2ZSBwcm9ibGVtcyB3aXRoXG4gIC8vIHJlbGF0aXZlIHBhdGhzIHdpdGggeW91ciBgZmlsZXNTcmNgIGlzIG91dHNpZGUgdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3RvcnkuXG4gIC8vXG4gIC8vIEZpbmFsbHksIGBob3N0YCBhbmQgYHBvcnRgIGNhbiBiZSBvdmVycmlkZGVuIGlmIHlvdSB0byBlbmdhZ2Ugd2l0aCBhIGRpZmZlcmVudFxuICAvLyBlbmRwb2ludCB0aGFuIHRoZSBkZWZhdWx0IG9uZSwgdXNlZnVsIGlmIHlvdSdyZSBydW5uaW5nIGFuIGVudGVycHJpc2UgdmVyc2lvbiBvZlxuICAvLyBKc2NyYW1ibGVyIG9yIGlmIHlvdSdyZSBwcm92aWRlZCBhY2Nlc3MgdG8gYmV0YSBmZWF0dXJlcyBvZiBvdXIgcHJvZHVjdC5cbiAgLy9cbiAgYXN5bmMgcHJvdGVjdEFuZERvd25sb2FkIChjb25maWdQYXRoT3JPYmplY3QsIGRlc3RDYWxsYmFjaykge1xuICAgIGNvbnN0IGNvbmZpZyA9IHR5cGVvZiBjb25maWdQYXRoT3JPYmplY3QgPT09ICdzdHJpbmcnID9cbiAgICAgIHJlcXVpcmUoY29uZmlnUGF0aE9yT2JqZWN0KSA6IGNvbmZpZ1BhdGhPck9iamVjdDtcblxuICAgIGNvbnN0IHtcbiAgICAgIGFwcGxpY2F0aW9uSWQsXG4gICAgICBob3N0LFxuICAgICAgcG9ydCxcbiAgICAgIGtleXMsXG4gICAgICBmaWxlc0Rlc3QsXG4gICAgICBmaWxlc1NyYyxcbiAgICAgIGN3ZCxcbiAgICAgIHBhcmFtc1xuICAgIH0gPSBjb25maWc7XG5cbiAgICBjb25zdCB7XG4gICAgICBhY2Nlc3NLZXksXG4gICAgICBzZWNyZXRLZXlcbiAgICB9ID0ga2V5cztcblxuICAgIGNvbnN0IGNsaWVudCA9IG5ldyB0aGlzLkNsaWVudCh7XG4gICAgICBhY2Nlc3NLZXksXG4gICAgICBzZWNyZXRLZXksXG4gICAgICBob3N0LFxuICAgICAgcG9ydFxuICAgIH0pO1xuXG4gICAgaWYgKCFhcHBsaWNhdGlvbklkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkICphcHBsaWNhdGlvbklkKiBub3QgcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoIWZpbGVzRGVzdCAmJiAhZGVzdENhbGxiYWNrKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkICpmaWxlc0Rlc3QqIG5vdCBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIGlmIChmaWxlc1NyYyAmJiBmaWxlc1NyYy5sZW5ndGgpIHtcbiAgICAgIGxldCBfZmlsZXNTcmMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZmlsZXNTcmMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZmlsZXNTcmNbaV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgLy8gVE9ETyBSZXBsYWNlIGBnbG9iLnN5bmNgIHdpdGggYXN5bmMgdmVyc2lvblxuICAgICAgICAgIF9maWxlc1NyYyA9IF9maWxlc1NyYy5jb25jYXQoZ2xvYi5zeW5jKGZpbGVzU3JjW2ldLCB7ZG90OiB0cnVlfSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9maWxlc1NyYy5wdXNoKGZpbGVzU3JjW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBfemlwID0gYXdhaXQgemlwKGZpbGVzU3JjLCBjd2QpO1xuXG4gICAgICBjb25zdCByZW1vdmVTb3VyY2VSZXMgPSBhd2FpdCB0aGlzLnJlbW92ZVNvdXJjZUZyb21BcHBsaWNhdGlvbihjbGllbnQsICcnLCBhcHBsaWNhdGlvbklkKTtcbiAgICAgIGlmIChyZW1vdmVTb3VyY2VSZXMuZXJyb3JzKSB7XG4gICAgICAgIC8vIFRPRE8gSW1wbGVtZW50IGVycm9yIGNvZGVzIG9yIGZpeCB0aGlzIGlzIG9uIHRoZSBzZXJ2aWNlc1xuICAgICAgICB2YXIgaGFkTm9Tb3VyY2VzID0gZmFsc2U7XG4gICAgICAgIHJlbW92ZVNvdXJjZVJlcy5lcnJvcnMuZm9yRWFjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICBpZiAoZXJyb3IubWVzc2FnZSA9PT0gJ0FwcGxpY2F0aW9uIFNvdXJjZSB3aXRoIHRoZSBnaXZlbiBJRCBkb2VzIG5vdCBleGlzdCcpIHtcbiAgICAgICAgICAgIGhhZE5vU291cmNlcyA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFoYWROb1NvdXJjZXMpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIHJlbW92aW5nIGFwcGxpY2F0aW9uIHNvdXJjZXMnKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBhZGRBcHBsaWNhdGlvblNvdXJjZVJlcyA9IGF3YWl0IHRoaXMuYWRkQXBwbGljYXRpb25Tb3VyY2UoY2xpZW50LCBhcHBsaWNhdGlvbklkLCB7XG4gICAgICAgIGNvbnRlbnQ6IF96aXAuZ2VuZXJhdGUoe3R5cGU6ICdiYXNlNjQnfSksXG4gICAgICAgIGZpbGVuYW1lOiAnYXBwbGljYXRpb24uemlwJyxcbiAgICAgICAgZXh0ZW5zaW9uOiAnemlwJ1xuICAgICAgfSk7XG4gICAgICBpZiAoYWRkQXBwbGljYXRpb25Tb3VyY2VSZXMuZXJyb3JzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgdXBsb2FkaW5nIGZpbGVzJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtcyAmJiBPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCkge1xuICAgICAgY29uc3QgYXJlUGFyYW1ldGVyc09yZGVyZWQgPSBBcnJheS5pc0FycmF5KHBhcmFtcyk7XG4gICAgICBjb25zdCB1cGRhdGVBcHBsaWNhdGlvblJlcyA9IGF3YWl0IHRoaXMudXBkYXRlQXBwbGljYXRpb24oY2xpZW50LCB7XG4gICAgICAgIF9pZDogYXBwbGljYXRpb25JZCxcbiAgICAgICAgcGFyYW1ldGVyczogSlNPTi5zdHJpbmdpZnkobm9ybWFsaXplUGFyYW1ldGVycyhwYXJhbXMpKSxcbiAgICAgICAgYXJlUGFyYW1ldGVyc09yZGVyZWRcbiAgICAgIH0pO1xuICAgICAgaWYgKHVwZGF0ZUFwcGxpY2F0aW9uUmVzLmVycm9ycykge1xuICAgICAgICBjb25zb2xlLmVycm9yKHVwZGF0ZUFwcGxpY2F0aW9uUmVzLmVycm9ycyk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgdXBkYXRpbmcgdGhlIGFwcGxpY2F0aW9uJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uUmVzID0gYXdhaXQgdGhpcy5jcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb24oY2xpZW50LCBhcHBsaWNhdGlvbklkKTtcbiAgICBpZiAoY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uUmVzLmVycm9ycykge1xuICAgICAgY29uc29sZS5lcnJvcihjcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb25SZXMuZXJyb3JzKTtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgY3JlYXRpbmcgYXBwbGljYXRpb24gcHJvdGVjdGlvbicpO1xuICAgIH1cblxuICAgIGNvbnN0IHByb3RlY3Rpb25JZCA9IGNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvblJlcy5kYXRhLmNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvbi5faWQ7XG4gICAgYXdhaXQgdGhpcy5wb2xsUHJvdGVjdGlvbihjbGllbnQsIGFwcGxpY2F0aW9uSWQsIHByb3RlY3Rpb25JZCk7XG5cbiAgICBjb25zdCBkb3dubG9hZCA9IGF3YWl0IHRoaXMuZG93bmxvYWRBcHBsaWNhdGlvblByb3RlY3Rpb24oY2xpZW50LCBwcm90ZWN0aW9uSWQpO1xuICAgIHVuemlwKGRvd25sb2FkLCBmaWxlc0Rlc3QgfHwgZGVzdENhbGxiYWNrKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgcG9sbFByb3RlY3Rpb24gKGNsaWVudCwgYXBwbGljYXRpb25JZCwgcHJvdGVjdGlvbklkKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG5cbiAgICBjb25zdCBwb2xsID0gYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwbGljYXRpb25Qcm90ZWN0aW9uID0gYXdhaXQgdGhpcy5nZXRBcHBsaWNhdGlvblByb3RlY3Rpb24oY2xpZW50LCBhcHBsaWNhdGlvbklkLCBwcm90ZWN0aW9uSWQpO1xuICAgICAgaWYgKGFwcGxpY2F0aW9uUHJvdGVjdGlvbi5lcnJvcnMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFcnJvciBwb2xsaW5nIHByb3RlY3Rpb24nKTtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KCdFcnJvciBwb2xsaW5nIHByb3RlY3Rpb24nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHN0YXRlID0gYXBwbGljYXRpb25Qcm90ZWN0aW9uLmRhdGEuYXBwbGljYXRpb25Qcm90ZWN0aW9uLnN0YXRlO1xuICAgICAgICBpZiAoc3RhdGUgIT09ICdmaW5pc2hlZCcgJiYgc3RhdGUgIT09ICdlcnJvcmVkJykge1xuICAgICAgICAgIHNldFRpbWVvdXQocG9sbCwgNTAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcG9sbCgpO1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGNyZWF0ZUFwcGxpY2F0aW9uIChjbGllbnQsIGRhdGEsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCBjcmVhdGVBcHBsaWNhdGlvbihkYXRhLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGR1cGxpY2F0ZUFwcGxpY2F0aW9uIChjbGllbnQsIGRhdGEsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCBkdXBsaWNhdGVBcHBsaWNhdGlvbihkYXRhLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHJlbW92ZUFwcGxpY2F0aW9uIChjbGllbnQsIGlkKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHJlbW92ZUFwcGxpY2F0aW9uKGlkKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyByZW1vdmVQcm90ZWN0aW9uIChjbGllbnQsIGlkLCBhcHBJZCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHJlbW92ZVByb3RlY3Rpb24oaWQsIGFwcElkLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHVwZGF0ZUFwcGxpY2F0aW9uIChjbGllbnQsIGFwcGxpY2F0aW9uLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgdXBkYXRlQXBwbGljYXRpb24oYXBwbGljYXRpb24sIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgdW5sb2NrQXBwbGljYXRpb24gKGNsaWVudCwgYXBwbGljYXRpb24sIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCB1bmxvY2tBcHBsaWNhdGlvbihhcHBsaWNhdGlvbiwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBnZXRBcHBsaWNhdGlvbiAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KCcvYXBwbGljYXRpb24nLCBnZXRBcHBsaWNhdGlvbihhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGdldEFwcGxpY2F0aW9uU291cmNlIChjbGllbnQsIHNvdXJjZUlkLCBmcmFnbWVudHMsIGxpbWl0cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldEFwcGxpY2F0aW9uU291cmNlKHNvdXJjZUlkLCBmcmFnbWVudHMsIGxpbWl0cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9ucyAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBwYXJhbXMsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnMoYXBwbGljYXRpb25JZCwgcGFyYW1zLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNDb3VudCAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KCcvYXBwbGljYXRpb24nLCBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zQ291bnQoYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBjcmVhdGVUZW1wbGF0ZSAoY2xpZW50LCB0ZW1wbGF0ZSwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIGNyZWF0ZVRlbXBsYXRlKHRlbXBsYXRlLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHJlbW92ZVRlbXBsYXRlIChjbGllbnQsIGlkKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHJlbW92ZVRlbXBsYXRlKGlkKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBnZXRUZW1wbGF0ZXMgKGNsaWVudCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LmdldCgnL2FwcGxpY2F0aW9uJywgZ2V0VGVtcGxhdGVzKGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZ2V0QXBwbGljYXRpb25zIChjbGllbnQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldEFwcGxpY2F0aW9ucyhmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGFkZEFwcGxpY2F0aW9uU291cmNlIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIGFwcGxpY2F0aW9uU291cmNlLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgYWRkQXBwbGljYXRpb25Tb3VyY2UoYXBwbGljYXRpb25JZCwgYXBwbGljYXRpb25Tb3VyY2UsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgYWRkQXBwbGljYXRpb25Tb3VyY2VGcm9tVVJMIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIHVybCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgcmV0dXJuIGdldEZpbGVGcm9tVXJsKGNsaWVudCwgdXJsKVxuICAgICAgLnRoZW4oZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgYWRkQXBwbGljYXRpb25Tb3VyY2UoYXBwbGljYXRpb25JZCwgZmlsZSwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlIChjbGllbnQsIGFwcGxpY2F0aW9uU291cmNlLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgdXBkYXRlQXBwbGljYXRpb25Tb3VyY2UoYXBwbGljYXRpb25Tb3VyY2UsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgcmVtb3ZlU291cmNlRnJvbUFwcGxpY2F0aW9uIChjbGllbnQsIHNvdXJjZUlkLCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgcmVtb3ZlU291cmNlRnJvbUFwcGxpY2F0aW9uKHNvdXJjZUlkLCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGFwcGx5VGVtcGxhdGUgKGNsaWVudCwgdGVtcGxhdGVJZCwgYXBwSWQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCBhcHBseVRlbXBsYXRlKHRlbXBsYXRlSWQsIGFwcElkLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZS50aGVuKGVycm9ySGFuZGxlcik7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHVwZGF0ZVRlbXBsYXRlIChjbGllbnQsIHRlbXBsYXRlLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgdXBkYXRlVGVtcGxhdGUodGVtcGxhdGUsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCBjcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb24oYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb24gKGNsaWVudCwgYXBwbGljYXRpb25JZCwgcHJvdGVjdGlvbklkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KCcvYXBwbGljYXRpb24nLCBnZXRQcm90ZWN0aW9uKGFwcGxpY2F0aW9uSWQsIHByb3RlY3Rpb25JZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2UudGhlbihlcnJvckhhbmRsZXIpO1xuICB9LFxuICAvL1xuICBhc3luYyBkb3dubG9hZEFwcGxpY2F0aW9uUHJvdGVjdGlvbiAoY2xpZW50LCBwcm90ZWN0aW9uSWQpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KGAvYXBwbGljYXRpb24vZG93bmxvYWQvJHtwcm90ZWN0aW9uSWR9YCwgbnVsbCwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSwgZmFsc2UpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlLnRoZW4oZXJyb3JIYW5kbGVyKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZ2V0RmlsZUZyb21VcmwgKGNsaWVudCwgdXJsKSB7XG4gIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICB2YXIgZmlsZTtcbiAgcmVxdWVzdC5nZXQodXJsKVxuICAgIC50aGVuKChyZXMpID0+IHtcbiAgICAgIGZpbGUgPSB7XG4gICAgICAgIGNvbnRlbnQ6IHJlcy5kYXRhLFxuICAgICAgICBmaWxlbmFtZTogcGF0aC5iYXNlbmFtZSh1cmwpLFxuICAgICAgICBleHRlbnNpb246IHBhdGguZXh0bmFtZSh1cmwpLnN1YnN0cigxKVxuICAgICAgfTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoZmlsZSk7XG4gICAgfSlcbiAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5mdW5jdGlvbiByZXNwb25zZUhhbmRsZXIgKGRlZmVycmVkKSB7XG4gIHJldHVybiAoZXJyLCByZXMpID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJvZHkgPSByZXMuZGF0YTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChyZXMuc3RhdHVzID49IDQwMCkge1xuICAgICAgICAgIGRlZmVycmVkLnJlamVjdChib2R5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGJvZHkpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoYm9keSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBlcnJvckhhbmRsZXIgKHJlcykge1xuICBpZiAocmVzLmVycm9ycyAmJiByZXMuZXJyb3JzLmxlbmd0aCkge1xuICAgIHJlcy5lcnJvcnMuZm9yRWFjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVQYXJhbWV0ZXJzIChwYXJhbWV0ZXJzKSB7XG4gIHZhciByZXN1bHQ7XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KHBhcmFtZXRlcnMpKSB7XG4gICAgcmVzdWx0ID0gW107XG4gICAgT2JqZWN0LmtleXMocGFyYW1ldGVycykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICBuYW1lLFxuICAgICAgICBvcHRpb25zOiBwYXJhbWV0ZXJzW25hbWVdXG4gICAgICB9KVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9IHBhcmFtZXRlcnM7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIl19
