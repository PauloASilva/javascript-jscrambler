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
      var config, applicationId, host, port, keys, filesDest, filesSrc, cwd, params, applicationTypes, languageSpecifications, accessKey, secretKey, client, _filesSrc, i, l, _zip, removeSourceRes, hadNoSources, addApplicationSourceRes, $set, updateApplicationRes, createApplicationProtectionRes, protectionId, download;

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
              applicationTypes = config.applicationTypes;
              languageSpecifications = config.languageSpecifications;
              accessKey = keys.accessKey;
              secretKey = keys.secretKey;
              client = new _this.Client({
                accessKey: accessKey,
                secretKey: secretKey,
                host: host,
                port: port
              });

              if (applicationId) {
                _context.next = 16;
                break;
              }

              throw new Error('Required *applicationId* not provided');

            case 16:
              if (!(!filesDest && !destCallback)) {
                _context.next = 18;
                break;
              }

              throw new Error('Required *filesDest* not provided');

            case 18:
              if (!(filesSrc && filesSrc.length)) {
                _context.next = 36;
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

              _context.next = 23;
              return (0, _zip2.zip)(filesSrc, cwd);

            case 23:
              _zip = _context.sent;
              _context.next = 26;
              return _this.removeSourceFromApplication(client, '', applicationId);

            case 26:
              removeSourceRes = _context.sent;

              if (!removeSourceRes.errors) {
                _context.next = 32;
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
                _context.next = 32;
                break;
              }

              throw new Error(removeSourceRes.errors[0].message);

            case 32:
              _context.next = 34;
              return _this.addApplicationSource(client, applicationId, {
                content: _zip.generate({ type: 'base64' }),
                filename: 'application.zip',
                extension: 'zip'
              });

            case 34:
              addApplicationSourceRes = _context.sent;

              errorHandler(addApplicationSourceRes);

            case 36:
              $set = {
                _id: applicationId
              };


              if (params && Object.keys(params).length) {
                $set.parameters = JSON.stringify(normalizeParameters(params));
                $set.areSubscribersOrdered = Array.isArray(params);
              }

              if (typeof areSubscribersOrdered !== 'undefined') {
                $set.areSubscribersOrdered = areSubscribersOrdered;
              }

              if (applicationTypes) {
                $set.applicationTypes = applicationTypes;
              }

              if (languageSpecifications) {
                $set.languageSpecifications = languageSpecifications;
              }

              if (!($set.parameters || $set.applicationTypes || $set.languageSpecifications || typeof $set.areSubscribersOrdered !== 'undefined')) {
                _context.next = 46;
                break;
              }

              _context.next = 44;
              return _this.updateApplication(client, $set);

            case 44:
              updateApplicationRes = _context.sent;

              errorHandler(updateApplicationRes);

            case 46:
              _context.next = 48;
              return _this.createApplicationProtection(client, applicationId);

            case 48:
              createApplicationProtectionRes = _context.sent;

              errorHandler(createApplicationProtectionRes);

              protectionId = createApplicationProtectionRes.data.createApplicationProtection._id;
              _context.next = 53;
              return _this.pollProtection(client, applicationId, protectionId);

            case 53:
              _context.next = 55;
              return _this.downloadApplicationProtection(client, protectionId);

            case 55:
              download = _context.sent;

              errorHandler(download);
              (0, _zip2.unzip)(download, filesDest || destCallback);

            case 58:
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
                          } else if (state === 'errored') {
                            deferred.reject('Protection failed. For more information visit: https://app.jscrambler.com');
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
              return _context4.abrupt('return', deferred.promise);

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
              return _context5.abrupt('return', deferred.promise);

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
              return _context6.abrupt('return', deferred.promise);

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
              return _context7.abrupt('return', deferred.promise);

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
              return _context8.abrupt('return', deferred.promise);

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
              return _context9.abrupt('return', deferred.promise);

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
              return _context10.abrupt('return', deferred.promise);

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
              return _context11.abrupt('return', deferred.promise);

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
              return _context12.abrupt('return', deferred.promise);

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
              return _context13.abrupt('return', deferred.promise);

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
              return _context14.abrupt('return', deferred.promise);

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
              return _context15.abrupt('return', deferred.promise);

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
              return _context16.abrupt('return', deferred.promise);

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
              return _context17.abrupt('return', deferred.promise);

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
              return _context18.abrupt('return', deferred.promise);

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
              }));

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
              return _context20.abrupt('return', deferred.promise);

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
              return _context21.abrupt('return', deferred.promise);

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
              return _context22.abrupt('return', deferred.promise);

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
              return _context23.abrupt('return', deferred.promise);

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
              return _context24.abrupt('return', deferred.promise);

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
              return _context25.abrupt('return', deferred.promise);

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
              return _context26.abrupt('return', deferred.promise);

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
      throw new Error(error.message);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFnQkE7O0FBU0E7Ozs7OztrQkFLZTtBQUNiLDBCQURhO0FBRWIsMEJBRmE7QUFHYixzREFIYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQThDUCxvQkE5Q08sOEJBOENhLGtCQTlDYixFQThDaUMsWUE5Q2pDLEVBOEMrQztBQUFBOztBQUFBO0FBQUEsVUFDcEQsTUFEb0QsRUFLeEQsYUFMd0QsRUFNeEQsSUFOd0QsRUFPeEQsSUFQd0QsRUFReEQsSUFSd0QsRUFTeEQsU0FUd0QsRUFVeEQsUUFWd0QsRUFXeEQsR0FYd0QsRUFZeEQsTUFad0QsRUFheEQsZ0JBYndELEVBY3hELHNCQWR3RCxFQWtCeEQsU0FsQndELEVBbUJ4RCxTQW5Cd0QsRUFzQnBELE1BdEJvRCxFQXNDcEQsU0F0Q29ELEVBdUMvQyxDQXZDK0MsRUF1Q3hDLENBdkN3QyxFQWdEbEQsSUFoRGtELEVBa0RsRCxlQWxEa0QsRUFxRGxELFlBckRrRCxFQWdFbEQsdUJBaEVrRCxFQXdFcEQsSUF4RW9ELEVBK0ZsRCxvQkEvRmtELEVBbUdwRCw4QkFuR29ELEVBc0dwRCxZQXRHb0QsRUF5R3BELFFBekdvRDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNwRCxvQkFEb0QsR0FDM0MsT0FBTyxrQkFBUCxLQUE4QixRQUE5QixHQUNiLFFBQVEsa0JBQVIsQ0FEYSxHQUNpQixrQkFGMEI7QUFLeEQsMkJBTHdELEdBZXRELE1BZnNELENBS3hELGFBTHdEO0FBTXhELGtCQU53RCxHQWV0RCxNQWZzRCxDQU14RCxJQU53RDtBQU94RCxrQkFQd0QsR0FldEQsTUFmc0QsQ0FPeEQsSUFQd0Q7QUFReEQsa0JBUndELEdBZXRELE1BZnNELENBUXhELElBUndE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QUksS0FBSixDQUFVLE1BQU0sT0FBaEIsQ0FBTjtBQUNELEtBRkQ7QUFHRDs7QUFFRCxTQUFPLEdBQVA7QUFDRDs7QUFFRCxTQUFTLG1CQUFULENBQThCLFVBQTlCLEVBQTBDO0FBQ3hDLE1BQUksTUFBSjs7QUFFQSxNQUFJLENBQUMsTUFBTSxPQUFOLENBQWMsVUFBZCxDQUFMLEVBQWdDO0FBQzlCLGFBQVMsRUFBVDtBQUNBLFdBQU8sSUFBUCxDQUFZLFVBQVosRUFBd0IsT0FBeEIsQ0FBZ0MsVUFBQyxJQUFELEVBQVU7QUFDeEMsYUFBTyxJQUFQLENBQVk7QUFDVixrQkFEVTtBQUVWLGlCQUFTLFdBQVcsSUFBWDtBQUZDLE9BQVo7QUFJRCxLQUxEO0FBTUQsR0FSRCxNQVFPO0FBQ0wsYUFBUyxVQUFUO0FBQ0Q7O0FBRUQsU0FBTyxNQUFQO0FBQ0QiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJ2JhYmVsLXBvbHlmaWxsJztcblxuaW1wb3J0IGdsb2IgZnJvbSAnZ2xvYic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCByZXF1ZXN0IGZyb20gJ2F4aW9zJztcbmltcG9ydCBRIGZyb20gJ3EnO1xuXG5pbXBvcnQgY29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCBnZW5lcmF0ZVNpZ25lZFBhcmFtcyBmcm9tICcuL2dlbmVyYXRlLXNpZ25lZC1wYXJhbXMnO1xuaW1wb3J0IEpTY3JhbWJsZXJDbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IHtcbiAgYWRkQXBwbGljYXRpb25Tb3VyY2UsXG4gIGNyZWF0ZUFwcGxpY2F0aW9uLFxuICByZW1vdmVBcHBsaWNhdGlvbixcbiAgdXBkYXRlQXBwbGljYXRpb24sXG4gIHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlLFxuICByZW1vdmVTb3VyY2VGcm9tQXBwbGljYXRpb24sXG4gIGNyZWF0ZVRlbXBsYXRlLFxuICByZW1vdmVUZW1wbGF0ZSxcbiAgdXBkYXRlVGVtcGxhdGUsXG4gIGNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvbixcbiAgcmVtb3ZlUHJvdGVjdGlvbixcbiAgZHVwbGljYXRlQXBwbGljYXRpb24sXG4gIHVubG9ja0FwcGxpY2F0aW9uLFxuICBhcHBseVRlbXBsYXRlXG59IGZyb20gJy4vbXV0YXRpb25zJztcbmltcG9ydCB7XG4gIGdldEFwcGxpY2F0aW9uLFxuICBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zLFxuICBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zQ291bnQsXG4gIGdldEFwcGxpY2F0aW9ucyxcbiAgZ2V0QXBwbGljYXRpb25Tb3VyY2UsXG4gIGdldFRlbXBsYXRlcyxcbiAgZ2V0UHJvdGVjdGlvblxufSBmcm9tICcuL3F1ZXJpZXMnO1xuaW1wb3J0IHtcbiAgemlwLFxuICB1bnppcFxufSBmcm9tICcuL3ppcCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgQ2xpZW50OiBKU2NyYW1ibGVyQ2xpZW50LFxuICBjb25maWcsXG4gIGdlbmVyYXRlU2lnbmVkUGFyYW1zLFxuICAvLyBUaGlzIG1ldGhvZCBpcyBhIHNob3J0Y3V0IG1ldGhvZCB0aGF0IGFjY2VwdHMgYW4gb2JqZWN0IHdpdGggZXZlcnl0aGluZyBuZWVkZWRcbiAgLy8gZm9yIHRoZSBlbnRpcmUgcHJvY2VzcyBvZiByZXF1ZXN0aW5nIGFuIGFwcGxpY2F0aW9uIHByb3RlY3Rpb24gYW5kIGRvd25sb2FkaW5nXG4gIC8vIHRoYXQgc2FtZSBwcm90ZWN0aW9uIHdoZW4gdGhlIHNhbWUgZW5kcy5cbiAgLy9cbiAgLy8gYGNvbmZpZ1BhdGhPck9iamVjdGAgY2FuIGJlIGEgcGF0aCB0byBhIEpTT04gb3IgZGlyZWN0bHkgYW4gb2JqZWN0IGNvbnRhaW5pbmdcbiAgLy8gdGhlIGZvbGxvd2luZyBzdHJ1Y3R1cmU6XG4gIC8vXG4gIC8vIGBgYGpzb25cbiAgLy8ge1xuICAvLyAgIFwia2V5c1wiOiB7XG4gIC8vICAgICBcImFjY2Vzc0tleVwiOiBcIlwiLFxuICAvLyAgICAgXCJzZWNyZXRLZXlcIjogXCJcIlxuICAvLyAgIH0sXG4gIC8vICAgXCJhcHBsaWNhdGlvbklkXCI6IFwiXCIsXG4gIC8vICAgXCJmaWxlc0Rlc3RcIjogXCJcIlxuICAvLyB9XG4gIC8vIGBgYFxuICAvL1xuICAvLyBBbHNvIHRoZSBmb2xsb3dpbmcgb3B0aW9uYWwgcGFyYW1ldGVycyBhcmUgYWNjZXB0ZWQ6XG4gIC8vXG4gIC8vIGBgYGpzb25cbiAgLy8ge1xuICAvLyAgIFwiZmlsZXNTcmNcIjogW1wiXCJdLFxuICAvLyAgIFwicGFyYW1zXCI6IHt9LFxuICAvLyAgIFwiY3dkXCI6IFwiXCIsXG4gIC8vICAgXCJob3N0XCI6IFwiYXBpLmpzY3JhbWJsZXIuY29tXCIsXG4gIC8vICAgXCJwb3J0XCI6IFwiNDQzXCJcbiAgLy8gfVxuICAvLyBgYGBcbiAgLy9cbiAgLy8gYGZpbGVzU3JjYCBzdXBwb3J0cyBnbG9iIHBhdHRlcm5zLCBhbmQgaWYgaXQncyBwcm92aWRlZCBpdCB3aWxsIHJlcGxhY2UgdGhlXG4gIC8vIGVudGlyZSBhcHBsaWNhdGlvbiBzb3VyY2VzLlxuICAvL1xuICAvLyBgcGFyYW1zYCBpZiBwcm92aWRlZCB3aWxsIHJlcGxhY2UgYWxsIHRoZSBhcHBsaWNhdGlvbiB0cmFuc2Zvcm1hdGlvbiBwYXJhbWV0ZXJzLlxuICAvL1xuICAvLyBgY3dkYCBhbGxvd3MgeW91IHRvIHNldCB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeSB0byByZXNvbHZlIHByb2JsZW1zIHdpdGhcbiAgLy8gcmVsYXRpdmUgcGF0aHMgd2l0aCB5b3VyIGBmaWxlc1NyY2AgaXMgb3V0c2lkZSB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS5cbiAgLy9cbiAgLy8gRmluYWxseSwgYGhvc3RgIGFuZCBgcG9ydGAgY2FuIGJlIG92ZXJyaWRkZW4gaWYgeW91IHRvIGVuZ2FnZSB3aXRoIGEgZGlmZmVyZW50XG4gIC8vIGVuZHBvaW50IHRoYW4gdGhlIGRlZmF1bHQgb25lLCB1c2VmdWwgaWYgeW91J3JlIHJ1bm5pbmcgYW4gZW50ZXJwcmlzZSB2ZXJzaW9uIG9mXG4gIC8vIEpzY3JhbWJsZXIgb3IgaWYgeW91J3JlIHByb3ZpZGVkIGFjY2VzcyB0byBiZXRhIGZlYXR1cmVzIG9mIG91ciBwcm9kdWN0LlxuICAvL1xuICBhc3luYyBwcm90ZWN0QW5kRG93bmxvYWQgKGNvbmZpZ1BhdGhPck9iamVjdCwgZGVzdENhbGxiYWNrKSB7XG4gICAgY29uc3QgY29uZmlnID0gdHlwZW9mIGNvbmZpZ1BhdGhPck9iamVjdCA9PT0gJ3N0cmluZycgP1xuICAgICAgcmVxdWlyZShjb25maWdQYXRoT3JPYmplY3QpIDogY29uZmlnUGF0aE9yT2JqZWN0O1xuXG4gICAgY29uc3Qge1xuICAgICAgYXBwbGljYXRpb25JZCxcbiAgICAgIGhvc3QsXG4gICAgICBwb3J0LFxuICAgICAga2V5cyxcbiAgICAgIGZpbGVzRGVzdCxcbiAgICAgIGZpbGVzU3JjLFxuICAgICAgY3dkLFxuICAgICAgcGFyYW1zLFxuICAgICAgYXBwbGljYXRpb25UeXBlcyxcbiAgICAgIGxhbmd1YWdlU3BlY2lmaWNhdGlvbnNcbiAgICB9ID0gY29uZmlnO1xuXG4gICAgY29uc3Qge1xuICAgICAgYWNjZXNzS2V5LFxuICAgICAgc2VjcmV0S2V5XG4gICAgfSA9IGtleXM7XG5cbiAgICBjb25zdCBjbGllbnQgPSBuZXcgdGhpcy5DbGllbnQoe1xuICAgICAgYWNjZXNzS2V5LFxuICAgICAgc2VjcmV0S2V5LFxuICAgICAgaG9zdCxcbiAgICAgIHBvcnRcbiAgICB9KTtcblxuICAgIGlmICghYXBwbGljYXRpb25JZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXF1aXJlZCAqYXBwbGljYXRpb25JZCogbm90IHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKCFmaWxlc0Rlc3QgJiYgIWRlc3RDYWxsYmFjaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXF1aXJlZCAqZmlsZXNEZXN0KiBub3QgcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoZmlsZXNTcmMgJiYgZmlsZXNTcmMubGVuZ3RoKSB7XG4gICAgICBsZXQgX2ZpbGVzU3JjID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGZpbGVzU3JjLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICBpZiAodHlwZW9mIGZpbGVzU3JjW2ldID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIC8vIFRPRE8gUmVwbGFjZSBgZ2xvYi5zeW5jYCB3aXRoIGFzeW5jIHZlcnNpb25cbiAgICAgICAgICBfZmlsZXNTcmMgPSBfZmlsZXNTcmMuY29uY2F0KGdsb2Iuc3luYyhmaWxlc1NyY1tpXSwge2RvdDogdHJ1ZX0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfZmlsZXNTcmMucHVzaChmaWxlc1NyY1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgX3ppcCA9IGF3YWl0IHppcChmaWxlc1NyYywgY3dkKTtcblxuICAgICAgY29uc3QgcmVtb3ZlU291cmNlUmVzID0gYXdhaXQgdGhpcy5yZW1vdmVTb3VyY2VGcm9tQXBwbGljYXRpb24oY2xpZW50LCAnJywgYXBwbGljYXRpb25JZCk7XG4gICAgICBpZiAocmVtb3ZlU291cmNlUmVzLmVycm9ycykge1xuICAgICAgICAvLyBUT0RPIEltcGxlbWVudCBlcnJvciBjb2RlcyBvciBmaXggdGhpcyBpcyBvbiB0aGUgc2VydmljZXNcbiAgICAgICAgdmFyIGhhZE5vU291cmNlcyA9IGZhbHNlO1xuICAgICAgICByZW1vdmVTb3VyY2VSZXMuZXJyb3JzLmZvckVhY2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgaWYgKGVycm9yLm1lc3NhZ2UgPT09ICdBcHBsaWNhdGlvbiBTb3VyY2Ugd2l0aCB0aGUgZ2l2ZW4gSUQgZG9lcyBub3QgZXhpc3QnKSB7XG4gICAgICAgICAgICBoYWROb1NvdXJjZXMgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghaGFkTm9Tb3VyY2VzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlbW92ZVNvdXJjZVJlcy5lcnJvcnNbMF0ubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgYWRkQXBwbGljYXRpb25Tb3VyY2VSZXMgPSBhd2FpdCB0aGlzLmFkZEFwcGxpY2F0aW9uU291cmNlKGNsaWVudCwgYXBwbGljYXRpb25JZCwge1xuICAgICAgICBjb250ZW50OiBfemlwLmdlbmVyYXRlKHt0eXBlOiAnYmFzZTY0J30pLFxuICAgICAgICBmaWxlbmFtZTogJ2FwcGxpY2F0aW9uLnppcCcsXG4gICAgICAgIGV4dGVuc2lvbjogJ3ppcCdcbiAgICAgIH0pO1xuICAgICAgZXJyb3JIYW5kbGVyKGFkZEFwcGxpY2F0aW9uU291cmNlUmVzKTtcbiAgICB9XG5cbiAgICBjb25zdCAkc2V0ID0ge1xuICAgICAgX2lkOiBhcHBsaWNhdGlvbklkXG4gICAgfTtcblxuICAgIGlmIChwYXJhbXMgJiYgT2JqZWN0LmtleXMocGFyYW1zKS5sZW5ndGgpIHtcbiAgICAgICRzZXQucGFyYW1ldGVycyA9IEpTT04uc3RyaW5naWZ5KG5vcm1hbGl6ZVBhcmFtZXRlcnMocGFyYW1zKSk7XG4gICAgICAkc2V0LmFyZVN1YnNjcmliZXJzT3JkZXJlZCA9IEFycmF5LmlzQXJyYXkocGFyYW1zKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGFyZVN1YnNjcmliZXJzT3JkZXJlZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICRzZXQuYXJlU3Vic2NyaWJlcnNPcmRlcmVkID0gYXJlU3Vic2NyaWJlcnNPcmRlcmVkO1xuICAgIH1cblxuICAgIGlmIChhcHBsaWNhdGlvblR5cGVzKSB7XG4gICAgICAkc2V0LmFwcGxpY2F0aW9uVHlwZXMgPSBhcHBsaWNhdGlvblR5cGVzO1xuICAgIH1cblxuICAgIGlmIChsYW5ndWFnZVNwZWNpZmljYXRpb25zKSB7XG4gICAgICAkc2V0Lmxhbmd1YWdlU3BlY2lmaWNhdGlvbnMgPSBsYW5ndWFnZVNwZWNpZmljYXRpb25zO1xuICAgIH1cblxuICAgIGlmICgkc2V0LnBhcmFtZXRlcnMgfHwgJHNldC5hcHBsaWNhdGlvblR5cGVzIHx8ICRzZXQubGFuZ3VhZ2VTcGVjaWZpY2F0aW9ucyB8fFxuICAgICAgICB0eXBlb2YgJHNldC5hcmVTdWJzY3JpYmVyc09yZGVyZWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zdCB1cGRhdGVBcHBsaWNhdGlvblJlcyA9IGF3YWl0IHRoaXMudXBkYXRlQXBwbGljYXRpb24oY2xpZW50LCAkc2V0KTtcbiAgICAgIGVycm9ySGFuZGxlcih1cGRhdGVBcHBsaWNhdGlvblJlcyk7XG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uUmVzID0gYXdhaXQgdGhpcy5jcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb24oY2xpZW50LCBhcHBsaWNhdGlvbklkKTtcbiAgICBlcnJvckhhbmRsZXIoY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uUmVzKTtcblxuICAgIGNvbnN0IHByb3RlY3Rpb25JZCA9IGNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvblJlcy5kYXRhLmNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvbi5faWQ7XG4gICAgYXdhaXQgdGhpcy5wb2xsUHJvdGVjdGlvbihjbGllbnQsIGFwcGxpY2F0aW9uSWQsIHByb3RlY3Rpb25JZCk7XG5cbiAgICBjb25zdCBkb3dubG9hZCA9IGF3YWl0IHRoaXMuZG93bmxvYWRBcHBsaWNhdGlvblByb3RlY3Rpb24oY2xpZW50LCBwcm90ZWN0aW9uSWQpO1xuICAgIGVycm9ySGFuZGxlcihkb3dubG9hZCk7XG4gICAgdW56aXAoZG93bmxvYWQsIGZpbGVzRGVzdCB8fCBkZXN0Q2FsbGJhY2spO1xuICB9LFxuICAvL1xuICBhc3luYyBwb2xsUHJvdGVjdGlvbiAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBwcm90ZWN0aW9uSWQpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblxuICAgIGNvbnN0IHBvbGwgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBhcHBsaWNhdGlvblByb3RlY3Rpb24gPSBhd2FpdCB0aGlzLmdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbihjbGllbnQsIGFwcGxpY2F0aW9uSWQsIHByb3RlY3Rpb25JZCk7XG4gICAgICBpZiAoYXBwbGljYXRpb25Qcm90ZWN0aW9uLmVycm9ycykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIHBvbGxpbmcgcHJvdGVjdGlvbicpO1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0Vycm9yIHBvbGxpbmcgcHJvdGVjdGlvbicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSBhcHBsaWNhdGlvblByb3RlY3Rpb24uZGF0YS5hcHBsaWNhdGlvblByb3RlY3Rpb24uc3RhdGU7XG4gICAgICAgIGlmIChzdGF0ZSAhPT0gJ2ZpbmlzaGVkJyAmJiBzdGF0ZSAhPT0gJ2Vycm9yZWQnKSB7XG4gICAgICAgICAgc2V0VGltZW91dChwb2xsLCA1MDApO1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXRlID09PSAnZXJyb3JlZCcpIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ1Byb3RlY3Rpb24gZmFpbGVkLiBGb3IgbW9yZSBpbmZvcm1hdGlvbiB2aXNpdDogaHR0cHM6Ly9hcHAuanNjcmFtYmxlci5jb20nKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcG9sbCgpO1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGNyZWF0ZUFwcGxpY2F0aW9uIChjbGllbnQsIGRhdGEsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCBjcmVhdGVBcHBsaWNhdGlvbihkYXRhLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZHVwbGljYXRlQXBwbGljYXRpb24gKGNsaWVudCwgZGF0YSwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIGR1cGxpY2F0ZUFwcGxpY2F0aW9uKGRhdGEsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyByZW1vdmVBcHBsaWNhdGlvbiAoY2xpZW50LCBpZCkge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCByZW1vdmVBcHBsaWNhdGlvbihpZCksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyByZW1vdmVQcm90ZWN0aW9uIChjbGllbnQsIGlkLCBhcHBJZCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHJlbW92ZVByb3RlY3Rpb24oaWQsIGFwcElkLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgdXBkYXRlQXBwbGljYXRpb24gKGNsaWVudCwgYXBwbGljYXRpb24sIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCB1cGRhdGVBcHBsaWNhdGlvbihhcHBsaWNhdGlvbiwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHVubG9ja0FwcGxpY2F0aW9uIChjbGllbnQsIGFwcGxpY2F0aW9uLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgdW5sb2NrQXBwbGljYXRpb24oYXBwbGljYXRpb24sIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyBnZXRBcHBsaWNhdGlvbiAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KCcvYXBwbGljYXRpb24nLCBnZXRBcHBsaWNhdGlvbihhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZ2V0QXBwbGljYXRpb25Tb3VyY2UgKGNsaWVudCwgc291cmNlSWQsIGZyYWdtZW50cywgbGltaXRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LmdldCgnL2FwcGxpY2F0aW9uJywgZ2V0QXBwbGljYXRpb25Tb3VyY2Uoc291cmNlSWQsIGZyYWdtZW50cywgbGltaXRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnMgKGNsaWVudCwgYXBwbGljYXRpb25JZCwgcGFyYW1zLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KCcvYXBwbGljYXRpb24nLCBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zKGFwcGxpY2F0aW9uSWQsIHBhcmFtcywgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNDb3VudCAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KCcvYXBwbGljYXRpb24nLCBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zQ291bnQoYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGNyZWF0ZVRlbXBsYXRlIChjbGllbnQsIHRlbXBsYXRlLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgY3JlYXRlVGVtcGxhdGUodGVtcGxhdGUsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyByZW1vdmVUZW1wbGF0ZSAoY2xpZW50LCBpZCkge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCByZW1vdmVUZW1wbGF0ZShpZCksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyBnZXRUZW1wbGF0ZXMgKGNsaWVudCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LmdldCgnL2FwcGxpY2F0aW9uJywgZ2V0VGVtcGxhdGVzKGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyBnZXRBcHBsaWNhdGlvbnMgKGNsaWVudCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LmdldCgnL2FwcGxpY2F0aW9uJywgZ2V0QXBwbGljYXRpb25zKGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyBhZGRBcHBsaWNhdGlvblNvdXJjZSAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBhcHBsaWNhdGlvblNvdXJjZSwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIGFkZEFwcGxpY2F0aW9uU291cmNlKGFwcGxpY2F0aW9uSWQsIGFwcGxpY2F0aW9uU291cmNlLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgYWRkQXBwbGljYXRpb25Tb3VyY2VGcm9tVVJMIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIHVybCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgcmV0dXJuIGdldEZpbGVGcm9tVXJsKGNsaWVudCwgdXJsKVxuICAgICAgLnRoZW4oZnVuY3Rpb24oZmlsZSkge1xuICAgICAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgYWRkQXBwbGljYXRpb25Tb3VyY2UoYXBwbGljYXRpb25JZCwgZmlsZSwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgfSk7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlIChjbGllbnQsIGFwcGxpY2F0aW9uU291cmNlLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgdXBkYXRlQXBwbGljYXRpb25Tb3VyY2UoYXBwbGljYXRpb25Tb3VyY2UsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyByZW1vdmVTb3VyY2VGcm9tQXBwbGljYXRpb24gKGNsaWVudCwgc291cmNlSWQsIGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCByZW1vdmVTb3VyY2VGcm9tQXBwbGljYXRpb24oc291cmNlSWQsIGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyBhcHBseVRlbXBsYXRlIChjbGllbnQsIHRlbXBsYXRlSWQsIGFwcElkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgYXBwbHlUZW1wbGF0ZSh0ZW1wbGF0ZUlkLCBhcHBJZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHVwZGF0ZVRlbXBsYXRlIChjbGllbnQsIHRlbXBsYXRlLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgdXBkYXRlVGVtcGxhdGUodGVtcGxhdGUsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyBjcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb24gKGNsaWVudCwgYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIGNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvbihhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIHByb3RlY3Rpb25JZCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LmdldCgnL2FwcGxpY2F0aW9uJywgZ2V0UHJvdGVjdGlvbihhcHBsaWNhdGlvbklkLCBwcm90ZWN0aW9uSWQsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyBkb3dubG9hZEFwcGxpY2F0aW9uUHJvdGVjdGlvbiAoY2xpZW50LCBwcm90ZWN0aW9uSWQpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KGAvYXBwbGljYXRpb24vZG93bmxvYWQvJHtwcm90ZWN0aW9uSWR9YCwgbnVsbCwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSwgZmFsc2UpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9XG59O1xuXG5mdW5jdGlvbiBnZXRGaWxlRnJvbVVybCAoY2xpZW50LCB1cmwpIHtcbiAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gIHZhciBmaWxlO1xuICByZXF1ZXN0LmdldCh1cmwpXG4gICAgLnRoZW4oKHJlcykgPT4ge1xuICAgICAgZmlsZSA9IHtcbiAgICAgICAgY29udGVudDogcmVzLmRhdGEsXG4gICAgICAgIGZpbGVuYW1lOiBwYXRoLmJhc2VuYW1lKHVybCksXG4gICAgICAgIGV4dGVuc2lvbjogcGF0aC5leHRuYW1lKHVybCkuc3Vic3RyKDEpXG4gICAgICB9O1xuICAgICAgZGVmZXJyZWQucmVzb2x2ZShmaWxlKTtcbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICB9KTtcbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cbmZ1bmN0aW9uIHJlc3BvbnNlSGFuZGxlciAoZGVmZXJyZWQpIHtcbiAgcmV0dXJuIChlcnIsIHJlcykgPT4ge1xuICAgIGlmIChlcnIpIHtcbiAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYm9keSA9IHJlcy5kYXRhO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHJlcy5zdGF0dXMgPj0gNDAwKSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGJvZHkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoYm9keSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGV4KSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChib2R5KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGVycm9ySGFuZGxlciAocmVzKSB7XG4gIGlmIChyZXMuZXJyb3JzICYmIHJlcy5lcnJvcnMubGVuZ3RoKSB7XG4gICAgcmVzLmVycm9ycy5mb3JFYWNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplUGFyYW1ldGVycyAocGFyYW1ldGVycykge1xuICB2YXIgcmVzdWx0O1xuXG4gIGlmICghQXJyYXkuaXNBcnJheShwYXJhbWV0ZXJzKSkge1xuICAgIHJlc3VsdCA9IFtdO1xuICAgIE9iamVjdC5rZXlzKHBhcmFtZXRlcnMpLmZvckVhY2goKG5hbWUpID0+IHtcbiAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgb3B0aW9uczogcGFyYW1ldGVyc1tuYW1lXVxuICAgICAgfSlcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSBwYXJhbWV0ZXJzO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdfQ==
