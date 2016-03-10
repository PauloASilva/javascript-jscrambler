import 'babel-polyfill';

import glob from 'glob';
import path from 'path';
import request from 'axios';
import Q from 'q';

import config from './config';
import generateSignedParams from './generate-signed-params';
import JScramblerClient from './client';
import {
  addApplicationSource,
  createApplication,
  removeApplication,
  updateApplication,
  updateApplicationSource,
  removeSourceFromApplication,
  createTemplate,
  removeTemplate,
  updateTemplate,
  createApplicationProtection,
  removeProtection,
  duplicateApplication
} from './mutations';
import {
  getApplication,
  getApplicationProtections,
  getApplicationProtectionsCount,
  getApplications,
  getApplicationSource,
  getTemplates,
  getProtection
} from './queries';
import {
  zip,
  unzip
} from './zip';

export default {
  Client: JScramblerClient,
  config,
  generateSignedParams,
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
  async protectAndDownload (configPathOrObject, destCallback) {
    const config = typeof configPathOrObject === 'string' ?
      require(configPathOrObject) : configPathOrObject;

    const {
      applicationId,
      host,
      port,
      keys,
      filesDest,
      filesSrc,
      cwd,
      params
    } = config;

    const {
      accessKey,
      secretKey
    } = keys;

    const client = new this.Client({
      accessKey,
      secretKey,
      host,
      port
    });

    if (!applicationId) {
      throw new Error('Required *applicationId* not provided');
    }

    if (!filesDest && !destCallback) {
      throw new Error('Required *filesDest* not provided');
    }

    if (filesSrc && filesSrc.length) {
      let _filesSrc = [];
      for (let i = 0, l = filesSrc.length; i < l; ++i) {
        if (typeof filesSrc[i] === 'string') {
          // TODO Replace `glob.sync` with async version
          _filesSrc = _filesSrc.concat(glob.sync(filesSrc[i], {dot: true}));
        } else {
          _filesSrc.push(filesSrc[i]);
        }
      }

      const _zip = await zip(filesSrc, cwd);

      const removeSourceRes = await this.removeSourceFromApplication(client, '', applicationId);
      if (removeSourceRes.errors) {
        throw new Error('Error removing application sources');
      }

      const addApplicationSourceRes = await this.addApplicationSource(client, applicationId, {
        content: _zip.generate({type: 'base64'}),
        filename: 'application.zip',
        extension: 'zip'
      });
      if (addApplicationSourceRes.errors) {
        throw new Error('Error uploading files');
      }
    }

    if (params && Object.keys(params).length) {
      const updateApplicationRes = await this.updateApplication(client, {
        _id: applicationId,
        parameters: JSON.stringify(params)
      });
      if (updateApplicationRes.errors) {
        console.error(updateApplicationRes.errors);
        throw new Error('Error updating the application');
      }
    }

    const createApplicationProtectionRes = await this.createApplicationProtection(client, applicationId);
    if (createApplicationProtectionRes.errors) {
      console.error(createApplicationProtectionRes.errors);
      throw new Error('Error creating application protection');
    }

    const protectionId = createApplicationProtectionRes.data.createApplicationProtection._id;
    await this.pollProtection(client, applicationId, protectionId);

    const download = await this.downloadApplicationProtection(client, protectionId);
    unzip(download, filesDest || destCallback);
  },
  //
  async pollProtection (client, applicationId, protectionId) {
    const deferred = Q.defer();

    const poll = async () => {
      const applicationProtection = await this.getApplicationProtection(client, applicationId, protectionId);
      if (applicationProtection.errors) {
        throw new Error('Error polling protection');
        deferred.reject('Error polling protection');
      } else {
        const state = applicationProtection.data.applicationProtection.state;
        if (state !== 'finished' && state !== 'errored') {
          setTimeout(poll, 500);
        } else {
          deferred.resolve();
        }
      }
    };

    poll();

    return deferred.promise;
  },
  //
  async createApplication (client, data, fragments) {
    const deferred = Q.defer();
    client.post('/application', createApplication(data, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async duplicateApplication (client, data, fragments) {
    const deferred = Q.defer();
    client.post('/application', duplicateApplication(data, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async removeApplication (client, id) {
    const deferred = Q.defer();
    client.post('/application', removeApplication(id), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async removeProtection (client, id, appId, fragments) {
    const deferred = Q.defer();
    client.post('/application', removeProtection(id, appId, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async updateApplication (client, application, fragments) {
    const deferred = Q.defer();
    client.post('/application', updateApplication(application, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async getApplication (client, applicationId, fragments) {
    const deferred = Q.defer();
    client.get('/application', getApplication(applicationId, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async getApplicationSource (client, sourceId, fragments) {
    const deferred = Q.defer();
    client.get('/application', getApplicationSource(sourceId, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async getApplicationProtections (client, applicationId, params, fragments) {
    const deferred = Q.defer();
    client.get('/application', getApplicationProtections(applicationId, params, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async getApplicationProtectionsCount (client, applicationId, fragments) {
    const deferred = Q.defer();
    client.get('/application', getApplicationProtectionsCount(applicationId, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async createTemplate (client, template, fragments) {
    const deferred = Q.defer();
    client.post('/application', createTemplate(template, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async removeTemplate (client, id) {
    const deferred = Q.defer();
    client.post('/application', removeTemplate(id), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async getTemplates (client, fragments) {
    const deferred = Q.defer();
    client.get('/application', getTemplates(fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async getApplications (client, fragments) {
    const deferred = Q.defer();
    client.get('/application', getApplications(fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async addApplicationSource (client, applicationId, applicationSource, fragments) {
    const deferred = Q.defer();
    client.post('/application', addApplicationSource(applicationId, applicationSource, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async addApplicationSourceFromURL (client, applicationId, url, fragments) {
    const deferred = Q.defer();
    return getFileFromUrl(client, url)
      .then(function(file) {
        client.post('/application', addApplicationSource(applicationId, file, fragments), responseHandler(deferred));
        return deferred.promise;
      })
      .then(errorHandler);
  },
  //
  async updateApplicationSource (client, applicationSource, fragments) {
    const deferred = Q.defer();
    client.post('/application', updateApplicationSource(applicationSource, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async removeSourceFromApplication (client, sourceId, applicationId, fragments) {
    const deferred = Q.defer();
    client.post('/application', removeSourceFromApplication(sourceId, applicationId, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async updateTemplate (client, template, fragments) {
    const deferred = Q.defer();
    client.post('/application', updateTemplate(template, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async createApplicationProtection (client, applicationId, fragments) {
    const deferred = Q.defer();
    client.post('/application', createApplicationProtection(applicationId, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async getApplicationProtection (client, applicationId, protectionId, fragments) {
    const deferred = Q.defer();
    client.get('/application', getProtection(applicationId, protectionId, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  //
  async downloadApplicationProtection (client, protectionId) {
    const deferred = Q.defer();
    client.get(`/application/download/${protectionId}`, null, responseHandler(deferred), false);
    return deferred.promise.then(errorHandler);
  }
};

function getFileFromUrl (client, url) {
  const deferred = Q.defer();
  request.get(url).end(function (err, res) {
    var file;
    if (err) {
      deferred.reject(err);
    } else {
      file = {
        content: res.text,
        filename: path.basename(url),
        extension: path.extname(url).substr(1)
      };
      deferred.resolve(file);
    }
  });
  return deferred.promise;
}

function responseHandler (deferred) {
  return (err, res) => {
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

function errorHandler (res) {
  if (res.errors && res.errors.length) {
    res.errors.forEach(function (error) {
      console.error(error.message);
    });
  }

  return res;
}
