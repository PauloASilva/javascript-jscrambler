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
      var config, applicationId, host, port, keys, filesDest, filesSrc, cwd, params, accessKey, secretKey, client, _filesSrc, i, l, _zip, removeSourceRes, hadNoSources, addApplicationSourceRes, areSubscribersOrdered, updateApplicationRes, createApplicationProtectionRes, protectionId, download;

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
                _context.next = 34;
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

              throw new Error(removeSourceRes.errors[0].message);

            case 30:
              _context.next = 32;
              return _this.addApplicationSource(client, applicationId, {
                content: _zip.generate({ type: 'base64' }),
                filename: 'application.zip',
                extension: 'zip'
              });

            case 32:
              addApplicationSourceRes = _context.sent;

              errorHandler(addApplicationSourceRes);

            case 34:
              if (!(params && Object.keys(params).length)) {
                _context.next = 40;
                break;
              }

              areSubscribersOrdered = Array.isArray(params);
              _context.next = 38;
              return _this.updateApplication(client, {
                _id: applicationId,
                parameters: JSON.stringify(normalizeParameters(params)),
                areSubscribersOrdered: areSubscribersOrdered
              });

            case 38:
              updateApplicationRes = _context.sent;

              errorHandler(updateApplicationRes);

            case 40:
              _context.next = 42;
              return _this.createApplicationProtection(client, applicationId);

            case 42:
              createApplicationProtectionRes = _context.sent;

              errorHandler(createApplicationProtectionRes);

              protectionId = createApplicationProtectionRes.data.createApplicationProtection._id;
              _context.next = 47;
              return _this.pollProtection(client, applicationId, protectionId);

            case 47:
              _context.next = 49;
              return _this.downloadApplicationProtection(client, protectionId);

            case 49:
              download = _context.sent;

              errorHandler(download);
              (0, _zip2.unzip)(download, filesDest || destCallback);

            case 52:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBRUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFnQkE7O0FBU0E7Ozs7OztrQkFLZTtBQUNiLDBCQURhO0FBRWIsMEJBRmE7QUFHYixzREFIYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQThDUCxvQkE5Q08sOEJBOENhLGtCQTlDYixFQThDaUMsWUE5Q2pDLEVBOEMrQztBQUFBOztBQUFBO0FBQUEsVUFDcEQsTUFEb0QsRUFLeEQsYUFMd0QsRUFNeEQsSUFOd0QsRUFPeEQsSUFQd0QsRUFReEQsSUFSd0QsRUFTeEQsU0FUd0QsRUFVeEQsUUFWd0QsRUFXeEQsR0FYd0QsRUFZeEQsTUFad0QsRUFnQnhELFNBaEJ3RCxFQWlCeEQsU0FqQndELEVBb0JwRCxNQXBCb0QsRUFvQ3BELFNBcENvRCxFQXFDL0MsQ0FyQytDLEVBcUN4QyxDQXJDd0MsRUE4Q2xELElBOUNrRCxFQWdEbEQsZUFoRGtELEVBbURsRCxZQW5Ea0QsRUE4RGxELHVCQTlEa0QsRUF1RWxELHFCQXZFa0QsRUF3RWxELG9CQXhFa0QsRUFnRnBELDhCQWhGb0QsRUFtRnBELFlBbkZvRCxFQXNGcEQsUUF0Rm9EOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ3BELG9CQURvRCxHQUMzQyxPQUFPLGtCQUFQLEtBQThCLFFBQTlCLEdBQ2IsUUFBUSxrQkFBUixDQURhLEdBQ2lCLGtCQUYwQjtBQUt4RCwyQkFMd0QsR0FhdEQsTUFic0QsQ0FLeEQsYUFMd0Q7QUFNeEQsa0JBTndELEdBYXRELE1BYnNELENBTXhELElBTndEO0FBT3hELGtCQVB3RCxHQWF0RCxNQWJzRCxDQU94RCxJQVB3RDtBQVF4RCxrQkFSd0QsR0FhdEQsTUFic0QsQ0FReEQsSUFSd0Q7QUFTeEQsdUJBVHdELEdBYXRELE1BYnNE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QUFoQjtBQUNELEtBRkQsTUFFTztBQUNMLFVBQUksT0FBTyxJQUFJLElBQWY7QUFDQSxVQUFJO0FBQ0YsWUFBSSxJQUFJLE1BQUosSUFBYyxHQUFsQixFQUF1QjtBQUNyQixtQkFBUyxNQUFULENBQWdCLElBQWhCO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsbUJBQVMsT0FBVCxDQUFpQixJQUFqQjtBQUNEO0FBQ0YsT0FORCxDQU1FLE9BQU8sRUFBUCxFQUFXO0FBQ1gsaUJBQVMsTUFBVCxDQUFnQixJQUFoQjtBQUNEO0FBQ0Y7QUFDRixHQWZEO0FBZ0JEOztBQUVELFNBQVMsWUFBVCxDQUF1QixHQUF2QixFQUE0QjtBQUMxQixNQUFJLElBQUksTUFBSixJQUFjLElBQUksTUFBSixDQUFXLE1BQTdCLEVBQXFDO0FBQ25DLFFBQUksTUFBSixDQUFXLE9BQVgsQ0FBbUIsVUFBVSxLQUFWLEVBQWlCO0FBQ2xDLFlBQU0sSUFBSSxLQUFKLENBQVUsTUFBTSxPQUFoQixDQUFOO0FBQ0QsS0FGRDtBQUdEOztBQUVELFNBQU8sR0FBUDtBQUNEOztBQUVELFNBQVMsbUJBQVQsQ0FBOEIsVUFBOUIsRUFBMEM7QUFDeEMsTUFBSSxNQUFKOztBQUVBLE1BQUksQ0FBQyxNQUFNLE9BQU4sQ0FBYyxVQUFkLENBQUwsRUFBZ0M7QUFDOUIsYUFBUyxFQUFUO0FBQ0EsV0FBTyxJQUFQLENBQVksVUFBWixFQUF3QixPQUF4QixDQUFnQyxVQUFDLElBQUQsRUFBVTtBQUN4QyxhQUFPLElBQVAsQ0FBWTtBQUNWLGtCQURVO0FBRVYsaUJBQVMsV0FBVyxJQUFYO0FBRkMsT0FBWjtBQUlELEtBTEQ7QUFNRCxHQVJELE1BUU87QUFDTCxhQUFTLFVBQVQ7QUFDRDs7QUFFRCxTQUFPLE1BQVA7QUFDRCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnYmFiZWwtcG9seWZpbGwnO1xuXG5pbXBvcnQgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHJlcXVlc3QgZnJvbSAnYXhpb3MnO1xuaW1wb3J0IFEgZnJvbSAncSc7XG5cbmltcG9ydCBjb25maWcgZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IGdlbmVyYXRlU2lnbmVkUGFyYW1zIGZyb20gJy4vZ2VuZXJhdGUtc2lnbmVkLXBhcmFtcyc7XG5pbXBvcnQgSlNjcmFtYmxlckNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQge1xuICBhZGRBcHBsaWNhdGlvblNvdXJjZSxcbiAgY3JlYXRlQXBwbGljYXRpb24sXG4gIHJlbW92ZUFwcGxpY2F0aW9uLFxuICB1cGRhdGVBcHBsaWNhdGlvbixcbiAgdXBkYXRlQXBwbGljYXRpb25Tb3VyY2UsXG4gIHJlbW92ZVNvdXJjZUZyb21BcHBsaWNhdGlvbixcbiAgY3JlYXRlVGVtcGxhdGUsXG4gIHJlbW92ZVRlbXBsYXRlLFxuICB1cGRhdGVUZW1wbGF0ZSxcbiAgY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uLFxuICByZW1vdmVQcm90ZWN0aW9uLFxuICBkdXBsaWNhdGVBcHBsaWNhdGlvbixcbiAgdW5sb2NrQXBwbGljYXRpb24sXG4gIGFwcGx5VGVtcGxhdGVcbn0gZnJvbSAnLi9tdXRhdGlvbnMnO1xuaW1wb3J0IHtcbiAgZ2V0QXBwbGljYXRpb24sXG4gIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnMsXG4gIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNDb3VudCxcbiAgZ2V0QXBwbGljYXRpb25zLFxuICBnZXRBcHBsaWNhdGlvblNvdXJjZSxcbiAgZ2V0VGVtcGxhdGVzLFxuICBnZXRQcm90ZWN0aW9uXG59IGZyb20gJy4vcXVlcmllcyc7XG5pbXBvcnQge1xuICB6aXAsXG4gIHVuemlwXG59IGZyb20gJy4vemlwJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBDbGllbnQ6IEpTY3JhbWJsZXJDbGllbnQsXG4gIGNvbmZpZyxcbiAgZ2VuZXJhdGVTaWduZWRQYXJhbXMsXG4gIC8vIFRoaXMgbWV0aG9kIGlzIGEgc2hvcnRjdXQgbWV0aG9kIHRoYXQgYWNjZXB0cyBhbiBvYmplY3Qgd2l0aCBldmVyeXRoaW5nIG5lZWRlZFxuICAvLyBmb3IgdGhlIGVudGlyZSBwcm9jZXNzIG9mIHJlcXVlc3RpbmcgYW4gYXBwbGljYXRpb24gcHJvdGVjdGlvbiBhbmQgZG93bmxvYWRpbmdcbiAgLy8gdGhhdCBzYW1lIHByb3RlY3Rpb24gd2hlbiB0aGUgc2FtZSBlbmRzLlxuICAvL1xuICAvLyBgY29uZmlnUGF0aE9yT2JqZWN0YCBjYW4gYmUgYSBwYXRoIHRvIGEgSlNPTiBvciBkaXJlY3RseSBhbiBvYmplY3QgY29udGFpbmluZ1xuICAvLyB0aGUgZm9sbG93aW5nIHN0cnVjdHVyZTpcbiAgLy9cbiAgLy8gYGBganNvblxuICAvLyB7XG4gIC8vICAgXCJrZXlzXCI6IHtcbiAgLy8gICAgIFwiYWNjZXNzS2V5XCI6IFwiXCIsXG4gIC8vICAgICBcInNlY3JldEtleVwiOiBcIlwiXG4gIC8vICAgfSxcbiAgLy8gICBcImFwcGxpY2F0aW9uSWRcIjogXCJcIixcbiAgLy8gICBcImZpbGVzRGVzdFwiOiBcIlwiXG4gIC8vIH1cbiAgLy8gYGBgXG4gIC8vXG4gIC8vIEFsc28gdGhlIGZvbGxvd2luZyBvcHRpb25hbCBwYXJhbWV0ZXJzIGFyZSBhY2NlcHRlZDpcbiAgLy9cbiAgLy8gYGBganNvblxuICAvLyB7XG4gIC8vICAgXCJmaWxlc1NyY1wiOiBbXCJcIl0sXG4gIC8vICAgXCJwYXJhbXNcIjoge30sXG4gIC8vICAgXCJjd2RcIjogXCJcIixcbiAgLy8gICBcImhvc3RcIjogXCJhcGkuanNjcmFtYmxlci5jb21cIixcbiAgLy8gICBcInBvcnRcIjogXCI0NDNcIlxuICAvLyB9XG4gIC8vIGBgYFxuICAvL1xuICAvLyBgZmlsZXNTcmNgIHN1cHBvcnRzIGdsb2IgcGF0dGVybnMsIGFuZCBpZiBpdCdzIHByb3ZpZGVkIGl0IHdpbGwgcmVwbGFjZSB0aGVcbiAgLy8gZW50aXJlIGFwcGxpY2F0aW9uIHNvdXJjZXMuXG4gIC8vXG4gIC8vIGBwYXJhbXNgIGlmIHByb3ZpZGVkIHdpbGwgcmVwbGFjZSBhbGwgdGhlIGFwcGxpY2F0aW9uIHRyYW5zZm9ybWF0aW9uIHBhcmFtZXRlcnMuXG4gIC8vXG4gIC8vIGBjd2RgIGFsbG93cyB5b3UgdG8gc2V0IHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5IHRvIHJlc29sdmUgcHJvYmxlbXMgd2l0aFxuICAvLyByZWxhdGl2ZSBwYXRocyB3aXRoIHlvdXIgYGZpbGVzU3JjYCBpcyBvdXRzaWRlIHRoZSBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LlxuICAvL1xuICAvLyBGaW5hbGx5LCBgaG9zdGAgYW5kIGBwb3J0YCBjYW4gYmUgb3ZlcnJpZGRlbiBpZiB5b3UgdG8gZW5nYWdlIHdpdGggYSBkaWZmZXJlbnRcbiAgLy8gZW5kcG9pbnQgdGhhbiB0aGUgZGVmYXVsdCBvbmUsIHVzZWZ1bCBpZiB5b3UncmUgcnVubmluZyBhbiBlbnRlcnByaXNlIHZlcnNpb24gb2ZcbiAgLy8gSnNjcmFtYmxlciBvciBpZiB5b3UncmUgcHJvdmlkZWQgYWNjZXNzIHRvIGJldGEgZmVhdHVyZXMgb2Ygb3VyIHByb2R1Y3QuXG4gIC8vXG4gIGFzeW5jIHByb3RlY3RBbmREb3dubG9hZCAoY29uZmlnUGF0aE9yT2JqZWN0LCBkZXN0Q2FsbGJhY2spIHtcbiAgICBjb25zdCBjb25maWcgPSB0eXBlb2YgY29uZmlnUGF0aE9yT2JqZWN0ID09PSAnc3RyaW5nJyA/XG4gICAgICByZXF1aXJlKGNvbmZpZ1BhdGhPck9iamVjdCkgOiBjb25maWdQYXRoT3JPYmplY3Q7XG5cbiAgICBjb25zdCB7XG4gICAgICBhcHBsaWNhdGlvbklkLFxuICAgICAgaG9zdCxcbiAgICAgIHBvcnQsXG4gICAgICBrZXlzLFxuICAgICAgZmlsZXNEZXN0LFxuICAgICAgZmlsZXNTcmMsXG4gICAgICBjd2QsXG4gICAgICBwYXJhbXNcbiAgICB9ID0gY29uZmlnO1xuXG4gICAgY29uc3Qge1xuICAgICAgYWNjZXNzS2V5LFxuICAgICAgc2VjcmV0S2V5XG4gICAgfSA9IGtleXM7XG5cbiAgICBjb25zdCBjbGllbnQgPSBuZXcgdGhpcy5DbGllbnQoe1xuICAgICAgYWNjZXNzS2V5LFxuICAgICAgc2VjcmV0S2V5LFxuICAgICAgaG9zdCxcbiAgICAgIHBvcnRcbiAgICB9KTtcblxuICAgIGlmICghYXBwbGljYXRpb25JZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXF1aXJlZCAqYXBwbGljYXRpb25JZCogbm90IHByb3ZpZGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKCFmaWxlc0Rlc3QgJiYgIWRlc3RDYWxsYmFjaykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXF1aXJlZCAqZmlsZXNEZXN0KiBub3QgcHJvdmlkZWQnKTtcbiAgICB9XG5cbiAgICBpZiAoZmlsZXNTcmMgJiYgZmlsZXNTcmMubGVuZ3RoKSB7XG4gICAgICBsZXQgX2ZpbGVzU3JjID0gW107XG4gICAgICBmb3IgKGxldCBpID0gMCwgbCA9IGZpbGVzU3JjLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgICAgICBpZiAodHlwZW9mIGZpbGVzU3JjW2ldID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIC8vIFRPRE8gUmVwbGFjZSBgZ2xvYi5zeW5jYCB3aXRoIGFzeW5jIHZlcnNpb25cbiAgICAgICAgICBfZmlsZXNTcmMgPSBfZmlsZXNTcmMuY29uY2F0KGdsb2Iuc3luYyhmaWxlc1NyY1tpXSwge2RvdDogdHJ1ZX0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfZmlsZXNTcmMucHVzaChmaWxlc1NyY1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgX3ppcCA9IGF3YWl0IHppcChmaWxlc1NyYywgY3dkKTtcblxuICAgICAgY29uc3QgcmVtb3ZlU291cmNlUmVzID0gYXdhaXQgdGhpcy5yZW1vdmVTb3VyY2VGcm9tQXBwbGljYXRpb24oY2xpZW50LCAnJywgYXBwbGljYXRpb25JZCk7XG4gICAgICBpZiAocmVtb3ZlU291cmNlUmVzLmVycm9ycykge1xuICAgICAgICAvLyBUT0RPIEltcGxlbWVudCBlcnJvciBjb2RlcyBvciBmaXggdGhpcyBpcyBvbiB0aGUgc2VydmljZXNcbiAgICAgICAgdmFyIGhhZE5vU291cmNlcyA9IGZhbHNlO1xuICAgICAgICByZW1vdmVTb3VyY2VSZXMuZXJyb3JzLmZvckVhY2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgaWYgKGVycm9yLm1lc3NhZ2UgPT09ICdBcHBsaWNhdGlvbiBTb3VyY2Ugd2l0aCB0aGUgZ2l2ZW4gSUQgZG9lcyBub3QgZXhpc3QnKSB7XG4gICAgICAgICAgICBoYWROb1NvdXJjZXMgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghaGFkTm9Tb3VyY2VzKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHJlbW92ZVNvdXJjZVJlcy5lcnJvcnNbMF0ubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgYWRkQXBwbGljYXRpb25Tb3VyY2VSZXMgPSBhd2FpdCB0aGlzLmFkZEFwcGxpY2F0aW9uU291cmNlKGNsaWVudCwgYXBwbGljYXRpb25JZCwge1xuICAgICAgICBjb250ZW50OiBfemlwLmdlbmVyYXRlKHt0eXBlOiAnYmFzZTY0J30pLFxuICAgICAgICBmaWxlbmFtZTogJ2FwcGxpY2F0aW9uLnppcCcsXG4gICAgICAgIGV4dGVuc2lvbjogJ3ppcCdcbiAgICAgIH0pO1xuICAgICAgZXJyb3JIYW5kbGVyKGFkZEFwcGxpY2F0aW9uU291cmNlUmVzKTtcbiAgICB9XG5cbiAgICBpZiAocGFyYW1zICYmIE9iamVjdC5rZXlzKHBhcmFtcykubGVuZ3RoKSB7XG4gICAgICBjb25zdCBhcmVTdWJzY3JpYmVyc09yZGVyZWQgPSBBcnJheS5pc0FycmF5KHBhcmFtcyk7XG4gICAgICBjb25zdCB1cGRhdGVBcHBsaWNhdGlvblJlcyA9IGF3YWl0IHRoaXMudXBkYXRlQXBwbGljYXRpb24oY2xpZW50LCB7XG4gICAgICAgIF9pZDogYXBwbGljYXRpb25JZCxcbiAgICAgICAgcGFyYW1ldGVyczogSlNPTi5zdHJpbmdpZnkobm9ybWFsaXplUGFyYW1ldGVycyhwYXJhbXMpKSxcbiAgICAgICAgYXJlU3Vic2NyaWJlcnNPcmRlcmVkXG4gICAgICB9KTtcbiAgICAgIGVycm9ySGFuZGxlcih1cGRhdGVBcHBsaWNhdGlvblJlcyk7XG4gICAgfVxuXG4gICAgY29uc3QgY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uUmVzID0gYXdhaXQgdGhpcy5jcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb24oY2xpZW50LCBhcHBsaWNhdGlvbklkKTtcbiAgICBlcnJvckhhbmRsZXIoY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uUmVzKTtcblxuICAgIGNvbnN0IHByb3RlY3Rpb25JZCA9IGNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvblJlcy5kYXRhLmNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvbi5faWQ7XG4gICAgYXdhaXQgdGhpcy5wb2xsUHJvdGVjdGlvbihjbGllbnQsIGFwcGxpY2F0aW9uSWQsIHByb3RlY3Rpb25JZCk7XG5cbiAgICBjb25zdCBkb3dubG9hZCA9IGF3YWl0IHRoaXMuZG93bmxvYWRBcHBsaWNhdGlvblByb3RlY3Rpb24oY2xpZW50LCBwcm90ZWN0aW9uSWQpO1xuICAgIGVycm9ySGFuZGxlcihkb3dubG9hZCk7XG4gICAgdW56aXAoZG93bmxvYWQsIGZpbGVzRGVzdCB8fCBkZXN0Q2FsbGJhY2spO1xuICB9LFxuICAvL1xuICBhc3luYyBwb2xsUHJvdGVjdGlvbiAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBwcm90ZWN0aW9uSWQpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcblxuICAgIGNvbnN0IHBvbGwgPSBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBhcHBsaWNhdGlvblByb3RlY3Rpb24gPSBhd2FpdCB0aGlzLmdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbihjbGllbnQsIGFwcGxpY2F0aW9uSWQsIHByb3RlY3Rpb25JZCk7XG4gICAgICBpZiAoYXBwbGljYXRpb25Qcm90ZWN0aW9uLmVycm9ycykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIHBvbGxpbmcgcHJvdGVjdGlvbicpO1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoJ0Vycm9yIHBvbGxpbmcgcHJvdGVjdGlvbicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3RhdGUgPSBhcHBsaWNhdGlvblByb3RlY3Rpb24uZGF0YS5hcHBsaWNhdGlvblByb3RlY3Rpb24uc3RhdGU7XG4gICAgICAgIGlmIChzdGF0ZSAhPT0gJ2ZpbmlzaGVkJyAmJiBzdGF0ZSAhPT0gJ2Vycm9yZWQnKSB7XG4gICAgICAgICAgc2V0VGltZW91dChwb2xsLCA1MDApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBwb2xsKCk7XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgY3JlYXRlQXBwbGljYXRpb24gKGNsaWVudCwgZGF0YSwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIGNyZWF0ZUFwcGxpY2F0aW9uKGRhdGEsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyBkdXBsaWNhdGVBcHBsaWNhdGlvbiAoY2xpZW50LCBkYXRhLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgZHVwbGljYXRlQXBwbGljYXRpb24oZGF0YSwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHJlbW92ZUFwcGxpY2F0aW9uIChjbGllbnQsIGlkKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHJlbW92ZUFwcGxpY2F0aW9uKGlkKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHJlbW92ZVByb3RlY3Rpb24gKGNsaWVudCwgaWQsIGFwcElkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgcmVtb3ZlUHJvdGVjdGlvbihpZCwgYXBwSWQsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyB1cGRhdGVBcHBsaWNhdGlvbiAoY2xpZW50LCBhcHBsaWNhdGlvbiwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHVwZGF0ZUFwcGxpY2F0aW9uKGFwcGxpY2F0aW9uLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgdW5sb2NrQXBwbGljYXRpb24gKGNsaWVudCwgYXBwbGljYXRpb24sIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCB1bmxvY2tBcHBsaWNhdGlvbihhcHBsaWNhdGlvbiwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGdldEFwcGxpY2F0aW9uIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldEFwcGxpY2F0aW9uKGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyBnZXRBcHBsaWNhdGlvblNvdXJjZSAoY2xpZW50LCBzb3VyY2VJZCwgZnJhZ21lbnRzLCBsaW1pdHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KCcvYXBwbGljYXRpb24nLCBnZXRBcHBsaWNhdGlvblNvdXJjZShzb3VyY2VJZCwgZnJhZ21lbnRzLCBsaW1pdHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9ucyAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBwYXJhbXMsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnMoYXBwbGljYXRpb25JZCwgcGFyYW1zLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uc0NvdW50IChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoJy9hcHBsaWNhdGlvbicsIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNDb3VudChhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgY3JlYXRlVGVtcGxhdGUgKGNsaWVudCwgdGVtcGxhdGUsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCBjcmVhdGVUZW1wbGF0ZSh0ZW1wbGF0ZSwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHJlbW92ZVRlbXBsYXRlIChjbGllbnQsIGlkKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHJlbW92ZVRlbXBsYXRlKGlkKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGdldFRlbXBsYXRlcyAoY2xpZW50LCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KCcvYXBwbGljYXRpb24nLCBnZXRUZW1wbGF0ZXMoZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGdldEFwcGxpY2F0aW9ucyAoY2xpZW50LCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KCcvYXBwbGljYXRpb24nLCBnZXRBcHBsaWNhdGlvbnMoZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGFkZEFwcGxpY2F0aW9uU291cmNlIChjbGllbnQsIGFwcGxpY2F0aW9uSWQsIGFwcGxpY2F0aW9uU291cmNlLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgYWRkQXBwbGljYXRpb25Tb3VyY2UoYXBwbGljYXRpb25JZCwgYXBwbGljYXRpb25Tb3VyY2UsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyBhZGRBcHBsaWNhdGlvblNvdXJjZUZyb21VUkwgKGNsaWVudCwgYXBwbGljYXRpb25JZCwgdXJsLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICByZXR1cm4gZ2V0RmlsZUZyb21VcmwoY2xpZW50LCB1cmwpXG4gICAgICAudGhlbihmdW5jdGlvbihmaWxlKSB7XG4gICAgICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCBhZGRBcHBsaWNhdGlvblNvdXJjZShhcHBsaWNhdGlvbklkLCBmaWxlLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgICB9KTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgdXBkYXRlQXBwbGljYXRpb25Tb3VyY2UgKGNsaWVudCwgYXBwbGljYXRpb25Tb3VyY2UsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCB1cGRhdGVBcHBsaWNhdGlvblNvdXJjZShhcHBsaWNhdGlvblNvdXJjZSwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIHJlbW92ZVNvdXJjZUZyb21BcHBsaWNhdGlvbiAoY2xpZW50LCBzb3VyY2VJZCwgYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSB7XG4gICAgY29uc3QgZGVmZXJyZWQgPSBRLmRlZmVyKCk7XG4gICAgY2xpZW50LnBvc3QoJy9hcHBsaWNhdGlvbicsIHJlbW92ZVNvdXJjZUZyb21BcHBsaWNhdGlvbihzb3VyY2VJZCwgYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGFwcGx5VGVtcGxhdGUgKGNsaWVudCwgdGVtcGxhdGVJZCwgYXBwSWQsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCBhcHBseVRlbXBsYXRlKHRlbXBsYXRlSWQsIGFwcElkLCBmcmFnbWVudHMpLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpKTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgfSxcbiAgLy9cbiAgYXN5bmMgdXBkYXRlVGVtcGxhdGUgKGNsaWVudCwgdGVtcGxhdGUsIGZyYWdtZW50cykge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5wb3N0KCcvYXBwbGljYXRpb24nLCB1cGRhdGVUZW1wbGF0ZSh0ZW1wbGF0ZSwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvbiAoY2xpZW50LCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQucG9zdCgnL2FwcGxpY2F0aW9uJywgY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uKGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cyksIHJlc3BvbnNlSGFuZGxlcihkZWZlcnJlZCkpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICB9LFxuICAvL1xuICBhc3luYyBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb24gKGNsaWVudCwgYXBwbGljYXRpb25JZCwgcHJvdGVjdGlvbklkLCBmcmFnbWVudHMpIHtcbiAgICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgICBjbGllbnQuZ2V0KCcvYXBwbGljYXRpb24nLCBnZXRQcm90ZWN0aW9uKGFwcGxpY2F0aW9uSWQsIHByb3RlY3Rpb25JZCwgZnJhZ21lbnRzKSwgcmVzcG9uc2VIYW5kbGVyKGRlZmVycmVkKSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH0sXG4gIC8vXG4gIGFzeW5jIGRvd25sb2FkQXBwbGljYXRpb25Qcm90ZWN0aW9uIChjbGllbnQsIHByb3RlY3Rpb25JZCkge1xuICAgIGNvbnN0IGRlZmVycmVkID0gUS5kZWZlcigpO1xuICAgIGNsaWVudC5nZXQoYC9hcHBsaWNhdGlvbi9kb3dubG9hZC8ke3Byb3RlY3Rpb25JZH1gLCBudWxsLCByZXNwb25zZUhhbmRsZXIoZGVmZXJyZWQpLCBmYWxzZSk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGdldEZpbGVGcm9tVXJsIChjbGllbnQsIHVybCkge1xuICBjb25zdCBkZWZlcnJlZCA9IFEuZGVmZXIoKTtcbiAgdmFyIGZpbGU7XG4gIHJlcXVlc3QuZ2V0KHVybClcbiAgICAudGhlbigocmVzKSA9PiB7XG4gICAgICBmaWxlID0ge1xuICAgICAgICBjb250ZW50OiByZXMuZGF0YSxcbiAgICAgICAgZmlsZW5hbWU6IHBhdGguYmFzZW5hbWUodXJsKSxcbiAgICAgICAgZXh0ZW5zaW9uOiBwYXRoLmV4dG5hbWUodXJsKS5zdWJzdHIoMSlcbiAgICAgIH07XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKGZpbGUpO1xuICAgIH0pXG4gICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIGRlZmVycmVkLnJlamVjdChlcnIpO1xuICAgIH0pO1xuICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuZnVuY3Rpb24gcmVzcG9uc2VIYW5kbGVyIChkZWZlcnJlZCkge1xuICByZXR1cm4gKGVyciwgcmVzKSA9PiB7XG4gICAgaWYgKGVycikge1xuICAgICAgZGVmZXJyZWQucmVqZWN0KGVycik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBib2R5ID0gcmVzLmRhdGE7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAocmVzLnN0YXR1cyA+PSA0MDApIHtcbiAgICAgICAgICBkZWZlcnJlZC5yZWplY3QoYm9keSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShib2R5KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXgpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KGJvZHkpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gZXJyb3JIYW5kbGVyIChyZXMpIHtcbiAgaWYgKHJlcy5lcnJvcnMgJiYgcmVzLmVycm9ycy5sZW5ndGgpIHtcbiAgICByZXMuZXJyb3JzLmZvckVhY2goZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVQYXJhbWV0ZXJzIChwYXJhbWV0ZXJzKSB7XG4gIHZhciByZXN1bHQ7XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KHBhcmFtZXRlcnMpKSB7XG4gICAgcmVzdWx0ID0gW107XG4gICAgT2JqZWN0LmtleXMocGFyYW1ldGVycykuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgcmVzdWx0LnB1c2goe1xuICAgICAgICBuYW1lLFxuICAgICAgICBvcHRpb25zOiBwYXJhbWV0ZXJzW25hbWVdXG4gICAgICB9KVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9IHBhcmFtZXRlcnM7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIl19
