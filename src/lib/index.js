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
  duplicateApplication,
  unlockApplication,
  applyTemplate
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
      params,
      applicationTypes,
      languageSpecifications
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
        // TODO Implement error codes or fix this is on the services
        var hadNoSources = false;
        removeSourceRes.errors.forEach(function (error) {
          if (error.message === 'Application Source with the given ID does not exist') {
            hadNoSources = true;
          }
        });
        if (!hadNoSources) {
          throw new Error(removeSourceRes.errors[0].message);
        }
      }

      const addApplicationSourceRes = await this.addApplicationSource(client, applicationId, {
        content: _zip.generate({type: 'base64'}),
        filename: 'application.zip',
        extension: 'zip'
      });
      errorHandler(addApplicationSourceRes);
    }

    const $set = {
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

    if ($set.parameters || $set.applicationTypes || $set.languageSpecifications ||
        typeof $set.areSubscribersOrdered !== 'undefined') {
      const updateApplicationRes = await this.updateApplication(client, $set);
      errorHandler(updateApplicationRes);
    }

    const createApplicationProtectionRes = await this.createApplicationProtection(client, applicationId);
    errorHandler(createApplicationProtectionRes);

    const protectionId = createApplicationProtectionRes.data.createApplicationProtection._id;
    await this.pollProtection(client, applicationId, protectionId);

    const download = await this.downloadApplicationProtection(client, protectionId);
    errorHandler(download);
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
        } else if (state === 'errored') {
          const url = `https://app.jscrambler.com/app/${applicationId}/protections/${protectionId}`;
          deferred.reject(`Protection failed. For more information visit: ${url}`);
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
    return deferred.promise;
  },
  //
  async duplicateApplication (client, data, fragments) {
    const deferred = Q.defer();
    client.post('/application', duplicateApplication(data, fragments), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async removeApplication (client, id) {
    const deferred = Q.defer();
    client.post('/application', removeApplication(id), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async removeProtection (client, id, appId, fragments) {
    const deferred = Q.defer();
    client.post('/application', removeProtection(id, appId, fragments), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async updateApplication (client, application, fragments) {
    const deferred = Q.defer();
    client.post('/application', updateApplication(application, fragments), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async unlockApplication (client, application, fragments) {
    const deferred = Q.defer();
    client.post('/application', unlockApplication(application, fragments), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async getApplication (client, applicationId, fragments) {
    const deferred = Q.defer();
    client.get('/application', getApplication(applicationId, fragments), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async getApplicationSource (client, sourceId, fragments, limits) {
    const deferred = Q.defer();
    client.get('/application', getApplicationSource(sourceId, fragments, limits), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async getApplicationProtections (client, applicationId, params, fragments) {
    const deferred = Q.defer();
    client.get('/application', getApplicationProtections(applicationId, params, fragments), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async getApplicationProtectionsCount (client, applicationId, fragments) {
    const deferred = Q.defer();
    client.get('/application', getApplicationProtectionsCount(applicationId, fragments), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async createTemplate (client, template, fragments) {
    const deferred = Q.defer();
    client.post('/application', createTemplate(template, fragments), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async removeTemplate (client, id) {
    const deferred = Q.defer();
    client.post('/application', removeTemplate(id), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async getTemplates (client, fragments) {
    const deferred = Q.defer();
    client.get('/application', getTemplates(fragments), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async getApplications (client, fragments) {
    const deferred = Q.defer();
    client.get('/application', getApplications(fragments), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async addApplicationSource (client, applicationId, applicationSource, fragments) {
    const deferred = Q.defer();
    client.post('/application', addApplicationSource(applicationId, applicationSource, fragments), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async addApplicationSourceFromURL (client, applicationId, url, fragments) {
    const deferred = Q.defer();
    return getFileFromUrl(client, url)
      .then(function(file) {
        client.post('/application', addApplicationSource(applicationId, file, fragments), responseHandler(deferred));
        return deferred.promise;
      });
  },
  //
  async updateApplicationSource (client, applicationSource, fragments) {
    const deferred = Q.defer();
    client.post('/application', updateApplicationSource(applicationSource, fragments), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async removeSourceFromApplication (client, sourceId, applicationId, fragments) {
    const deferred = Q.defer();
    client.post('/application', removeSourceFromApplication(sourceId, applicationId, fragments), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async applyTemplate (client, templateId, appId, fragments) {
    const deferred = Q.defer();
    client.post('/application', applyTemplate(templateId, appId, fragments), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async updateTemplate (client, template, fragments) {
    const deferred = Q.defer();
    client.post('/application', updateTemplate(template, fragments), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async createApplicationProtection (client, applicationId, fragments) {
    const deferred = Q.defer();
    client.post('/application', createApplicationProtection(applicationId, fragments), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async getApplicationProtection (client, applicationId, protectionId, fragments) {
    const deferred = Q.defer();
    client.get('/application', getProtection(applicationId, protectionId, fragments), responseHandler(deferred));
    return deferred.promise;
  },
  //
  async downloadApplicationProtection (client, protectionId) {
    const deferred = Q.defer();
    client.get(`/application/download/${protectionId}`, null, responseHandler(deferred), false);
    return deferred.promise;
  }
};

function getFileFromUrl (client, url) {
  const deferred = Q.defer();
  var file;
  request.get(url)
    .then((res) => {
      file = {
        content: res.data,
        filename: path.basename(url),
        extension: path.extname(url).substr(1)
      };
      deferred.resolve(file);
    })
    .catch((err) => {
      deferred.reject(err);
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
      throw new Error(error.message);
    });
  }

  return res;
}

function normalizeParameters (parameters) {
  var result;

  if (!Array.isArray(parameters)) {
    result = [];
    Object.keys(parameters).forEach((name) => {
      result.push({
        name,
        options: parameters[name]
      })
    });
  } else {
    result = parameters;
  }

  return result;
}
