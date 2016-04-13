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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvbXV0YXRpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0saUNBQWlDLHFDQUl0QyxDQUFDOztBQUVLLFNBQVMsaUJBQWlCLENBQUUsSUFBSSxFQUFpRDtNQUEvQyxTQUFTLHlEQUFHLGlDQUFpQzs7QUFDcEYsU0FBTztBQUNMLFNBQUssNkhBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUU7QUFDTixVQUFJLEVBQUosSUFBSTtLQUNMO0dBQ0YsQ0FBQztDQUNIOztBQUVELElBQU0sb0NBQW9DLGNBRXpDLENBQUM7O0FBRUssU0FBUyxvQkFBb0IsQ0FBRSxFQUFFLEVBQW9EO01BQWxELFNBQVMseURBQUcsb0NBQW9DOztBQUN4RixTQUFPO0FBQ0wsU0FBSyxzSEFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRTtBQUNOLFNBQUcsRUFBRSxFQUFFO0tBQ1I7R0FDRixDQUFDO0NBQ0g7O0FBRUQsSUFBTSxpQ0FBaUMsY0FFdEMsQ0FBQzs7QUFFSyxTQUFTLGlCQUFpQixDQUFFLEVBQUUsRUFBaUQ7TUFBL0MsU0FBUyx5REFBRyxpQ0FBaUM7O0FBQ2xGLFNBQU87QUFDTCxTQUFLLGdIQUdHLFNBQVMsK0JBR2hCO0FBQ0QsVUFBTSxFQUFFO0FBQ04sU0FBRyxFQUFFLEVBQUU7S0FDUjtHQUNGLENBQUM7Q0FDSDs7QUFFRCxJQUFNLGdDQUFnQyxjQUVyQyxDQUFDOztBQUVLLFNBQVMsZ0JBQWdCLENBQUUsRUFBRSxFQUFFLEtBQUssRUFBZ0Q7TUFBOUMsU0FBUyx5REFBRyxnQ0FBZ0M7O0FBQ3ZGLFNBQU87QUFDTCxTQUFLLHNLQUdHLFNBQVMsK0JBR2hCO0FBQ0QsVUFBTSxFQUFFO0FBQ04sU0FBRyxFQUFFLEVBQUU7QUFDUCxtQkFBYSxFQUFFLEtBQUs7S0FDckI7R0FDRixDQUFDO0NBQ0g7O0FBRUQsSUFBTSxpQ0FBaUMscUNBSXRDLENBQUM7O0FBRUssU0FBUyxpQkFB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ckMsQ0FBQzs7QUFFSyxTQUFTLDJCQUEyQixDQUFFLGFBQWEsRUFBZ0Q7TUFBOUMsU0FBUyx5REFBRyxnQ0FBZ0M7O0FBQ3RHLFNBQU87QUFDTCxTQUFLLGtLQUdHLFNBQVMsK0JBR2hCO0FBQ0QsVUFBTSxFQUFFO0FBQ04sbUJBQWEsRUFBRSxhQUFhO0tBQzdCO0dBQ0YsQ0FBQztDQUNIIiwiZmlsZSI6Im11dGF0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNyZWF0ZUFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBjcmVhdGVkQXQsXG4gIG5hbWVcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBcHBsaWNhdGlvbiAoZGF0YSwgZnJhZ21lbnRzID0gY3JlYXRlQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIGNyZWF0ZUFwcGxpY2F0aW9uICgkZGF0YTogQXBwbGljYXRpb25DcmVhdGUhKSB7XG4gICAgICAgIGNyZWF0ZUFwcGxpY2F0aW9uKGRhdGE6ICRkYXRhKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgZGF0YVxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgZHVwbGljYXRlQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWRcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBkdXBsaWNhdGVBcHBsaWNhdGlvbiAoaWQsIGZyYWdtZW50cyA9IGR1cGxpY2F0ZUFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBtdXRhdGlvbiBkdXBsaWNhdGVBcHBsaWNhdGlvbiAoJF9pZDogU3RyaW5nISkge1xuICAgICAgICBkdXBsaWNhdGVBcHBsaWNhdGlvbiAoX2lkOiAkX2lkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgX2lkOiBpZFxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgcmVtb3ZlQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWRcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVBcHBsaWNhdGlvbiAoaWQsIGZyYWdtZW50cyA9IHJlbW92ZUFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBtdXRhdGlvbiByZW1vdmVBcHBsaWNhdGlvbiAoJF9pZDogU3RyaW5nISkge1xuICAgICAgICByZW1vdmVBcHBsaWNhdGlvbiAoX2lkOiAkX2lkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgX2lkOiBpZFxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgcmVtb3ZlUHJvdGVjdGlvbkRlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZFxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVByb3RlY3Rpb24gKGlkLCBhcHBJZCwgZnJhZ21lbnRzID0gcmVtb3ZlUHJvdGVjdGlvbkRlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gcmVtb3ZlUHJvdGVjdGlvbiAoJF9pZDogU3RyaW5nISwgJGFwcGxpY2F0aW9uSWQ6IFN0cmluZyEpIHtcbiAgICAgICAgcmVtb3ZlUHJvdGVjdGlvbiAoX2lkOiAkX2lkLCBhcHBsaWNhdGlvbklkOiAkYXBwbGljYXRpb25JZCkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IHtcbiAgICAgIF9pZDogaWQsXG4gICAgICBhcHBsaWNhdGlvbklkOiBhcHBJZFxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgdXBkYXRlQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIGNyZWF0ZWRBdCxcbiAgbmFtZVxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUFwcGxpY2F0aW9uIChhcHBsaWNhdGlvbiwgZnJhZ21lbnRzID0gdXBkYXRlQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzKSB7XG4gIGNvbnN0IGFwcGxpY2F0aW9uSWQgPSBhcHBsaWNhdGlvbi5faWQ7XG4gIGRlbGV0ZSBhcHBsaWNhdGlvbi5faWQ7XG5cbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gdXBkYXRlQXBwbGljYXRpb24gKCRhcHBsaWNhdGlvbklkOiBTdHJpbmchLCAkZGF0YTogQXBwbGljYXRpb25VcGRhdGUhKSB7XG4gICAgICAgIHVwZGF0ZUFwcGxpY2F0aW9uIChfaWQ6ICRhcHBsaWNhdGlvbklkLCBkYXRhOiAkZGF0YSkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IHtcbiAgICAgIGFwcGxpY2F0aW9uSWQsXG4gICAgICBkYXRhOiBhcHBsaWNhdGlvblxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgdW5sb2NrQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIGNyZWF0ZWRBdCxcbiAgbmFtZVxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIHVubG9ja0FwcGxpY2F0aW9uIChhcHBsaWNhdGlvbiwgZnJhZ21lbnRzID0gdW5sb2NrQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIHVubG9ja0FwcGxpY2F0aW9uICgkYXBwbGljYXRpb25JZDogU3RyaW5nISkge1xuICAgICAgICB1bmxvY2tBcHBsaWNhdGlvbiAoX2lkOiAkYXBwbGljYXRpb25JZCkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IHtcbiAgICAgIGFwcGxpY2F0aW9uSWQ6IGFwcGxpY2F0aW9uLl9pZFxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgYWRkQXBwbGljYXRpb25Tb3VyY2VEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIGZpbGVuYW1lLFxuICBleHRlbnNpb25cbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRBcHBsaWNhdGlvblNvdXJjZSAoYXBwbGljYXRpb25JZCwgZGF0YSwgZnJhZ21lbnRzID0gYWRkQXBwbGljYXRpb25Tb3VyY2VEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIGFkZFNvdXJjZVRvQXBwbGljYXRpb24gKCRhcHBsaWNhdGlvbklkOiBTdHJpbmchLCAkZGF0YTogQXBwbGljYXRpb25Tb3VyY2VDcmVhdGUhKSB7XG4gICAgICAgIGFkZFNvdXJjZVRvQXBwbGljYXRpb24oYXBwbGljYXRpb25JZDogJGFwcGxpY2F0aW9uSWQsIGRhdGE6ICRkYXRhKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgYXBwbGljYXRpb25JZCxcbiAgICAgIGRhdGFcbiAgICB9XG4gIH07XG59XG5cbmNvbnN0IHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBmaWxlbmFtZSxcbiAgZXh0ZW5zaW9uXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQXBwbGljYXRpb25Tb3VyY2UgKGFwcGxpY2F0aW9uU291cmNlLCBmcmFnbWVudHMgPSB1cGRhdGVBcHBsaWNhdGlvblNvdXJjZURlZmF1bHRGcmFnbWVudHMpIHtcbiAgY29uc3Qgc291cmNlSWQgPSBhcHBsaWNhdGlvblNvdXJjZS5faWQ7XG4gIGRlbGV0ZSBhcHBsaWNhdGlvblNvdXJjZS5faWQ7XG5cbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gdXBkYXRlQXBwbGljYXRpb25Tb3VyY2UgKCRzb3VyY2VJZDogU3RyaW5nISwgJGRhdGE6IEFwcGxpY2F0aW9uU291cmNlVXBkYXRlISkge1xuICAgICAgICB1cGRhdGVBcHBsaWNhdGlvblNvdXJjZShfaWQ6ICRzb3VyY2VJZCwgZGF0YTogJGRhdGEpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICBzb3VyY2VJZDogc291cmNlSWQsXG4gICAgICBkYXRhOiBhcHBsaWNhdGlvblNvdXJjZVxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgcmVtb3ZlU291cmNlRnJvbUFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBzb3VyY2VzIHtcbiAgICBmaWxlbmFtZVxuICB9XG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlU291cmNlRnJvbUFwcGxpY2F0aW9uIChmaWxlbmFtZSwgYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzID0gcmVtb3ZlU291cmNlRnJvbUFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBtdXRhdGlvbiByZW1vdmVTb3VyY2UgKCRmaWxlbmFtZTogU3RyaW5nISwgJGFwcGxpY2F0aW9uSWQ6IFN0cmluZyEpIHtcbiAgICAgICAgcmVtb3ZlU291cmNlIChmaWxlbmFtZTogJGZpbGVuYW1lLCBhcHBsaWNhdGlvbklkOiAkYXBwbGljYXRpb25JZCkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IHtcbiAgICAgIGZpbGVuYW1lLFxuICAgICAgYXBwbGljYXRpb25JZFxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgY3JlYXRlVGVtcGxhdGVEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIG5hbWUsXG4gIGRlc2NyaXB0aW9uLFxuICBwYXJhbWV0ZXJzXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGUgKHRlbXBsYXRlLCBmcmFnbWVudHMgPSBjcmVhdGVUZW1wbGF0ZURlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gY3JlYXRlVGVtcGxhdGUgKCRkYXRhOiBUZW1wbGF0ZUlucHV0ISkge1xuICAgICAgICBjcmVhdGVUZW1wbGF0ZSAoZGF0YTogJGRhdGEpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICBkYXRhOiB0ZW1wbGF0ZVxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgcmVtb3ZlVGVtcGxhdGVEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWRcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVUZW1wbGF0ZSAoaWQsIGZyYWdtZW50cyA9IHJlbW92ZVRlbXBsYXRlRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBtdXRhdGlvbiByZW1vdmVUZW1wbGF0ZSAoJF9pZDogU3RyaW5nISkge1xuICAgICAgICByZW1vdmVUZW1wbGF0ZSAoX2lkOiAkX2lkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgX2lkOiBpZFxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgdXBkYXRlVGVtcGxhdGVEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIHBhcmFtZXRlcnNcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVUZW1wbGF0ZSAodGVtcGxhdGUsIGZyYWdtZW50cyA9IHVwZGF0ZVRlbXBsYXRlRGVmYXVsdEZyYWdtZW50cykge1xuICBjb25zdCB0ZW1wbGF0ZUlkID0gdGVtcGxhdGUuX2lkO1xuICBkZWxldGUgdGVtcGxhdGUuX2lkO1xuXG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIHVwZGF0ZVRlbXBsYXRlICgkdGVtcGxhdGVJZDogSUQhLCAkZGF0YTogVGVtcGxhdGVJbnB1dCEpIHtcbiAgICAgICAgdXBkYXRlVGVtcGxhdGUgKF9pZDogJHRlbXBsYXRlSWQsIGRhdGE6ICRkYXRhKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgdGVtcGxhdGVJZCxcbiAgICAgIGRhdGE6IHRlbXBsYXRlXG4gICAgfVxuICB9O1xufVxuXG5jb25zdCBjcmVhdGVQcm90ZWN0aW9uRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBzdGF0ZVxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvbiAoYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzID0gY3JlYXRlUHJvdGVjdGlvbkRlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uICgkYXBwbGljYXRpb25JZDogU3RyaW5nISkge1xuICAgICAgICBjcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb24gKGFwcGxpY2F0aW9uSWQ6ICRhcHBsaWNhdGlvbklkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgYXBwbGljYXRpb25JZDogYXBwbGljYXRpb25JZFxuICAgIH1cbiAgfTtcbn1cbiJdfQ==
