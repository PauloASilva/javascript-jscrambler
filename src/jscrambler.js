import path from 'path';
import request from 'superagent';
import Q from 'q';

import config from './config';
import JScramblerClient from './client';
import {
  addApplicationSource,
  createApplication,
  updateApplication,
  updateApplicationSource,
  removeSourceFromApplication,
  createTemplate,
  removeTemplate,
  updateTemplate
} from './mutations';
import {
  getApplication,
  getApplications,
  getApplicationSource,
  getTemplates
} from './queries';

export default
/** @lends jScramblerFacade */
{
  Client: JScramblerClient,
  config: config,
  createApplication (client, data, fragments) {
    const deferred = Q.defer();
    client.post('/', createApplication(data, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  updateApplication (client, application, fragments) {
    const deferred = Q.defer();
    client.post('/', updateApplication(application, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  getApplication (client, applicationId, fragments) {
    const deferred = Q.defer();
    client.get('/', getApplication(applicationId, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  getApplicationSource (client, sourceId, fragments) {
    const deferred = Q.defer();
    client.get('/', getApplicationSource(sourceId, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  createTemplate (client, template, fragments) {
    const deferred = Q.defer();
    client.post('/', createTemplate(template, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  removeTemplate (client, id) {
    const deferred = Q.defer();
    client.post('/', removeTemplate(id), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  getTemplates (client, fragments) {
    const deferred = Q.defer();
    client.get('/', getTemplates(fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  getApplications (client, fragments) {
    const deferred = Q.defer();
    client.get('/', getApplications(fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  addApplicationSource (client, applicationId, applicationSource, fragments) {
    const deferred = Q.defer();
    client.post('/', addApplicationSource(applicationId, applicationSource, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  addApplicationSourceFromURL (client, applicationId, url, fragments) {
    const deferred = Q.defer();
    return getFileFromUrl(client, url)
      .then(function(file) {
        client.post('/', addApplicationSource(applicationId, file, fragments), responseHandler(deferred));
        return deferred.promise;
      })
      .then(errorHandler);
  },
  updateApplicationSource (client, applicationSource, fragments) {
    const deferred = Q.defer();
    client.post('/', updateApplicationSource(applicationSource, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  removeSourceFromApplication (client, sourceId, applicationId, fragments) {
    const deferred = Q.defer();
    client.post('/', removeSourceFromApplication(sourceId, applicationId, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  },
  updateTemplate (client, template, fragments) {
    const deferred = Q.defer();
    client.post('/', updateTemplate(template, fragments), responseHandler(deferred));
    return deferred.promise.then(errorHandler);
  }
};

function getFileFromUrl (client, url) {
  const deferred = Q.defer();
  request.get(url).end(function (err, res) {
    var file;
    if(err) {
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
    const body = res.body;
    try {
      if (err) deferred.reject(err);
      else if (res.statusCode >= 400) {
        if (Buffer.isBuffer(body)) {
          deferred.reject(JSON.parse(body));
        } else {
          deferred.reject(body);
        }
      } else {
        if (Buffer.isBuffer(body)) {
          deferred.resolve(JSON.parse(body));
        } else {
          deferred.resolve(body);
        }
      }
    } catch (ex) {
      deferred.reject(body);
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
