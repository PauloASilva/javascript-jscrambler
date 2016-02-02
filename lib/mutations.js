"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApplication = createApplication;
exports.duplicateApplication = duplicateApplication;
exports.removeApplication = removeApplication;
exports.removeProtection = removeProtection;
exports.updateApplication = updateApplication;
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
    query: "\n      mutation createApplication ($data: ApplicationInput!) {\n        createApplication(data: $data) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      data: data
    }
  };
}

var duplicateApplicationDefaultFragments = "\n  _id\n";

function duplicateApplication(id) {
  var fragments = arguments.length <= 1 || arguments[1] === undefined ? removeApplicationDefaultFragments : arguments[1];

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

  return {
    query: "\n      mutation updateApplication ($applicationId: String!, $data: ApplicationInput!) {\n        updateApplication (_id: $applicationId, data: $data) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      applicationId: application._id,
      data: application
    }
  };
}

var addApplicationSourceDefaultFragments = "\n  _id,\n  filename,\n  extension\n";

function addApplicationSource(applicationId, data) {
  var fragments = arguments.length <= 2 || arguments[2] === undefined ? addApplicationSourceDefaultFragments : arguments[2];

  return {
    query: "\n      mutation addSourceToApplication ($applicationId: String!, $data: ApplicationSourceInput!) {\n        addSourceToApplication(applicationId: $applicationId, data: $data) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      applicationId: applicationId,
      data: data
    }
  };
}

var updateApplicationSourceDefaultFragments = "\n  _id,\n  filename,\n  extension\n";

function updateApplicationSource(applicationSource) {
  var fragments = arguments.length <= 1 || arguments[1] === undefined ? updateApplicationSourceDefaultFragments : arguments[1];

  return {
    query: "\n      mutation updateApplicationSource ($sourceId: String!, $data: ApplicationSourceInput!) {\n        updateApplicationSource(_id: $sourceId, data: $data) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      sourceId: applicationSource._id,
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

  return {
    query: "\n      mutation updateTemplate ($templateId: ID!, $data: TemplateInput!) {\n        updateTemplate (_id: $templateId, data: $data) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      templateId: template._id,
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
//# sourceMappingURL=data:application/json;base64,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QUNsRixTQUFPO0FBQ0wsU0FBSyxvSEFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRTtBQUNOLFVBQUksRUFBRSxRQUFRO0tBQ2Y7R0FDRixDQUFDO0NBQ0g7O0FBRUQsSUFBTSw4QkFBOEIsY0FFbkMsQ0FBQzs7QUFFSyxTQUFTLGNBQWMsQ0FBRSxFQUFFLEVBQThDO01BQTVDLFNBQVMseURBQUcsOEJBQThCOztBQUM1RSxTQUFPO0FBQ0wsU0FBSywwR0FHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRTtBQUNOLFNBQUcsRUFBRSxFQUFFO0tBQ1I7R0FDRixDQUFDO0NBQ0g7O0FBRUQsSUFBTSw4QkFBOEIsNkJBR25DLENBQUM7O0FBRUssU0FBUyxjQUFjLENBQUUsUUFBUSxFQUE4QztNQUE1QyxTQUFTLHlEQUFHLDhCQUE4Qjs7QUFDbEYsU0FBTztBQUNMLFNBQUssd0pBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUU7QUFDTixnQkFBVSxFQUFFLFFBQVEsQ0FBQyxHQUFHO0FBQ3hCLFVBQUksRUFBRSxRQUFRO0tBQ2Y7R0FDRixDQUFBO0NBQ0Y7O0FBRUQsSUFBTSxnQ0FBZ0Msd0JBR3JDLENBQUM7O0FBRUssU0FBUywyQkFBMkIsQ0FBRSxhQUFhLEVBQWdEO01BQTlDLFNBQVMseURBQUcsZ0NBQWdDOztBQUN0RyxTQUFPO0FBQ0wsU0FBSyxrS0FHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRTtBQUNOLG1CQUFhLEVBQUUsYUFBYTtLQUM3QjtHQUNGLENBQUE7Q0FDRiIsImZpbGUiOiJtdXRhdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBjcmVhdGVBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgY3JlYXRlZEF0LFxuICBuYW1lXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQXBwbGljYXRpb24gKGRhdGEsIGZyYWdtZW50cyA9IGNyZWF0ZUFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBtdXRhdGlvbiBjcmVhdGVBcHBsaWNhdGlvbiAoJGRhdGE6IEFwcGxpY2F0aW9uSW5wdXQhKSB7XG4gICAgICAgIGNyZWF0ZUFwcGxpY2F0aW9uKGRhdGE6ICRkYXRhKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgZGF0YVxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgZHVwbGljYXRlQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWRcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBkdXBsaWNhdGVBcHBsaWNhdGlvbiAoaWQsIGZyYWdtZW50cyA9IHJlbW92ZUFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBtdXRhdGlvbiBkdXBsaWNhdGVBcHBsaWNhdGlvbiAoJF9pZDogU3RyaW5nISkge1xuICAgICAgICBkdXBsaWNhdGVBcHBsaWNhdGlvbiAoX2lkOiAkX2lkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgX2lkOiBpZFxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgcmVtb3ZlQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWRcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVBcHBsaWNhdGlvbiAoaWQsIGZyYWdtZW50cyA9IHJlbW92ZUFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBtdXRhdGlvbiByZW1vdmVBcHBsaWNhdGlvbiAoJF9pZDogU3RyaW5nISkge1xuICAgICAgICByZW1vdmVBcHBsaWNhdGlvbiAoX2lkOiAkX2lkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgX2lkOiBpZFxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgcmVtb3ZlUHJvdGVjdGlvbkRlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZFxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVByb3RlY3Rpb24gKGlkLCBhcHBJZCwgZnJhZ21lbnRzID0gcmVtb3ZlUHJvdGVjdGlvbkRlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gcmVtb3ZlUHJvdGVjdGlvbiAoJF9pZDogU3RyaW5nISwgJGFwcGxpY2F0aW9uSWQ6IFN0cmluZyEpIHtcbiAgICAgICAgcmVtb3ZlUHJvdGVjdGlvbiAoX2lkOiAkX2lkLCBhcHBsaWNhdGlvbklkOiAkYXBwbGljYXRpb25JZCkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IHtcbiAgICAgIF9pZDogaWQsXG4gICAgICBhcHBsaWNhdGlvbklkOiBhcHBJZFxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgdXBkYXRlQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIGNyZWF0ZWRBdCxcbiAgbmFtZVxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUFwcGxpY2F0aW9uIChhcHBsaWNhdGlvbiwgZnJhZ21lbnRzID0gdXBkYXRlQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIHVwZGF0ZUFwcGxpY2F0aW9uICgkYXBwbGljYXRpb25JZDogU3RyaW5nISwgJGRhdGE6IEFwcGxpY2F0aW9uSW5wdXQhKSB7XG4gICAgICAgIHVwZGF0ZUFwcGxpY2F0aW9uIChfaWQ6ICRhcHBsaWNhdGlvbklkLCBkYXRhOiAkZGF0YSkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IHtcbiAgICAgIGFwcGxpY2F0aW9uSWQ6IGFwcGxpY2F0aW9uLl9pZCxcbiAgICAgIGRhdGE6IGFwcGxpY2F0aW9uXG4gICAgfVxuICB9O1xufVxuXG5jb25zdCBhZGRBcHBsaWNhdGlvblNvdXJjZURlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgZmlsZW5hbWUsXG4gIGV4dGVuc2lvblxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEFwcGxpY2F0aW9uU291cmNlIChhcHBsaWNhdGlvbklkLCBkYXRhLCBmcmFnbWVudHMgPSBhZGRBcHBsaWNhdGlvblNvdXJjZURlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gYWRkU291cmNlVG9BcHBsaWNhdGlvbiAoJGFwcGxpY2F0aW9uSWQ6IFN0cmluZyEsICRkYXRhOiBBcHBsaWNhdGlvblNvdXJjZUlucHV0ISkge1xuICAgICAgICBhZGRTb3VyY2VUb0FwcGxpY2F0aW9uKGFwcGxpY2F0aW9uSWQ6ICRhcHBsaWNhdGlvbklkLCBkYXRhOiAkZGF0YSkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IHtcbiAgICAgIGFwcGxpY2F0aW9uSWQsXG4gICAgICBkYXRhXG4gICAgfVxuICB9O1xufVxuXG5jb25zdCB1cGRhdGVBcHBsaWNhdGlvblNvdXJjZURlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgZmlsZW5hbWUsXG4gIGV4dGVuc2lvblxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlIChhcHBsaWNhdGlvblNvdXJjZSwgZnJhZ21lbnRzID0gdXBkYXRlQXBwbGljYXRpb25Tb3VyY2VEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlICgkc291cmNlSWQ6IFN0cmluZyEsICRkYXRhOiBBcHBsaWNhdGlvblNvdXJjZUlucHV0ISkge1xuICAgICAgICB1cGRhdGVBcHBsaWNhdGlvblNvdXJjZShfaWQ6ICRzb3VyY2VJZCwgZGF0YTogJGRhdGEpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICBzb3VyY2VJZDogYXBwbGljYXRpb25Tb3VyY2UuX2lkLFxuICAgICAgZGF0YTogYXBwbGljYXRpb25Tb3VyY2VcbiAgICB9XG4gIH07XG59XG5cbmNvbnN0IHJlbW92ZVNvdXJjZUZyb21BcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgc291cmNlcyB7XG4gICAgZmlsZW5hbWVcbiAgfVxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVNvdXJjZUZyb21BcHBsaWNhdGlvbiAoZmlsZW5hbWUsIGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cyA9IHJlbW92ZVNvdXJjZUZyb21BcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gcmVtb3ZlU291cmNlICgkZmlsZW5hbWU6IFN0cmluZyEsICRhcHBsaWNhdGlvbklkOiBTdHJpbmchKSB7XG4gICAgICAgIHJlbW92ZVNvdXJjZSAoZmlsZW5hbWU6ICRmaWxlbmFtZSwgYXBwbGljYXRpb25JZDogJGFwcGxpY2F0aW9uSWQpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICBmaWxlbmFtZSxcbiAgICAgIGFwcGxpY2F0aW9uSWRcbiAgICB9XG4gIH07XG59XG5cbmNvbnN0IGNyZWF0ZVRlbXBsYXRlRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBuYW1lLFxuICBkZXNjcmlwdGlvbixcbiAgcGFyYW1ldGVyc1xuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlICh0ZW1wbGF0ZSwgZnJhZ21lbnRzID0gY3JlYXRlVGVtcGxhdGVEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIGNyZWF0ZVRlbXBsYXRlICgkZGF0YTogVGVtcGxhdGVJbnB1dCEpIHtcbiAgICAgICAgY3JlYXRlVGVtcGxhdGUgKGRhdGE6ICRkYXRhKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgZGF0YTogdGVtcGxhdGVcbiAgICB9XG4gIH07XG59XG5cbmNvbnN0IHJlbW92ZVRlbXBsYXRlRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlVGVtcGxhdGUgKGlkLCBmcmFnbWVudHMgPSByZW1vdmVUZW1wbGF0ZURlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gcmVtb3ZlVGVtcGxhdGUgKCRfaWQ6IFN0cmluZyEpIHtcbiAgICAgICAgcmVtb3ZlVGVtcGxhdGUgKF9pZDogJF9pZCkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IHtcbiAgICAgIF9pZDogaWRcbiAgICB9XG4gIH07XG59XG5cbmNvbnN0IHVwZGF0ZVRlbXBsYXRlRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBwYXJhbWV0ZXJzXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlVGVtcGxhdGUgKHRlbXBsYXRlLCBmcmFnbWVudHMgPSB1cGRhdGVUZW1wbGF0ZURlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gdXBkYXRlVGVtcGxhdGUgKCR0ZW1wbGF0ZUlkOiBJRCEsICRkYXRhOiBUZW1wbGF0ZUlucHV0ISkge1xuICAgICAgICB1cGRhdGVUZW1wbGF0ZSAoX2lkOiAkdGVtcGxhdGVJZCwgZGF0YTogJGRhdGEpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICB0ZW1wbGF0ZUlkOiB0ZW1wbGF0ZS5faWQsXG4gICAgICBkYXRhOiB0ZW1wbGF0ZVxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBjcmVhdGVQcm90ZWN0aW9uRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBzdGF0ZVxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFwcGxpY2F0aW9uUHJvdGVjdGlvbiAoYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzID0gY3JlYXRlUHJvdGVjdGlvbkRlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gY3JlYXRlQXBwbGljYXRpb25Qcm90ZWN0aW9uICgkYXBwbGljYXRpb25JZDogU3RyaW5nISkge1xuICAgICAgICBjcmVhdGVBcHBsaWNhdGlvblByb3RlY3Rpb24gKGFwcGxpY2F0aW9uSWQ6ICRhcHBsaWNhdGlvbklkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgYXBwbGljYXRpb25JZDogYXBwbGljYXRpb25JZFxuICAgIH1cbiAgfVxufVxuIl19
