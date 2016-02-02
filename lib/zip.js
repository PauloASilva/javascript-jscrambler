// TODO Replace `sync` functions with async versions

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.zip = zip;
exports.unzip = unzip;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _lodashSize = require('lodash.size');

var _lodashSize2 = _interopRequireDefault(_lodashSize);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

var _jszip = require('jszip');

var _jszip2 = _interopRequireDefault(_jszip);

var _fsExtra = require('fs-extra');

var _path = require('path');

var _q = require('q');

var _util = require('util');

var debug = !!process.env.DEBUG;

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
    (0, _fsExtra.outputFileSync)(_temp2['default'].openSync({ suffix: '.zip' }).path, (0, _fsExtra.readFileSync)(files[0]));
  } else {
    var _zip = new _jszip2['default']();
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
      var buffer = undefined,
          _name = undefined;
      var sPath = undefined;
      if (cwd && files[i].indexOf && files[i].indexOf(cwd) !== 0) {
        sPath = (0, _path.join)(cwd, files[i]);
      } else {
        sPath = files[i];
      }
      // If buffer
      if (files[i].contents) {
        _name = (0, _path.relative)(files[i].cwd, files[i].path);
        buffer = files[i].contents;
      }
      // Else if it's a path and not a directory
      else if (!(0, _fsExtra.statSync)(sPath).isDirectory()) {
          if (cwd && files[i].indexOf && files[i].indexOf(cwd) === 0) {
            _name = files[i].substring(cwd.length);
          } else {
            _name = files[i];
          }
          buffer = (0, _fsExtra.readFileSync)(sPath);
        }
        // Else if it's a directory path
        else {
            _zip.folder(sPath);
          }
      if (_name) {
        hasFiles = true;
        _zip.file(_name, buffer);
      }
    }
    if (hasFiles) {
      var tempFile = _temp2['default'].openSync({ suffix: '.zip' });
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
  var zip = new _jszip2['default'](zipFile);
  var _size = (0, _lodashSize2['default'])(zip.files);

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
//# sourceMappingURL=data:application/json;base64,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QU8sRUFBRSxJQUFJLEVBQUU7QUFDcEMsTUFBTSxHQUFHLEdBQUcsdUJBQVUsT0FBTyxDQUFDLENBQUM7QUFDL0IsTUFBTSxLQUFLLEdBQUcsNkJBQUssR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUU5QixPQUFLLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7QUFDMUIsUUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUNoQyxVQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDOztBQUU3QyxVQUFJLE9BQU8sSUFBSSxLQUFLLFVBQVUsRUFBRTtBQUM5QixZQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO09BQ3BCLE1BQU0sSUFBSSxJQUFJLEVBQUU7QUFDZixZQUFJLFFBQVEsQ0FBQzs7QUFFYixZQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMzQyxZQUFJLEtBQUssS0FBSyxDQUFDLElBQUksWUFBWSxLQUFLLEdBQUcsSUFBSSxZQUFZLEtBQUssSUFBSSxFQUFFO0FBQ2hFLGtCQUFRLEdBQUcsSUFBSSxDQUFDO1NBQ2pCLE1BQU07QUFDTCxrQkFBUSxHQUFHLGdCQUFLLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUM3Qjs7QUFFRCxxQ0FBZSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDbEM7S0FDRjtHQUNGO0NBQ0YiLCJmaWxlIjoiemlwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gVE9ETyBSZXBsYWNlIGBzeW5jYCBmdW5jdGlvbnMgd2l0aCBhc3luYyB2ZXJzaW9uc1xuXG5pbXBvcnQgc2l6ZSBmcm9tICdsb2Rhc2guc2l6ZSc7XG5pbXBvcnQgdGVtcCBmcm9tICd0ZW1wJztcbmltcG9ydCBKU1ppcCBmcm9tICdqc3ppcCc7XG5pbXBvcnQge3JlYWRGaWxlU3luYywgc3RhdFN5bmMsIG91dHB1dEZpbGVTeW5jfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQge25vcm1hbGl6ZSwgcmVzb2x2ZSwgcmVsYXRpdmUsIGpvaW59IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtkZWZlcn0gZnJvbSAncSc7XG5pbXBvcnQge2luc3BlY3R9IGZyb20gJ3V0aWwnO1xuXG5jb25zdCBkZWJ1ZyA9ICEhcHJvY2Vzcy5lbnYuREVCVUc7XG5cbmV4cG9ydCBmdW5jdGlvbiB6aXAgKGZpbGVzLCBjd2QpIHtcbiAgZGVidWcgJiYgY29uc29sZS5sb2coJ1ppcHBpbmcgZmlsZXMnLCBpbnNwZWN0KGZpbGVzKSk7XG4gIGNvbnN0IGRlZmVycmVkID0gZGVmZXIoKTtcbiAgLy8gRmxhZyB0byBkZXRlY3QgaWYgYW55IGZpbGUgd2FzIGFkZGVkIHRvIHRoZSB6aXAgYXJjaGl2ZVxuICB2YXIgaGFzRmlsZXMgPSBmYWxzZTtcbiAgLy8gU2FuaXRpemUgYGN3ZGBcbiAgaWYgKGN3ZCkge1xuICAgIGN3ZCA9IG5vcm1hbGl6ZShjd2QpO1xuICB9XG4gIC8vIElmIGl0J3MgYWxyZWFkeSBhIHppcCBmaWxlXG4gIGlmIChmaWxlcy5sZW5ndGggPT09IDEgJiYgL14uKlxcLnppcCQvLnRlc3QoZmlsZXNbMF0pKSB7XG4gICAgaGFzRmlsZXMgPSB0cnVlO1xuICAgIG91dHB1dEZpbGVTeW5jKHRlbXAub3BlblN5bmMoe3N1ZmZpeDogJy56aXAnfSkucGF0aCwgcmVhZEZpbGVTeW5jKGZpbGVzWzBdKSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgemlwID0gbmV3IEpTWmlwKCk7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSBmaWxlcy5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICAgIC8vIFNhbml0aXNlIHBhdGhcbiAgICAgIGlmICh0eXBlb2YgZmlsZXNbaV0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGZpbGVzW2ldID0gbm9ybWFsaXplKGZpbGVzW2ldKTtcbiAgICAgICAgaWYgKGZpbGVzW2ldLmluZGV4T2YoJy4uLycpID09PSAwKSB7XG4gICAgICAgICAgZmlsZXNbaV0gPSByZXNvbHZlKGZpbGVzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gQnlwYXNzIHVud2FudGVkIHBhdHRlcm5zIGZyb20gYGZpbGVzYFxuICAgICAgaWYgKC8uKlxcLihnaXR8aGcpKFxcLy4qfCQpLy50ZXN0KGZpbGVzW2ldLnBhdGggfHwgZmlsZXNbaV0pKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgbGV0IGJ1ZmZlciwgbmFtZTtcbiAgICAgIGxldCBzUGF0aDtcbiAgICAgIGlmIChjd2QgJiYgZmlsZXNbaV0uaW5kZXhPZiAmJiBmaWxlc1tpXS5pbmRleE9mKGN3ZCkgIT09IDApIHtcbiAgICAgICAgc1BhdGggPSBqb2luKGN3ZCwgZmlsZXNbaV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc1BhdGggPSBmaWxlc1tpXTtcbiAgICAgIH1cbiAgICAgIC8vIElmIGJ1ZmZlclxuICAgICAgaWYgKGZpbGVzW2ldLmNvbnRlbnRzKSB7XG4gICAgICAgIG5hbWUgPSByZWxhdGl2ZShmaWxlc1tpXS5jd2QsIGZpbGVzW2ldLnBhdGgpO1xuICAgICAgICBidWZmZXIgPSBmaWxlc1tpXS5jb250ZW50cztcbiAgICAgIH1cbiAgICAgIC8vIEVsc2UgaWYgaXQncyBhIHBhdGggYW5kIG5vdCBhIGRpcmVjdG9yeVxuICAgICAgZWxzZSBpZiAoIXN0YXRTeW5jKHNQYXRoKS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIGlmIChjd2QgJiYgZmlsZXNbaV0uaW5kZXhPZiAmJiBmaWxlc1tpXS5pbmRleE9mKGN3ZCkgPT09IDApIHtcbiAgICAgICAgICBuYW1lID0gZmlsZXNbaV0uc3Vic3RyaW5nKGN3ZC5sZW5ndGgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5hbWUgPSBmaWxlc1tpXTtcbiAgICAgICAgfVxuICAgICAgICBidWZmZXIgPSByZWFkRmlsZVN5bmMoc1BhdGgpO1xuICAgICAgfVxuICAgICAgLy8gRWxzZSBpZiBpdCdzIGEgZGlyZWN0b3J5IHBhdGhcbiAgICAgIGVsc2Uge1xuICAgICAgICB6aXAuZm9sZGVyKHNQYXRoKTtcbiAgICAgIH1cbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIGhhc0ZpbGVzID0gdHJ1ZTtcbiAgICAgICAgemlwLmZpbGUobmFtZSwgYnVmZmVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGhhc0ZpbGVzKSB7XG4gICAgICB2YXIgdGVtcEZpbGUgPSB0ZW1wLm9wZW5TeW5jKHtzdWZmaXg6ICcuemlwJ30pO1xuICAgICAgb3V0cHV0RmlsZVN5bmModGVtcEZpbGUucGF0aCwgemlwLmdlbmVyYXRlKHt0eXBlOiAnbm9kZWJ1ZmZlcid9KSwge2VuY29kaW5nOiAnYmFzZTY0J30pO1xuICAgICAgZmlsZXNbMF0gPSB0ZW1wRmlsZS5wYXRoO1xuICAgICAgZmlsZXMubGVuZ3RoID0gMTtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoemlwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBzb3VyY2UgZmlsZXMgZm91bmQuIElmIHlvdSBpbnRlbmQgdG8gc2VuZCBhIHdob2xlIGRpcmVjdG9yeSBzdWZpeCB5b3VyIHBhdGggd2l0aCBcIioqXCIgKGUuZy4gLi9teS1kaXJlY3RvcnkvKiopJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bnppcCAoemlwRmlsZSwgZGVzdCkge1xuICBjb25zdCB6aXAgPSBuZXcgSlNaaXAoemlwRmlsZSk7XG4gIGNvbnN0IF9zaXplID0gc2l6ZSh6aXAuZmlsZXMpO1xuXG4gIGZvciAobGV0IGZpbGUgaW4gemlwLmZpbGVzKSB7XG4gICAgaWYgKCF6aXAuZmlsZXNbZmlsZV0ub3B0aW9ucy5kaXIpIHtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IHppcC5maWxlKGZpbGUpLmFzTm9kZUJ1ZmZlcigpO1xuXG4gICAgICBpZiAodHlwZW9mIGRlc3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZGVzdChidWZmZXIsIGZpbGUpO1xuICAgICAgfSBlbHNlIGlmIChkZXN0KSB7XG4gICAgICAgIHZhciBkZXN0UGF0aDtcblxuICAgICAgICBjb25zdCBsYXN0RGVzdENoYXIgPSBkZXN0W2Rlc3QubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmIChfc2l6ZSA9PT0gMSAmJiBsYXN0RGVzdENoYXIgIT09ICcvJyAmJiBsYXN0RGVzdENoYXIgIT09ICdcXFxcJykge1xuICAgICAgICAgIGRlc3RQYXRoID0gZGVzdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZXN0UGF0aCA9IGpvaW4oZGVzdCwgZmlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBvdXRwdXRGaWxlU3luYyhkZXN0UGF0aCwgYnVmZmVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==
