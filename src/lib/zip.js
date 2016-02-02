// TODO Replace `sync` functions with async versions

import size from 'lodash.size';
import temp from 'temp';
import JSZip from 'jszip';
import {readFileSync, statSync, outputFileSync} from 'fs-extra';
import {normalize, resolve, relative, join} from 'path';
import {defer} from 'q';
import {inspect} from 'util';

const debug = !!process.env.DEBUG;

export function zip (files, cwd) {
  debug && console.log('Zipping files', inspect(files));
  const deferred = defer();
  // Flag to detect if any file was added to the zip archive
  var hasFiles = false;
  // Sanitize `cwd`
  if (cwd) {
    cwd = normalize(cwd);
  }
  // If it's already a zip file
  if (files.length === 1 && /^.*\.zip$/.test(files[0])) {
    hasFiles = true;
    outputFileSync(temp.openSync({suffix: '.zip'}).path, readFileSync(files[0]));
  } else {
    const zip = new JSZip();
    for (let i = 0, l = files.length; i < l; ++i) {
      // Sanitise path
      if (typeof files[i] === 'string') {
        files[i] = normalize(files[i]);
        if (files[i].indexOf('../') === 0) {
          files[i] = resolve(files[i]);
        }
      }
      // Bypass unwanted patterns from `files`
      if (/.*\.(git|hg)(\/.*|$)/.test(files[i].path || files[i])) {
        continue;
      }
      let buffer, name;
      let sPath;
      if (cwd && files[i].indexOf && files[i].indexOf(cwd) !== 0) {
        sPath = join(cwd, files[i]);
      } else {
        sPath = files[i];
      }
      // If buffer
      if (files[i].contents) {
        name = relative(files[i].cwd, files[i].path);
        buffer = files[i].contents;
      }
      // Else if it's a path and not a directory
      else if (!statSync(sPath).isDirectory()) {
        if (cwd && files[i].indexOf && files[i].indexOf(cwd) === 0) {
          name = files[i].substring(cwd.length);
        } else {
          name = files[i];
        }
        buffer = readFileSync(sPath);
      }
      // Else if it's a directory path
      else {
        zip.folder(sPath);
      }
      if (name) {
        hasFiles = true;
        zip.file(name, buffer);
      }
    }
    if (hasFiles) {
      var tempFile = temp.openSync({suffix: '.zip'});
      outputFileSync(tempFile.path, zip.generate({type: 'nodebuffer'}), {encoding: 'base64'});
      files[0] = tempFile.path;
      files.length = 1;
      deferred.resolve(zip);
    } else {
      throw new Error('No source files found. If you intend to send a whole directory sufix your path with "**" (e.g. ./my-directory/**)');
    }
  }

  return deferred.promise;
}

export function unzip (zipFile, dest) {
  const zip = new JSZip(zipFile);
  const _size = size(zip.files);

  for (let file in zip.files) {
    if (!zip.files[file].options.dir) {
      const buffer = zip.file(file).asNodeBuffer();

      if (typeof dest === 'function') {
        dest(buffer, file);
      } else if (dest) {
        var destPath;

        const lastDestChar = dest[dest.length - 1];
        if (_size === 1 && lastDestChar !== '/' && lastDestChar !== '\\') {
          destPath = dest;
        } else {
          destPath = join(dest, file);
        }

        outputFileSync(destPath, buffer);
      }
    }
  }
}
