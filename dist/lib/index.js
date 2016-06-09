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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFnQkE7O0FBU0E7Ozs7OztrQkFLZTtBQUNiLDBCQURhO0FBRWIsMEJBRmE7QUFHYixzREFIYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQThDUCxvQkE5Q08sOEJBOENhLGtCQTlDYixFQThDaUMsWUE5Q2pDLEVBOEMrQztBQUFBOztBQUFBO0FBQUEsVUFDcEQsTUFEb0QsRUFLeEQsYUFMd0QsRUFNeEQsSUFOd0QsRUFPeEQsSUFQd0QsRUFReEQsSUFSd0QsRUFTeEQsU0FUd0QsRUFVeEQsUUFWd0QsRUFXeEQsR0FYd0QsRUFZeEQsTUFad0QsRUFheEQsZ0JBYndELEVBY3hELHNCQWR3RCxFQWtCeEQsU0FsQndELEVBbUJ4RCxTQW5Cd0QsRUFzQnBELE1BdEJvRCxFQXNDcEQsU0F0Q29ELEVBdUMvQyxDQXZDK0MsRUF1Q3hDLENBdkN3QyxFQWdEbEQsSUFoRGtELEVBa0RsRCxlQWxEa0QsRUFxRGxELFlBckRrRCxFQWdFbEQsdUJBaEVrRCxFQXdFcEQsSUF4RW9ELEVBK0ZsRCxvQkEvRmtELEVBbUdwRCw4QkFuR29ELEVBc0dwRCxZQXRHb0QsRUF5R3BELFFBekdvRDs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNwRCxvQkFEb0QsR0FDM0MsT0FBTyxrQkFBUCxLQUE4QixRQUE5QixHQUNiLFFBQVEsa0JBQVIsQ0FEYSxHQUNpQixrQkFGMEI7QUFLeEQsMkJBTHdELEdBZXRELE1BZnNELENBS3hELGFBTHdEO0FBTXhELGtCQU53RCxHQWV0RCxNQWZzRCxDQU14RCxJQU53RDtBQU94RCxrQkFQd0QsR0FldEQsTUFmc0QsQ0FPeEQsSUFQd0Q7QUFReEQsa0JBUndELEdBZXRELE1BZnNELENBUXhELElBUndE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QUVELFNBQVMsbUJBQVQsQ0FBOEIsVUFBOUIsRUFBMEM7QUFDeEMsTUFBSSxNQUFKOztBQUVBLE1BQUksQ0FBQyxNQUFNLE9BQU4sQ0FBYyxVQUFkLENBQUwsRUFBZ0M7QUFDOUIsYUFBUyxFQUFUO0FBQ0EsV0FBTyxJQUFQLENBQVksVUFBWixFQUF3QixPQUF4QixDQUFnQyxVQUFDLElBQUQsRUFBVTtBQUN4QyxhQUFPLElBQVAsQ0FBWTtBQUNWLGtCQURVO0FBRVYsaUJBQVMsV0FBVyxJQUFYO0FBRkMsT0FBWjtBQUlELEtBTEQ7QUFNRCxHQVJELE1BUU87QUFDTCxhQUFTLFVBQVQ7QUFDRDs7QUFFRCxTQUFPLE1BQVA7QUFDRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnYmFiZWwtcG9seWZpbGwnO1xuXG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHJlcXVlc3QgZnJvbSAnYXhpb3MnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5cbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IGdlbmVyYXRlU2lnbmVkUGFyYW1zIGZyb20gJy4vZ2VuZXJhdGUtc2lnbmVkLXBhcmFtcyc7XG5pbXBvcnQgSlNjcmFtYmxlckNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQge1xuICBhZGRBcHBsaWNhdGlvblNvdXJjZSxcbiAgY3JlYXRlQXBwbGljYXRpb24sXG4gIHJlbW92ZUFwcGxpY2F0aW9uLFxuICB1cGRhdGVBcHBsaWNhdGlvbixcbiAgdXBkYXRlQXBwbGljYXRpb25Tb3VyY2UsXG4gIHJlbW92ZVNvdXJjZUZyb21BcHBsaWNhdGlvbixcbiAgY3JlYXRlVGVtcGxhdGUsXG4gIHJlbW92ZVRlbXBsYXRlLFxuICB1cGRhdGVUZW1wbGF0ZSxcbiAgY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uLFxuICByZW1vdmVQcm90ZWN0aW9uLFxuICBkdXBsaWNhdGVBcHBsaWNhdGlvbixcbiAgdW5sb2NrQXBwbGljYXRpb24sXG4gIGFwcGx5VGVtcGxhdGVcbn0gZnJvbSAnLi9tdXRhdGlvbnMnO1xuaW1wb3J0IHtcbiAgZ2V0QXBwbGljYXRpb24sXG4gIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnMsXG4gIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNDb3VudCxcbiAgZ2V0QXBwbGljYXRpb25zLFxuICBnZXRBcHBsaWNhdGlvblNvdXJjZSxcbiAgZ2V0VGVtcGxhdGVzLFxuICBnZXRQcm90ZWN0aW9uXG59IGZyb20gJy4vcXVlcmllcyc7XG5pbXBvcnQge1xuICB6aXAsXG4gIHVuemlwXG59IGZyb20gJy4vemlwJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBDbGllbnQ6IEpTY3JhbWJsZXJDbGllbnQsXG4gIGNvbmZpZyxcbiAgZ2VuZXJhdGVTaWduZWRQYXJhbXMsXG4gIC8vIFRoaXMgbWV0aG9kIGlzIGEgc2hvcnRjdXQgbWV0aG9kIHRoYXQgYWNjZXB0cyBhbiBvYmplY3Qgd2l0aCBldmVyeXRoaW5nIG5lZWRlZFxuICAvLyBmb3IgdGhlIGVudGlyZSBwcm9jZXNzIG9mIHJlcXVlc3RpbmcgYW4gYXBwbGljYXRpb24gcHJvdGVjdGlvbiBhbmQgZG93bmxvYWRpbmdcbiAgLy8gdGhhdCBzYW1lIHByb3RlY3Rpb24gd2hlbiB0aGUgc2FtZSBlbmRzLlxuICAvL1xuICAvLyBgY29uZmlnUGF0aE9yT2JqZWN0YCBjYW4gYmUgYSBwYXRoIHRvIGEgSlNPTiBvciBkaXJlY3RseSBhbiBvYmplY3QgY29udGFpbmluZ1xuICAvLyB0aGUgZm9sbG93aW5nIHN0cnVjdHVyZTpcbiAgLy9cbiAgLy8gYGBganNvblxuICAvLyB7XG4gIC8vICAgXCJrZXlzXCI6IHtcbiAgLy8gICAgIFwiYWNjZXNzS2V5XCI6IFwiXCIsXG4gIC8vICAgICBcInNlY3JldEtleVwiOiBcIlwiXG4gIC8vICAgfSxcbiAgLy8gICBcImFwcGxpY2F0aW9uSWRcIjogXCJcIixcbiAgLy8gICBcImZpbGVzRGVzdFwiOiBcIlwiXG4gIC8vIH1cbiAgLy8gYGBgXG4gIC8vXG4gIC8vIEFsc28gdGhlIGZvbGxvd2luZyBvcHRpb25hbCBwYXJhbWV0ZXJzIGFyZSBhY2NlcHRlZDpcbiAgLy9cbiAgLy8gYGBganNvblxuICAvLyB7XG4gIC8vICAgXCJmaWxlc1NyY1wiOiBbXCJcIl0sXG4gIC8vICAgXCJwYXJhbXNcIjoge30sXG4gIC8vICAgXCJjd2RcIjogXCJcIixcbiAgLy8gICBcImhvc3RcIjogXCJhcGkuanNjcmFtYmxlci5jb21cIixcbiAgLy8gICBcInBvcnRcIjogXCI0NDNcIlxuICAvLyB9XG4gIC8vIGBgYFxuICAvL1xuICAvLyBgZmlsZXNTcmNgIHN1cHBvcnRzIGdsb2IgcGF0dGVybnMsIGFuZCBpZiBpdCdzIHByb3ZpZGVkIGl0IHdpbGwgcmVwbGFjZSB0aGVcbiAgLy8gZW50aXJlIGFwcGxpY2F0aW9uIHNvdXJjZXMuXG4gIC8vXG4gIC8vIGBwYXJhbXNgIGlmIHByb3ZpZGVkIHdpbGwgcmVwbGFjZSBhbGwgdGhlIGFwcGxpY2F0aW9uIHRyYW5zZm9ybWF0aW9uIHBhcmFtZXRlcnMuXG4gIC8vXG4gIC8vIGBjd2RgIGFsbG93cyB5b3UgdG8gc2V0IHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5IHRvIHJlc29sdmUgcHJvYmxlbXMgd2l0aFxuICAvLyByZWxhdGl2ZSBwYXRocyB3aXRoIHlvdXIgYGZpbGVzU3JjYCBpcyBvdXRzaWRlIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LlxuICAvL1xuICAvLyBGaW5hbGx5LCBgaG9zdGAgYW5kIGBwb3J0YCBjYW4gYmUgb3ZlcnJpZGRlbiBpZiB5b3UgdG8gZW5nYWdlIHdpdGggYSBkaWZmZXJlbnRcbiAgLy8gZW5kcG9pbnQgdGhhbiB0aGUgZGVmYXVsdCBvbmUsIHVzZWZ1bCBpZiB5b3UncmUgcnVubmluZyBhbiBlbnRlcnByaXNlIHZlcnNpb24gb2ZcbiAgLy8gSnNjcmFtYmxlciBvciBpZiB5b3UncmUgcHJvdmlkZWQgYWNjZXNzIHRvIGJldGEgZmVhdHVyZXMgb2Ygb3VyIHByb2R1Y3QuXG4gIC8vXG4gIGFzeW5jIHByb3RlY3RBbmREb3dubG9hZCAoY29uZmlnUGF0aE9yT2JqZWN0LCBkZXN0Q2FsbGJhY2spIHtcbiAgICBjb25zdCBjb25maWcgPSB0eXBlb2YgY29uZmlnUGF0aE9yT2JqZWN0ID09PSAnc3RyaW5nJyA/XG4gICAgICByZXF1aXJlKGNvbmZpZ1BhdGhPck9iamVjdCkgOiBjb25maWdQYXRoT3JPYmplY3Q7XG5cbiAgICBjb25zdCB7XG4gICAgICBhcHBsaWNhdGlvbklkLFxuICAgICAgaG9zdCxcbiAgICAgIHBvcnQsXG4gICAgICBrZXlzLFxuICAgICAgZmlsZXNEZXN0LFxuICAgICAgZmlsZXNTcmMsXG4gICAgICBjd2QsXG4gICAgICBwYXJhbXMsXG4gICAgICBhcHBsaWNhdGlvblR5cGVzLFxuICAgICAgbGFuZ3VhZ2VTcGVjaWZpY2F0aW9uc1xuICAgIH0gPSBjb25maWc7XG5cbiAgICBjb25zdCB7XG4gICAgICBhY2Nlc3NLZXksXG4gICAgICBzZWNyZXRLZXlcbiAgICB9ID0ga2V5cztcblxuICAgIGNvbnN0IGNsaWVudCA9IG5ldyB0aGlzLkNsaWVudCh7XG4gICAgICBhY2Nlc3NLZXksXG4gICAgICBzZWNyZXRLZXksXG4gICAgICBob3N0LFxuICAgICAgcG9ydFxuICAgIH0pO1xuXG4gICAgaWYgKCFhcHBsaWNhdGlvbklkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkICphcHBsaWNhdGlvbklkKiBub3QgcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoIWZpbGVzRGVzdCAmJiAhZGVzdENhbGxiYWNrKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcXVpcmVkICpmaWxlc0Rlc3QqIG5vdCBwcm92aWRlZCcpO1xuICAgIH1cblxuICAgIGlmIChmaWxlc1NyYyAmJiBmaWxlc1NyYy5sZW5ndGgpIHtcbiAgICAgIGxldCBfZmlsZXNTcmMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gZmlsZXNTcmMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZmlsZXNTcmNbaV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgLy8gVE9ETyBSZXBsYWNlIGBnbG9iLnN5bmNgIHdpdGggYXN5bmMgdmVyc2lvblxuICAgICAgICAgIF9maWxlc1NyYyA9IF9maWxlc1NyYy5jb25jYXQoZ2xvYi5zeW5jKGZpbGVzU3JjW2ldLCB7ZG90OiB0cnVlfSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIF9maWxlc1NyYy5wdXNoKGZpbGVzU3JjW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBfemlwID0gYXdhaXQgemlwKGZpbGVzU3JjLCBjd2QpO1xuXG4gICAgICBjb25zdCByZW1vdmVTb3VyY2VSZXMgPSBhd2FpdCB0aGlzLnJlbW92ZVNvdXJjZUZyb21BcHBsaWNhdGlvbihjbGllbnQsICcnLCBhcHBsaWNhdGlvbklkKTtcbiAgICAgIGlmIChyZW1vdmVTb3VyY2VSZXMuZXJyb3JzKSB7XG4gICAgICAgIC8vIFRPRE8gSW1wbGVtZW50IGVycm9yIGNvZGVzIG9yIGZpeCB0aGlzIGlzIG9uIHRoZSBzZXJ2aWNlc1xuICAgICAgICB2YXIgaGFkTm9Tb3VyY2VzID0gZmFsc2U7XG4gICAgICAgIHJlbW92ZVNvdXJjZVJlcy5lcnJvcnMuZm9yRWFjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICBpZiAoZXJyb3IubWVzc2FnZSA9PT0gJ0FwcGxpY2F0aW9uIFNvdXJjZSB3aXRoIHRoZSBnaXZlbiBJRCBkb2VzIG5vdCBleGlzdCcpIHtcbiAgICAgICAgICAgIGhhZE5vU291cmNlcyA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCFoYWROb1NvdXJjZXMpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IocmVtb3ZlU291cmNlUmVzLmVycm9yc1swXS5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCBhZGRBcHBsaWNhdGlvblNvdXJjZVJlcyA9IGF3YWl0IHRoaXMuYWRkQXBwbGljYXRpb25Tb3VyY2UoY2xpZW50LCBhcHBsaWNhdGlvbklkLCB7XG4gICAgICAgIGNvbnRlbnQ6IF96aXAuZ2VuZXJhdGUoe3R5cGU6ICdiYXNlNjQnfSksXG4gICAgICAgIGZpbGVuYW1lOiAnYXBwbGljYXRpb24uemlwJyxcbiAgICAgICAgZXh0ZW5zaW9uOiAnemlwJ1xuICAgICAgfSk7XG4gICAgICBlcnJvckhhbmRsZXIoYWRkQXBwbGljYXRpb25Tb3VyY2VSZXMpO1xuICAgIH1cblxuICAgIGNvbnN0ICRzZXQgPSB7XG4gICAgICBfaWQ6IGFwcGxpY2F0aW9uSWRcbiAgICB9O1xuXG4gICAgaWYgKHBhcmFtcyAmJiBPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCkge1xuICAgICAgJHNldC5wYXJhbWV0ZXJzID0gSlNPTi5zdHJpbmdpZnkobm9ybWFsaXplUGFyYW1ldGVycyhwYXJhbXMpKTtcbiAgICAgICRzZXQuYXJlU3Vic2NyaWJlcnNPcmRlcmVkID0gQXJyYXkuaXNBcnJheShwYXJhbXMpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgYXJlU3Vic2NyaWJlcnNPcmRlcmVkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgJHNldC5hcmVTdWJzY3JpYmVyc09yZGVyZWQgPSBhcmVTdWJzY3JpYmVyc09yZGVyZWQ7XG4gICAgfVxuXG4gICAgaWYgKGFwcGxpY2F0aW9uVHlwZXMpIHtcbiAgICAgICRzZXQuYXBwbGljYXRpb25UeXBlcyA9IGFwcGxpY2F0aW9uVHlwZXM7XG4gICAgfVxuXG4gICAgaWYgKGxhbmd1YWdlU3BlY2lmaWNhdGlvbnMpIHtcbiAgICAgICRzZXQubGFuZ3VhZ2VTcGVjaWZpY2F0aW9ucyA9IGxhbmd1YWdlU3BlY2lmaWNhdGlvbnM7XG4gICAgfVxuXG4gICAgaWYgKCRzZXQucGFyYW1ldGVycyB8fCAkc2V0LmFwcGxpY2F0aW9uVHlwZXMgfHwgJHNldC5sYW5ndWFnZVNwZWNpZmljYXRpb25zIHx8XG4gICAgICAgIHR5cGVvZiAkc2V0LmFyZVN1YnNjcmliZXJzT3JkZXJlZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNvbnN0IHVwZGF0ZUFwcGxpY2F0aW9uUmVzID0gYXdhaXQgdGhpcy51cGRhdGVBcHBsaWNhdGlvbihjbGllbnQsICRzZXQpO1xuICAgICAgZXJyb3JIYW5kbGVyKHVwZGF0ZUFwcGxpY2F0aW9uUmVzKTtcbiAgICB9XG5cbiAgICBjb25zdCBjcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb25SZXMgPSBhd2FpdCB0aGlzLmNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvbihjbGllbnQsIGFwcGxpY2F0aW9uSWQpO1xuICAgIGVycm9ySGFuZGxlcihjcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb25SZXMpO1xuXG4gICAgY29uc3QgcHJvdGVjdGlvbklkID0gY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uUmVzLmRhdGEuY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uLl9pZDtcbiAgICBhd2FpdCB0aGlzLnBvbGxQcm90ZWN0aW9uKGNsaWVudCwgYXBwbGljYXRpb25JZCwgcHJvdGVjdGlvbklkKTtcblxuICAgIGNvbnN0IGRvd25sb2FkID0gYXdhaXQgdGhpcy5kb3dubG9hZEFwcGxpY2F0aW9uUHJvdGVjdGlvbihjbGllbnQsIHByb3RlY3Rpb25JZCk7XG4gICAgZXJyb3JIYW5kbGVyKGRvd25sb2FkKTtcbiAgICB1bnppcChkb3dubG9hZCwgZmlsZXNEZXN0IHx8IGRlc3RDYWxsYmFjayk7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHBvbGxQcm90ZWN0aW9uIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIHByb3RlY3Rpb25JZCkge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuXG4gICAgY29uc3QgcG9sbCA9IGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcGxpY2F0aW9uUHJvdGVjdGlvbiA9IGF3YWl0IHRoaXMuZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uKGNsaWVudCwgYXBwbGljYXRpb25JZCwgcHJvdGVjdGlvbklkKTtcbiAgICAgIGlmIChhcHBsaWNhdGlvblByb3RlY3Rpb24uZXJyb3JzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRXJyb3IgcG9sbGluZyBwcm90ZWN0aW9uJyk7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdCgnRXJyb3IgcG9sbGluZyBwcm90ZWN0aW9uJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IGFwcGxpY2F0aW9uUHJvdGVjdGlvbi5kYXRhLmFwcGxpY2F0aW9uUHJvdGVjdGlvbi5zdGF0ZTtcbiAgICAgICAgaWYgKHN0YXRlICE9PSAnZmluaXNoZWQnICYmIHN0YXRlICE9PSAnZXJyb3JlZCcpIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KHBvbGwsIDUwMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHBvbGwoKTtcblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyBjcmVhdGVBcHBsaWNhdGlvbiAoY2xpZW50LCBkYXRhLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgY3JlYXRlQXBwbGljYXRpb24oZGF0YSwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGR1cGxpY2F0ZUFwcGxpY2F0aW9uIChjbGllbnQsIGRhdGEsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCBkdXBsaWNhdGVBcHBsaWNhdGlvbihkYXRhLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgcmVtb3ZlQXBwbGljYXRpb24gKGNsaWVudCwgaWQpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgcmVtb3ZlQXBwbGljYXRpb24oaWQpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgcmVtb3ZlUHJvdGVjdGlvbiAoY2xpZW50LCBpZCwgYXBwSWQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCByZW1vdmVQcm90ZWN0aW9uKGlkLCBhcHBJZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHVwZGF0ZUFwcGxpY2F0aW9uIChjbGllbnQsIGFwcGxpY2F0aW9uLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgdXBkYXRlQXBwbGljYXRpb24oYXBwbGljYXRpb24sIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyB1bmxvY2tBcHBsaWNhdGlvbiAoY2xpZW50LCBhcHBsaWNhdGlvbiwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHVubG9ja0FwcGxpY2F0aW9uKGFwcGxpY2F0aW9uLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZ2V0QXBwbGljYXRpb24gKGNsaWVudCwgYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LmdldCgnL2FwcGxpY2F0aW9uJywgZ2V0QXBwbGljYXRpb24oYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGdldEFwcGxpY2F0aW9uU291cmNlIChjbGllbnQsIHNvdXJjZUlkLCBmcmFnbWVudHMsIGxpbWl0cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldEFwcGxpY2F0aW9uU291cmNlKHNvdXJjZUlkLCBmcmFnbWVudHMsIGxpbWl0cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIHBhcmFtcywgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LmdldCgnL2FwcGxpY2F0aW9uJywgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9ucyhhcHBsaWNhdGlvbklkLCBwYXJhbXMsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zQ291bnQgKGNsaWVudCwgYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LmdldCgnL2FwcGxpY2F0aW9uJywgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uc0NvdW50KGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyBjcmVhdGVUZW1wbGF0ZSAoY2xpZW50LCB0ZW1wbGF0ZSwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIGNyZWF0ZVRlbXBsYXRlKHRlbXBsYXRlLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgcmVtb3ZlVGVtcGxhdGUgKGNsaWVudCwgaWQpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgcmVtb3ZlVGVtcGxhdGUoaWQpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZ2V0VGVtcGxhdGVzIChjbGllbnQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldFRlbXBsYXRlcyhmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZ2V0QXBwbGljYXRpb25zIChjbGllbnQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldEFwcGxpY2F0aW9ucyhmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgYWRkQXBwbGljYXRpb25Tb3VyY2UgKGNsaWVudCwgYXBwbGljYXRpb25JZCwgYXBwbGljYXRpb25Tb3VyY2UsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCBhZGRBcHBsaWNhdGlvblNvdXJjZShhcHBsaWNhdGlvbklkLCBhcHBsaWNhdGlvblNvdXJjZSwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGFkZEFwcGxpY2F0aW9uU291cmNlRnJvbVVSTCAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCB1cmwsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIHJldHVybiBnZXRGaWxlRnJvbVVybChjbGllbnQsIHVybClcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGZpbGUpIHtcbiAgICAgICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIGFkZEFwcGxpY2F0aW9uU291cmNlKGFwcGxpY2F0aW9uSWQsIGZpbGUsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICAgIH0pO1xuICB9LFxuICAvL1xuICBhc3luYyB1cGRhdGVBcHBsaWNhdGlvblNvdXJjZSAoY2xpZW50LCBhcHBsaWNhdGlvblNvdXJjZSwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlKGFwcGxpY2F0aW9uU291cmNlLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgcmVtb3ZlU291cmNlRnJvbUFwcGxpY2F0aW9uIChjbGllbnQsIHNvdXJjZUlkLCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgcmVtb3ZlU291cmNlRnJvbUFwcGxpY2F0aW9uKHNvdXJjZUlkLCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgYXBwbHlUZW1wbGF0ZSAoY2xpZW50LCB0ZW1wbGF0ZUlkLCBhcHBJZCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIGFwcGx5VGVtcGxhdGUodGVtcGxhdGVJZCwgYXBwSWQsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyB1cGRhdGVUZW1wbGF0ZSAoY2xpZW50LCB0ZW1wbGF0ZSwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHVwZGF0ZVRlbXBsYXRlKHRlbXBsYXRlLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCBjcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb24oYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbiAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBwcm90ZWN0aW9uSWQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldFByb3RlY3Rpb24oYXBwbGljYXRpb25JZCwgcHJvdGVjdGlvbklkLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZG93bmxvYWRBcHBsaWNhdGlvblByb3RlY3Rpb24gKGNsaWVudCwgcHJvdGVjdGlvbklkKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LmdldChgL2FwcGxpY2F0aW9uL2Rvd25sb2FkLyR7cHJvdGVjdGlvbklkfWAsIG51bGwsIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCksIGZhbHNlKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZ2V0RmlsZUZyb21VcmwgKGNsaWVudCwgdXJsKSB7XG4gIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICB2YXIgZmlsZTtcbiAgcmVxdWVzdC5nZXQodXJsKVxuICAgIC50aGVuKChyZXMpID0+IHtcbiAgICAgIGZpbGUgPSB7XG4gICAgICAgIGNvbnRlbnQ6IHJlcy5kYXRhLFxuICAgICAgICBmaWxlbmFtZTogcGF0aC5iYXNlbmFtZSh1cmwpLFxuICAgICAgICBleHRlbnNpb246IHBhdGguZXh0bmFtZSh1cmwpLnN1YnN0cigxKVxuICAgICAgfTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoZmlsZSk7XG4gICAgfSlcbiAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgfSk7XG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5mdW5jdGlvbiByZXNwb25zZUhhbmRsZXIgKGRlZmVycmVkKSB7XG4gIHJldHVybiAoZXJyLCByZXMpID0+IHtcbiAgICBpZiAoZXJyKSB7XG4gICAgICBkZWZlcnJlZC5yZWplY3QoZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJvZHkgPSByZXMuZGF0YTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChyZXMuc3RhdHVzID49IDQwMCkge1xuICAgICAgICAgIGRlZmVycmVkLnJlamVjdChib2R5KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKGJvZHkpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoYm9keSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBlcnJvckhhbmRsZXIgKHJlcykge1xuICBpZiAocmVzLmVycm9ycyAmJiByZXMuZXJyb3JzLmxlbmd0aCkge1xuICAgIHJlcy5lcnJvcnMuZm9yRWFjaChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiByZXM7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZVBhcmFtZXRlcnMgKHBhcmFtZXRlcnMpIHtcbiAgdmFyIHJlc3VsdDtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkocGFyYW1ldGVycykpIHtcbiAgICByZXN1bHQgPSBbXTtcbiAgICBPYmplY3Qua2V5cyhwYXJhbWV0ZXJzKS5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgIG5hbWUsXG4gICAgICAgIG9wdGlvbnM6IHBhcmFtZXRlcnNbbmFtZV1cbiAgICAgIH0pXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmVzdWx0ID0gcGFyYW1ldGVycztcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iXX0=
