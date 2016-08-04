'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zip = zip;
exports.unzip = unzip;

var _lodash = require('lodash.size');

var _lodash2 = _interopRequireDefault(_lodash);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _jszip = require('jszip');

var _jszip2 = _interopRequireDefault(_jszip);

var _fsExtra = require('fs-extra');

var _path = require('path');

var _q = require('q');

var _util = require('util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = !!process.env.DEBUG; // TODO Replace `sync` functions with async versions

function zip(files, cwd) {
  debug && console.log('Zipping files', (0, _util.inspect)(files));
  var deferred = (0, _q.defer)();
  // Flag to detect if any file was added to the zip archive
  var hasFiles = false;
  // Sanitize `cwd`
  if (cwd) {
    cwd = (0, _path.normalize)(cwd);
  }
  // If it's already a zip file
  if (files.length === 1 && /^.*\.zip$/.test(files[0])) {
    hasFiles = true;
    (0, _fsExtra.outputFileSync)(_temp2.default.openSync({ suffix: '.zip' }).path, (0, _fsExtra.readFileSync)(files[0]));
  } else {
    var _zip = new _jszip2.default();
    for (var i = 0, l = files.length; i < l; ++i) {
      // Sanitise path
      if (typeof files[i] === 'string') {
        files[i] = (0, _path.normalize)(files[i]);
        if (files[i].indexOf('../') === 0) {
          files[i] = (0, _path.resolve)(files[i]);
        }
      }
      // Bypass unwanted patterns from `files`
      if (/.*\.(git|hg)(\/.*|$)/.test(files[i].path || files[i])) {
        continue;
      }
      var buffer = void 0,
          name = void 0;
      var sPath = void 0;
      if (cwd && files[i].indexOf && files[i].indexOf(cwd) !== 0) {
        sPath = (0, _path.join)(cwd, files[i]);
      } else {
        sPath = files[i];
      }
      // If buffer
      if (files[i].contents) {
        name = (0, _path.relative)(files[i].cwd, files[i].path);
        buffer = files[i].contents;
      }
      // Else if it's a path and not a directory
      else if (!(0, _fsExtra.statSync)(sPath).isDirectory()) {
          if (cwd && files[i].indexOf && files[i].indexOf(cwd) === 0) {
            name = files[i].substring(cwd.length);
          } else {
            name = files[i];
          }
          buffer = (0, _fsExtra.readFileSync)(sPath);
        }
        // Else if it's a directory path
        else {
            _zip.folder(sPath);
          }
      if (name) {
        hasFiles = true;
        _zip.file(name, buffer);
      }
    }
    if (hasFiles) {
      var tempFile = _temp2.default.openSync({ suffix: '.zip' });
      (0, _fsExtra.outputFileSync)(tempFile.path, _zip.generate({ type: 'nodebuffer' }), { encoding: 'base64' });
      files[0] = tempFile.path;
      files.length = 1;
      deferred.resolve(_zip);
    } else {
      throw new Error('No source files found. If you intend to send a whole directory sufix your path with "**" (e.g. ./my-directory/**)');
    }
  }

  return deferred.promise;
}

function unzip(zipFile, dest) {
  var zip = new _jszip2.default(zipFile);
  var _size = (0, _lodash2.default)(zip.files);

  for (var file in zip.files) {
    if (!zip.files[file].options.dir) {
      var buffer = zip.file(file).asNodeBuffer();

      if (typeof dest === 'function') {
        dest(buffer, file);
      } else if (dest) {
        var destPath;

        var lastDestChar = dest[dest.length - 1];
        if (_size === 1 && lastDestChar !== '/' && lastDestChar !== '\\') {
          destPath = dest;
        } else {
          destPath = (0, _path.join)(dest, file);
        }
        (0, _fsExtra.outputFileSync)(destPath, buffer);
      }
    }
  }
}
//# sourceMappingURL=data:application/json;base64,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U0FGRCxNQUVPO0FBQ0wscUJBQVcsZ0JBQUssSUFBTCxFQUFXLElBQVgsQ0FBWDtBQUNEO0FBQ0QscUNBQWUsUUFBZixFQUF5QixNQUF6QjtBQUNEO0FBQ0Y7QUFDRjtBQUNGIiwiZmlsZSI6InppcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIFRPRE8gUmVwbGFjZSBgc3luY2AgZnVuY3Rpb25zIHdpdGggYXN5bmMgdmVyc2lvbnNcblxuaW1wb3J0IHNpemUgZnJvbSAnbG9kYXNoLnNpemUnO1xuaW1wb3J0IHRlbXAgZnJvbSAndGVtcCc7XG5pbXBvcnQgSlNaaXAgZnJvbSAnanN6aXAnO1xuaW1wb3J0IHtyZWFkRmlsZVN5bmMsIHN0YXRTeW5jLCBvdXRwdXRGaWxlU3luY30gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHtub3JtYWxpemUsIHJlc29sdmUsIHJlbGF0aXZlLCBqb2lufSBmcm9tICdwYXRoJztcbmltcG9ydCB7ZGVmZXJ9IGZyb20gJ3EnO1xuaW1wb3J0IHtpbnNwZWN0fSBmcm9tICd1dGlsJztcblxuY29uc3QgZGVidWcgPSAhIXByb2Nlc3MuZW52LkRFQlVHO1xuXG5leHBvcnQgZnVuY3Rpb24gemlwIChmaWxlcywgY3dkKSB7XG4gIGRlYnVnICYmIGNvbnNvbGUubG9nKCdaaXBwaW5nIGZpbGVzJywgaW5zcGVjdChmaWxlcykpO1xuICBjb25zdCBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gIC8vIEZsYWcgdG8gZGV0ZWN0IGlmIGFueSBmaWxlIHdhcyBhZGRlZCB0byB0aGUgemlwIGFyY2hpdmVcbiAgdmFyIGhhc0ZpbGVzID0gZmFsc2U7XG4gIC8vIFNhbml0aXplIGBjd2RgXG4gIGlmIChjd2QpIHtcbiAgICBjd2QgPSBub3JtYWxpemUoY3dkKTtcbiAgfVxuICAvLyBJZiBpdCdzIGFscmVhZHkgYSB6aXAgZmlsZVxuICBpZiAoZmlsZXMubGVuZ3RoID09PSAxICYmIC9eLipcXC56aXAkLy50ZXN0KGZpbGVzWzBdKSkge1xuICAgIGhhc0ZpbGVzID0gdHJ1ZTtcbiAgICBvdXRwdXRGaWxlU3luYyh0ZW1wLm9wZW5TeW5jKHtzdWZmaXg6ICcuemlwJ30pLnBhdGgsIHJlYWRGaWxlU3luYyhmaWxlc1swXSkpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHppcCA9IG5ldyBKU1ppcCgpO1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gZmlsZXMubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgICAvLyBTYW5pdGlzZSBwYXRoXG4gICAgICBpZiAodHlwZW9mIGZpbGVzW2ldID09PSAnc3RyaW5nJykge1xuICAgICAgICBmaWxlc1tpXSA9IG5vcm1hbGl6ZShmaWxlc1tpXSk7XG4gICAgICAgIGlmIChmaWxlc1tpXS5pbmRleE9mKCcuLi8nKSA9PT0gMCkge1xuICAgICAgICAgIGZpbGVzW2ldID0gcmVzb2x2ZShmaWxlc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIEJ5cGFzcyB1bndhbnRlZCBwYXR0ZXJucyBmcm9tIGBmaWxlc2BcbiAgICAgIGlmICgvLipcXC4oZ2l0fGhnKShcXC8uKnwkKS8udGVzdChmaWxlc1tpXS5wYXRoIHx8IGZpbGVzW2ldKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGxldCBidWZmZXIsIG5hbWU7XG4gICAgICBsZXQgc1BhdGg7XG4gICAgICBpZiAoY3dkICYmIGZpbGVzW2ldLmluZGV4T2YgJiYgZmlsZXNbaV0uaW5kZXhPZihjd2QpICE9PSAwKSB7XG4gICAgICAgIHNQYXRoID0gam9pbihjd2QsIGZpbGVzW2ldKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNQYXRoID0gZmlsZXNbaV07XG4gICAgICB9XG4gICAgICAvLyBJZiBidWZmZXJcbiAgICAgIGlmIChmaWxlc1tpXS5jb250ZW50cykge1xuICAgICAgICBuYW1lID0gcmVsYXRpdmUoZmlsZXNbaV0uY3dkLCBmaWxlc1tpXS5wYXRoKTtcbiAgICAgICAgYnVmZmVyID0gZmlsZXNbaV0uY29udGVudHM7XG4gICAgICB9XG4gICAgICAvLyBFbHNlIGlmIGl0J3MgYSBwYXRoIGFuZCBub3QgYSBkaXJlY3RvcnlcbiAgICAgIGVsc2UgaWYgKCFzdGF0U3luYyhzUGF0aCkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICBpZiAoY3dkICYmIGZpbGVzW2ldLmluZGV4T2YgJiYgZmlsZXNbaV0uaW5kZXhPZihjd2QpID09PSAwKSB7XG4gICAgICAgICAgbmFtZSA9IGZpbGVzW2ldLnN1YnN0cmluZyhjd2QubGVuZ3RoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuYW1lID0gZmlsZXNbaV07XG4gICAgICAgIH1cbiAgICAgICAgYnVmZmVyID0gcmVhZEZpbGVTeW5jKHNQYXRoKTtcbiAgICAgIH1cbiAgICAgIC8vIEVsc2UgaWYgaXQncyBhIGRpcmVjdG9yeSBwYXRoXG4gICAgICBlbHNlIHtcbiAgICAgICAgemlwLmZvbGRlcihzUGF0aCk7XG4gICAgICB9XG4gICAgICBpZiAobmFtZSkge1xuICAgICAgICBoYXNGaWxlcyA9IHRydWU7XG4gICAgICAgIHppcC5maWxlKG5hbWUsIGJ1ZmZlcik7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChoYXNGaWxlcykge1xuICAgICAgdmFyIHRlbXBGaWxlID0gdGVtcC5vcGVuU3luYyh7c3VmZml4OiAnLnppcCd9KTtcbiAgICAgIG91dHB1dEZpbGVTeW5jKHRlbXBGaWxlLnBhdGgsIHppcC5nZW5lcmF0ZSh7dHlwZTogJ25vZGVidWZmZXInfSksIHtlbmNvZGluZzogJ2Jhc2U2NCd9KTtcbiAgICAgIGZpbGVzWzBdID0gdGVtcEZpbGUucGF0aDtcbiAgICAgIGZpbGVzLmxlbmd0aCA9IDE7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKHppcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm8gc291cmNlIGZpbGVzIGZvdW5kLiBJZiB5b3UgaW50ZW5kIHRvIHNlbmQgYSB3aG9sZSBkaXJlY3Rvcnkgc3VmaXggeW91ciBwYXRoIHdpdGggXCIqKlwiIChlLmcuIC4vbXktZGlyZWN0b3J5LyoqKScpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdW56aXAgKHppcEZpbGUsIGRlc3QpIHtcbiAgY29uc3QgemlwID0gbmV3IEpTWmlwKHppcEZpbGUpO1xuICBjb25zdCBfc2l6ZSA9IHNpemUoemlwLmZpbGVzKTtcblxuICBmb3IgKGxldCBmaWxlIGluIHppcC5maWxlcykge1xuICAgIGlmICghemlwLmZpbGVzW2ZpbGVdLm9wdGlvbnMuZGlyKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSB6aXAuZmlsZShmaWxlKS5hc05vZGVCdWZmZXIoKTtcblxuICAgICAgaWYgKHR5cGVvZiBkZXN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGRlc3QoYnVmZmVyLCBmaWxlKTtcbiAgICAgIH0gZWxzZSBpZiAoZGVzdCkge1xuICAgICAgICB2YXIgZGVzdFBhdGg7XG5cbiAgICAgICAgY29uc3QgbGFzdERlc3RDaGFyID0gZGVzdFtkZXN0Lmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAoX3NpemUgPT09IDEgJiYgbGFzdERlc3RDaGFyICE9PSAnLycgJiYgbGFzdERlc3RDaGFyICE9PSAnXFxcXCcpIHtcbiAgICAgICAgICBkZXN0UGF0aCA9IGRlc3Q7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZGVzdFBhdGggPSBqb2luKGRlc3QsIGZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIG91dHB1dEZpbGVTeW5jKGRlc3RQYXRoLCBidWZmZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19
