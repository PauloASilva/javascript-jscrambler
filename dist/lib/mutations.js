"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApplication = createApplication;
exports.duplicateApplication = duplicateApplication;
exports.removeApplication = removeApplication;
exports.removeProtection = removeProtection;
exports.updateApplication = updateApplication;
exports.unlockApplication = unlockApplication;
exports.addApplicationSource = addApplicationSource;
exports.updateApplicationSource = updateApplicationSource;
exports.removeSourceFromApplication = removeSourceFromApplication;
exports.createTemplate = createTemplate;
exports.removeTemplate = removeTemplate;
exports.updateTemplate = updateTemplate;
exports.createApplicationProtection = createApplicationProtection;
exports.applyTemplate = applyTemplate;
var createApplicationDefaultFragments = "\n  _id,\n  createdAt,\n  name\n";

function createApplication(data) {
  var fragments = arguments.length <= 1 || arguments[1] === undefined ? createApplicationDefaultFragments : arguments[1];

  return {
    query: "\n      mutation createApplication ($data: ApplicationCreate!) {\n        createApplication(data: $data) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      data: data
    }
  };
}

var duplicateApplicationDefaultFragments = "\n  _id\n";

function duplicateApplication(id) {
  var fragments = arguments.length <= 1 || arguments[1] === undefined ? duplicateApplicationDefaultFragments : arguments[1];

  return {
    query: "\n      mutation duplicateApplication ($_id: String!) {\n        duplicateApplication (_id: $_id) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      _id: id
    }
  };
}

var removeApplicationDefaultFragments = "\n  _id\n";

function removeApplication(id) {
  var fragments = arguments.length <= 1 || arguments[1] === undefined ? removeApplicationDefaultFragments : arguments[1];

  return {
    query: "\n      mutation removeApplication ($_id: String!) {\n        removeApplication (_id: $_id) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      _id: id
    }
  };
}

var removeProtectionDefaultFragments = "\n  _id\n";

function removeProtection(id, appId) {
  var fragments = arguments.length <= 2 || arguments[2] === undefined ? removeProtectionDefaultFragments : arguments[2];

  return {
    query: "\n      mutation removeProtection ($_id: String!, $applicationId: String!) {\n        removeProtection (_id: $_id, applicationId: $applicationId) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      _id: id,
      applicationId: appId
    }
  };
}

var updateApplicationDefaultFragments = "\n  _id,\n  createdAt,\n  name\n";

function updateApplication(application) {
  var fragments = arguments.length <= 1 || arguments[1] === undefined ? updateApplicationDefaultFragments : arguments[1];

  var applicationId = application._id;
  delete application._id;

  return {
    query: "\n      mutation updateApplication ($applicationId: String!, $data: ApplicationUpdate!) {\n        updateApplication (_id: $applicationId, data: $data) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      applicationId: applicationId,
      data: application
    }
  };
}

var unlockApplicationDefaultFragments = "\n  _id,\n  createdAt,\n  name\n";

function unlockApplication(application) {
  var fragments = arguments.length <= 1 || arguments[1] === undefined ? unlockApplicationDefaultFragments : arguments[1];

  return {
    query: "\n      mutation unlockApplication ($applicationId: String!) {\n        unlockApplication (_id: $applicationId) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      applicationId: application._id
    }
  };
}

var addApplicationSourceDefaultFragments = "\n  _id,\n  filename,\n  extension\n";

function addApplicationSource(applicationId, data) {
  var fragments = arguments.length <= 2 || arguments[2] === undefined ? addApplicationSourceDefaultFragments : arguments[2];

  return {
    query: "\n      mutation addSourceToApplication ($applicationId: String!, $data: ApplicationSourceCreate!) {\n        addSourceToApplication(applicationId: $applicationId, data: $data) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      applicationId: applicationId,
      data: data
    }
  };
}

var updateApplicationSourceDefaultFragments = "\n  _id,\n  filename,\n  extension\n";

function updateApplicationSource(applicationSource) {
  var fragments = arguments.length <= 1 || arguments[1] === undefined ? updateApplicationSourceDefaultFragments : arguments[1];

  var sourceId = applicationSource._id;
  delete applicationSource._id;

  return {
    query: "\n      mutation updateApplicationSource ($sourceId: String!, $data: ApplicationSourceUpdate!) {\n        updateApplicationSource(_id: $sourceId, data: $data) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      sourceId: sourceId,
      data: applicationSource
    }
  };
}

var removeSourceFromApplicationDefaultFragments = "\n  _id,\n  sources {\n    filename\n  }\n";

function removeSourceFromApplication(filename, applicationId) {
  var fragments = arguments.length <= 2 || arguments[2] === undefined ? removeSourceFromApplicationDefaultFragments : arguments[2];

  return {
    query: "\n      mutation removeSource ($filename: String!, $applicationId: String!) {\n        removeSource (filename: $filename, applicationId: $applicationId) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      filename: filename,
      applicationId: applicationId
    }
  };
}

var createTemplateDefaultFragments = "\n  _id,\n  name,\n  description,\n  parameters\n";

function createTemplate(template) {
  var fragments = arguments.length <= 1 || arguments[1] === undefined ? createTemplateDefaultFragments : arguments[1];

  return {
    query: "\n      mutation createTemplate ($data: TemplateInput!) {\n        createTemplate (data: $data) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      data: template
    }
  };
}

var removeTemplateDefaultFragments = "\n  _id\n";

function removeTemplate(id) {
  var fragments = arguments.length <= 1 || arguments[1] === undefined ? removeTemplateDefaultFragments : arguments[1];

  return {
    query: "\n      mutation removeTemplate ($_id: String!) {\n        removeTemplate (_id: $_id) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      _id: id
    }
  };
}

var updateTemplateDefaultFragments = "\n  _id,\n  parameters\n";

function updateTemplate(template) {
  var fragments = arguments.length <= 1 || arguments[1] === undefined ? updateTemplateDefaultFragments : arguments[1];

  var templateId = template._id;
  delete template._id;

  return {
    query: "\n      mutation updateTemplate ($templateId: ID!, $data: TemplateInput!) {\n        updateTemplate (_id: $templateId, data: $data) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      templateId: templateId,
      data: template
    }
  };
}

var createProtectionDefaultFragments = "\n  _id,\n  state\n";

function createApplicationProtection(applicationId) {
  var fragments = arguments.length <= 1 || arguments[1] === undefined ? createProtectionDefaultFragments : arguments[1];

  return {
    query: "\n      mutation createApplicationProtection ($applicationId: String!) {\n        createApplicationProtection (applicationId: $applicationId) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      applicationId: applicationId
    }
  };
}

var applyTemplateDefaultFragments = "\n  _id,\n  parameters\n";

function applyTemplate(templateId, appId) {
  var fragments = arguments.length <= 2 || arguments[2] === undefined ? applyTemplateDefaultFragments : arguments[2];

  return {
    query: "\n      mutation applyTemplate ($templateId: String!, $appId: String!) {\n        applyTemplate (templateId: $templateId, appId: $appId) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      templateId: templateId,
      appId: appId
    }
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbXV0YXRpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O1FBTWdCLGlCLEdBQUEsaUI7UUFtQkEsb0IsR0FBQSxvQjtRQW1CQSxpQixHQUFBLGlCO1FBbUJBLGdCLEdBQUEsZ0I7UUFzQkEsaUIsR0FBQSxpQjtRQXlCQSxpQixHQUFBLGlCO1FBcUJBLG9CLEdBQUEsb0I7UUFzQkEsdUIsR0FBQSx1QjtRQTBCQSwyQixHQUFBLDJCO1FBdUJBLGMsR0FBQSxjO1FBbUJBLGMsR0FBQSxjO1FBb0JBLGMsR0FBQSxjO1FBd0JBLDJCLEdBQUEsMkI7UUFvQkEsYSxHQUFBLGE7QUE3UmhCLElBQU0sc0VBQU47O0FBTU8sU0FBUyxpQkFBVCxDQUE0QixJQUE1QixFQUFpRjtBQUFBLE1BQS9DLFNBQStDLHlEQUFuQyxpQ0FBbUM7O0FBQ3RGLFNBQU87QUFDTCxzSUFHUSxTQUhSLCtCQURLO0FBUUwsWUFBUTtBQUNOO0FBRE07QUFSSCxHQUFQO0FBWUQ7O0FBRUQsSUFBTSxrREFBTjs7QUFJTyxTQUFTLG9CQUFULENBQStCLEVBQS9CLEVBQXFGO0FBQUEsTUFBbEQsU0FBa0QseURBQXRDLG9DQUFzQzs7QUFDMUYsU0FBTztBQUNMLCtIQUdRLFNBSFIsK0JBREs7QUFRTCxZQUFRO0FBQ04sV0FBSztBQURDO0FBUkgsR0FBUDtBQVlEOztBQUVELElBQU0sK0NBQU47O0FBSU8sU0FBUyxpQkFBVCxDQUE0QixFQUE1QixFQUErRTtBQUFBLE1BQS9DLFNBQStDLHlEQUFuQyxpQ0FBbUM7O0FBQ3BGLFNBQU87QUFDTCx5SEFHUSxTQUhSLCtCQURLO0FBUUwsWUFBUTtBQUNOLFdBQUs7QUFEQztBQVJILEdBQVA7QUFZRDs7QUFFRCxJQUFNLDhDQUFOOztBQUlPLFNBQVMsZ0JBQVQsQ0FBMkIsRUFBM0IsRUFBK0IsS0FBL0IsRUFBb0Y7QUFBQSxNQUE5QyxTQUE4Qyx5REFBbEMsZ0NBQWtDOztBQUN6RixTQUFPO0FBQ0wsK0tBR1EsU0FI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OztBQUMzRixTQUFPO0FBQ0wsc0tBR1EsU0FIUiwrQkFESztBQVFMLFlBQVE7QUFDTiw0QkFETTtBQUVOO0FBRk07QUFSSCxHQUFQO0FBYUQiLCJmaWxlIjoibXV0YXRpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgY3JlYXRlQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIGNyZWF0ZWRBdCxcbiAgbmFtZVxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFwcGxpY2F0aW9uIChkYXRhLCBmcmFnbWVudHMgPSBjcmVhdGVBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gY3JlYXRlQXBwbGljYXRpb24gKCRkYXRhOiBBcHBsaWNhdGlvbkNyZWF0ZSEpIHtcbiAgICAgICAgY3JlYXRlQXBwbGljYXRpb24oZGF0YTogJGRhdGEpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICBkYXRhXG4gICAgfVxuICB9O1xufVxuXG5jb25zdCBkdXBsaWNhdGVBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZFxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIGR1cGxpY2F0ZUFwcGxpY2F0aW9uIChpZCwgZnJhZ21lbnRzID0gZHVwbGljYXRlQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIGR1cGxpY2F0ZUFwcGxpY2F0aW9uICgkX2lkOiBTdHJpbmchKSB7XG4gICAgICAgIGR1cGxpY2F0ZUFwcGxpY2F0aW9uIChfaWQ6ICRfaWQpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICBfaWQ6IGlkXG4gICAgfVxuICB9O1xufVxuXG5jb25zdCByZW1vdmVBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZFxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUFwcGxpY2F0aW9uIChpZCwgZnJhZ21lbnRzID0gcmVtb3ZlQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIHJlbW92ZUFwcGxpY2F0aW9uICgkX2lkOiBTdHJpbmchKSB7XG4gICAgICAgIHJlbW92ZUFwcGxpY2F0aW9uIChfaWQ6ICRfaWQpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICBfaWQ6IGlkXG4gICAgfVxuICB9O1xufVxuXG5jb25zdCByZW1vdmVQcm90ZWN0aW9uRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlUHJvdGVjdGlvbiAoaWQsIGFwcElkLCBmcmFnbWVudHMgPSByZW1vdmVQcm90ZWN0aW9uRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBtdXRhdGlvbiByZW1vdmVQcm90ZWN0aW9uICgkX2lkOiBTdHJpbmchLCAkYXBwbGljYXRpb25JZDogU3RyaW5nISkge1xuICAgICAgICByZW1vdmVQcm90ZWN0aW9uIChfaWQ6ICRfaWQsIGFwcGxpY2F0aW9uSWQ6ICRhcHBsaWNhdGlvbklkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgX2lkOiBpZCxcbiAgICAgIGFwcGxpY2F0aW9uSWQ6IGFwcElkXG4gICAgfVxuICB9O1xufVxuXG5jb25zdCB1cGRhdGVBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgY3JlYXRlZEF0LFxuICBuYW1lXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQXBwbGljYXRpb24gKGFwcGxpY2F0aW9uLCBmcmFnbWVudHMgPSB1cGRhdGVBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMpIHtcbiAgY29uc3QgYXBwbGljYXRpb25JZCA9IGFwcGxpY2F0aW9uLl9pZDtcbiAgZGVsZXRlIGFwcGxpY2F0aW9uLl9pZDtcblxuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBtdXRhdGlvbiB1cGRhdGVBcHBsaWNhdGlvbiAoJGFwcGxpY2F0aW9uSWQ6IFN0cmluZyEsICRkYXRhOiBBcHBsaWNhdGlvblVwZGF0ZSEpIHtcbiAgICAgICAgdXBkYXRlQXBwbGljYXRpb24gKF9pZDogJGFwcGxpY2F0aW9uSWQsIGRhdGE6ICRkYXRhKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgYXBwbGljYXRpb25JZCxcbiAgICAgIGRhdGE6IGFwcGxpY2F0aW9uXG4gICAgfVxuICB9O1xufVxuXG5jb25zdCB1bmxvY2tBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgY3JlYXRlZEF0LFxuICBuYW1lXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gdW5sb2NrQXBwbGljYXRpb24gKGFwcGxpY2F0aW9uLCBmcmFnbWVudHMgPSB1bmxvY2tBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gdW5sb2NrQXBwbGljYXRpb24gKCRhcHBsaWNhdGlvbklkOiBTdHJpbmchKSB7XG4gICAgICAgIHVubG9ja0FwcGxpY2F0aW9uIChfaWQ6ICRhcHBsaWNhdGlvbklkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgYXBwbGljYXRpb25JZDogYXBwbGljYXRpb24uX2lkXG4gICAgfVxuICB9O1xufVxuXG5jb25zdCBhZGRBcHBsaWNhdGlvblNvdXJjZURlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgZmlsZW5hbWUsXG4gIGV4dGVuc2lvblxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFwcGxpY2F0aW9uU291cmNlIChhcHBsaWNhdGlvbklkLCBkYXRhLCBmcmFnbWVudHMgPSBhZGRBcHBsaWNhdGlvblNvdXJjZURlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gYWRkU291cmNlVG9BcHBsaWNhdGlvbiAoJGFwcGxpY2F0aW9uSWQ6IFN0cmluZyEsICRkYXRhOiBBcHBsaWNhdGlvblNvdXJjZUNyZWF0ZSEpIHtcbiAgICAgICAgYWRkU291cmNlVG9BcHBsaWNhdGlvbihhcHBsaWNhdGlvbklkOiAkYXBwbGljYXRpb25JZCwgZGF0YTogJGRhdGEpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICBhcHBsaWNhdGlvbklkLFxuICAgICAgZGF0YVxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgdXBkYXRlQXBwbGljYXRpb25Tb3VyY2VEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIGZpbGVuYW1lLFxuICBleHRlbnNpb25cbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBcHBsaWNhdGlvblNvdXJjZSAoYXBwbGljYXRpb25Tb3VyY2UsIGZyYWdtZW50cyA9IHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlRGVmYXVsdEZyYWdtZW50cykge1xuICBjb25zdCBzb3VyY2VJZCA9IGFwcGxpY2F0aW9uU291cmNlLl9pZDtcbiAgZGVsZXRlIGFwcGxpY2F0aW9uU291cmNlLl9pZDtcblxuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBtdXRhdGlvbiB1cGRhdGVBcHBsaWNhdGlvblNvdXJjZSAoJHNvdXJjZUlkOiBTdHJpbmchLCAkZGF0YTogQXBwbGljYXRpb25Tb3VyY2VVcGRhdGUhKSB7XG4gICAgICAgIHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlKF9pZDogJHNvdXJjZUlkLCBkYXRhOiAkZGF0YSkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IHtcbiAgICAgIHNvdXJjZUlkOiBzb3VyY2VJZCxcbiAgICAgIGRhdGE6IGFwcGxpY2F0aW9uU291cmNlXG4gICAgfVxuICB9O1xufVxuXG5jb25zdCByZW1vdmVTb3VyY2VGcm9tQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIHNvdXJjZXMge1xuICAgIGZpbGVuYW1lXG4gIH1cbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTb3VyY2VGcm9tQXBwbGljYXRpb24gKGZpbGVuYW1lLCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMgPSByZW1vdmVTb3VyY2VGcm9tQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIHJlbW92ZVNvdXJjZSAoJGZpbGVuYW1lOiBTdHJpbmchLCAkYXBwbGljYXRpb25JZDogU3RyaW5nISkge1xuICAgICAgICByZW1vdmVTb3VyY2UgKGZpbGVuYW1lOiAkZmlsZW5hbWUsIGFwcGxpY2F0aW9uSWQ6ICRhcHBsaWNhdGlvbklkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgZmlsZW5hbWUsXG4gICAgICBhcHBsaWNhdGlvbklkXG4gICAgfVxuICB9O1xufVxuXG5jb25zdCBjcmVhdGVUZW1wbGF0ZURlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgbmFtZSxcbiAgZGVzY3JpcHRpb24sXG4gIHBhcmFtZXRlcnNcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUZW1wbGF0ZSAodGVtcGxhdGUsIGZyYWdtZW50cyA9IGNyZWF0ZVRlbXBsYXRlRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBtdXRhdGlvbiBjcmVhdGVUZW1wbGF0ZSAoJGRhdGE6IFRlbXBsYXRlSW5wdXQhKSB7XG4gICAgICAgIGNyZWF0ZVRlbXBsYXRlIChkYXRhOiAkZGF0YSkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IHtcbiAgICAgIGRhdGE6IHRlbXBsYXRlXG4gICAgfVxuICB9O1xufVxuXG5jb25zdCByZW1vdmVUZW1wbGF0ZURlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZFxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVRlbXBsYXRlIChpZCwgZnJhZ21lbnRzID0gcmVtb3ZlVGVtcGxhdGVEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIHJlbW92ZVRlbXBsYXRlICgkX2lkOiBTdHJpbmchKSB7XG4gICAgICAgIHJlbW92ZVRlbXBsYXRlIChfaWQ6ICRfaWQpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICBfaWQ6IGlkXG4gICAgfVxuICB9O1xufVxuXG5jb25zdCB1cGRhdGVUZW1wbGF0ZURlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgcGFyYW1ldGVyc1xuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRlbXBsYXRlICh0ZW1wbGF0ZSwgZnJhZ21lbnRzID0gdXBkYXRlVGVtcGxhdGVEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIGNvbnN0IHRlbXBsYXRlSWQgPSB0ZW1wbGF0ZS5faWQ7XG4gIGRlbGV0ZSB0ZW1wbGF0ZS5faWQ7XG5cbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gdXBkYXRlVGVtcGxhdGUgKCR0ZW1wbGF0ZUlkOiBJRCEsICRkYXRhOiBUZW1wbGF0ZUlucHV0ISkge1xuICAgICAgICB1cGRhdGVUZW1wbGF0ZSAoX2lkOiAkdGVtcGxhdGVJZCwgZGF0YTogJGRhdGEpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICB0ZW1wbGF0ZUlkLFxuICAgICAgZGF0YTogdGVtcGxhdGVcbiAgICB9XG4gIH07XG59XG5cbmNvbnN0IGNyZWF0ZVByb3RlY3Rpb25EZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIHN0YXRlXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uIChhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMgPSBjcmVhdGVQcm90ZWN0aW9uRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBtdXRhdGlvbiBjcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb24gKCRhcHBsaWNhdGlvbklkOiBTdHJpbmchKSB7XG4gICAgICAgIGNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvbiAoYXBwbGljYXRpb25JZDogJGFwcGxpY2F0aW9uSWQpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICBhcHBsaWNhdGlvbklkOiBhcHBsaWNhdGlvbklkXG4gICAgfVxuICB9O1xufVxuXG5jb25zdCBhcHBseVRlbXBsYXRlRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBwYXJhbWV0ZXJzXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlUZW1wbGF0ZSAodGVtcGxhdGVJZCwgYXBwSWQsIGZyYWdtZW50cyA9IGFwcGx5VGVtcGxhdGVEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIGFwcGx5VGVtcGxhdGUgKCR0ZW1wbGF0ZUlkOiBTdHJpbmchLCAkYXBwSWQ6IFN0cmluZyEpIHtcbiAgICAgICAgYXBwbHlUZW1wbGF0ZSAodGVtcGxhdGVJZDogJHRlbXBsYXRlSWQsIGFwcElkOiAkYXBwSWQpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICB0ZW1wbGF0ZUlkLFxuICAgICAgYXBwSWRcbiAgICB9XG4gIH07XG59XG4iXX0=
