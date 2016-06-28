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
//# sourceMappingURL=data:application/json;base64,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SUFBWCxDQUFYO0FBQ0Q7QUFDRCxxQ0FBZSxRQUFmLEVBQXlCLE1BQXpCO0FBQ0Q7QUFDRjtBQUNGO0FBQ0YiLCJmaWxlIjoiemlwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVE9ETyBSZXBsYWNlIGBzeW5jYCBmdW5jdGlvbnMgd2l0aCBhc3luYyB2ZXJzaW9uc1xuXG5pbXBvcnQgc2l6ZSBmcm9tICdsb2Rhc2guc2l6ZSc7XG5pbXBvcnQgdGVtcCBmcm9tICd0ZW1wJztcbmltcG9ydCBKU1ppcCBmcm9tICdqc3ppcCc7XG5pbXBvcnQge3JlYWRGaWxlU3luYywgc3RhdFN5bmMsIG91dHB1dEZpbGVTeW5jfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQge25vcm1hbGl6ZSwgcmVzb2x2ZSwgcmVsYXRpdmUsIGpvaW59IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtkZWZlcn0gZnJvbSAncSc7XG5pbXBvcnQge2luc3BlY3R9IGZyb20gJ3V0aWwnO1xuXG5jb25zdCBkZWJ1ZyA9ICEhcHJvY2Vzcy5lbnYuREVCVUc7XG5cbmV4cG9ydCBmdW5jdGlvbiB6aXAgKGZpbGVzLCBjd2QpIHtcbiAgZGVidWcgJiYgY29uc29sZS5sb2coJ1ppcHBpbmcgZmlsZXMnLCBpbnNwZWN0KGZpbGVzKSk7XG4gIGNvbnN0IGRlZmVycmVkID0gZGVmZXIoKTtcbiAgLy8gRmxhZyB0byBkZXRlY3QgaWYgYW55IGZpbGUgd2FzIGFkZGVkIHRvIHRoZSB6aXAgYXJjaGl2ZVxuICB2YXIgaGFzRmlsZXMgPSBmYWxzZTtcbiAgLy8gU2FuaXRpemUgYGN3ZGBcbiAgaWYgKGN3ZCkge1xuICAgIGN3ZCA9IG5vcm1hbGl6ZShjd2QpO1xuICB9XG4gIC8vIElmIGl0J3MgYWxyZWFkeSBhIHppcCBmaWxlXG4gIGlmIChmaWxlcy5sZW5ndGggPT09IDEgJiYgL14uKlxcLnppcCQvLnRlc3QoZmlsZXNbMF0pKSB7XG4gICAgaGFzRmlsZXMgPSB0cnVlO1xuICAgIG91dHB1dEZpbGVTeW5jKHRlbXAub3BlblN5bmMoe3N1ZmZpeDogJy56aXAnfSkucGF0aCwgcmVhZEZpbGVTeW5jKGZpbGVzWzBdKSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgemlwID0gbmV3IEpTWmlwKCk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBmaWxlcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgIC8vIFNhbml0aXNlIHBhdGhcbiAgICAgIGlmICh0eXBlb2YgZmlsZXNbaV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGZpbGVzW2ldID0gbm9ybWFsaXplKGZpbGVzW2ldKTtcbiAgICAgICAgaWYgKGZpbGVzW2ldLmluZGV4T2YoJy4uLycpID09PSAwKSB7XG4gICAgICAgICAgZmlsZXNbaV0gPSByZXNvbHZlKGZpbGVzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gQnlwYXNzIHVud2FudGVkIHBhdHRlcm5zIGZyb20gYGZpbGVzYFxuICAgICAgaWYgKC8uKlxcLihnaXR8aGcpKFxcLy4qfCQpLy50ZXN0KGZpbGVzW2ldLnBhdGggfHwgZmlsZXNbaV0pKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbGV0IGJ1ZmZlciwgbmFtZTtcbiAgICAgIGxldCBzUGF0aDtcbiAgICAgIGlmIChjd2QgJiYgZmlsZXNbaV0uaW5kZXhPZiAmJiBmaWxlc1tpXS5pbmRleE9mKGN3ZCkgIT09IDApIHtcbiAgICAgICAgc1BhdGggPSBqb2luKGN3ZCwgZmlsZXNbaV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc1BhdGggPSBmaWxlc1tpXTtcbiAgICAgIH1cbiAgICAgIC8vIElmIGJ1ZmZlclxuICAgICAgaWYgKGZpbGVzW2ldLmNvbnRlbnRzKSB7XG4gICAgICAgIG5hbWUgPSByZWxhdGl2ZShmaWxlc1tpXS5jd2QsIGZpbGVzW2ldLnBhdGgpO1xuICAgICAgICBidWZmZXIgPSBmaWxlc1tpXS5jb250ZW50cztcbiAgICAgIH1cbiAgICAgIC8vIEVsc2UgaWYgaXQncyBhIHBhdGggYW5kIG5vdCBhIGRpcmVjdG9yeVxuICAgICAgZWxzZSBpZiAoIXN0YXRTeW5jKHNQYXRoKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIGlmIChjd2QgJiYgZmlsZXNbaV0uaW5kZXhPZiAmJiBmaWxlc1tpXS5pbmRleE9mKGN3ZCkgPT09IDApIHtcbiAgICAgICAgICBuYW1lID0gZmlsZXNbaV0uc3Vic3RyaW5nKGN3ZC5sZW5ndGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5hbWUgPSBmaWxlc1tpXTtcbiAgICAgICAgfVxuICAgICAgICBidWZmZXIgPSByZWFkRmlsZVN5bmMoc1BhdGgpO1xuICAgICAgfVxuICAgICAgLy8gRWxzZSBpZiBpdCdzIGEgZGlyZWN0b3J5IHBhdGhcbiAgICAgIGVsc2Uge1xuICAgICAgICB6aXAuZm9sZGVyKHNQYXRoKTtcbiAgICAgIH1cbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIGhhc0ZpbGVzID0gdHJ1ZTtcbiAgICAgICAgemlwLmZpbGUobmFtZSwgYnVmZmVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGhhc0ZpbGVzKSB7XG4gICAgICB2YXIgdGVtcEZpbGUgPSB0ZW1wLm9wZW5TeW5jKHtzdWZmaXg6ICcuemlwJ30pO1xuICAgICAgb3V0cHV0RmlsZVN5bmModGVtcEZpbGUucGF0aCwgemlwLmdlbmVyYXRlKHt0eXBlOiAnbm9kZWJ1ZmZlcid9KSwge2VuY29kaW5nOiAnYmFzZTY0J30pO1xuICAgICAgZmlsZXNbMF0gPSB0ZW1wRmlsZS5wYXRoO1xuICAgICAgZmlsZXMubGVuZ3RoID0gMTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoemlwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBzb3VyY2UgZmlsZXMgZm91bmQuIElmIHlvdSBpbnRlbmQgdG8gc2VuZCBhIHdob2xlIGRpcmVjdG9yeSBzdWZpeCB5b3VyIHBhdGggd2l0aCBcIioqXCIgKGUuZy4gLi9teS1kaXJlY3RvcnkvKiopJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bnppcCAoemlwRmlsZSwgZGVzdCkge1xuICBjb25zdCB6aXAgPSBuZXcgSlNaaXAoemlwRmlsZSk7XG4gIGNvbnN0IF9zaXplID0gc2l6ZSh6aXAuZmlsZXMpO1xuXG4gIGZvciAobGV0IGZpbGUgaW4gemlwLmZpbGVzKSB7XG4gICAgaWYgKCF6aXAuZmlsZXNbZmlsZV0ub3B0aW9ucy5kaXIpIHtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IHppcC5maWxlKGZpbGUpLmFzTm9kZUJ1ZmZlcigpO1xuXG4gICAgICBpZiAodHlwZW9mIGRlc3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZGVzdChidWZmZXIsIGZpbGUpO1xuICAgICAgfSBlbHNlIGlmIChkZXN0KSB7XG4gICAgICAgIHZhciBkZXN0UGF0aDtcblxuICAgICAgICBjb25zdCBsYXN0RGVzdENoYXIgPSBkZXN0W2Rlc3QubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmIChfc2l6ZSA9PT0gMSAmJiBsYXN0RGVzdENoYXIgIT09ICcvJyAmJiBsYXN0RGVzdENoYXIgIT09ICdcXFxcJykge1xuICAgICAgICAgIGRlc3RQYXRoID0gZGVzdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZXN0UGF0aCA9IGpvaW4oZGVzdCwgZmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgb3V0cHV0RmlsZVN5bmMoZGVzdFBhdGgsIGJ1ZmZlcik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=
