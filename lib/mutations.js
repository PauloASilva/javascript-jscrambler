"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApplication = createApplication;
exports.updateApplication = updateApplication;
exports.addApplicationSource = addApplicationSource;
exports.updateApplicationSource = updateApplicationSource;
exports.removeSourceFromApplication = removeSourceFromApplication;
exports.createTemplate = createTemplate;
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

var removeSourceFromApplicationDefaultFragments = "\n";

function removeSourceFromApplication(sourceId, applicationId) {
  var fragments = arguments.length <= 2 || arguments[2] === undefined ? removeSourceFromApplicationDefaultFragments : arguments[2];

  return {
    query: "\n      mutation removeSource ($_id: String!, $applicationId: String!) {\n        removeSource (_id: $_id, applicationId: $applicationId) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      _id: sourceId,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tdXRhdGlvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLGlDQUFpQyxxQ0FJdEMsQ0FBQzs7QUFFSyxTQUFTLGlCQUFpQixDQUFFLElBQUksRUFBaUQ7TUFBL0MsU0FBUyx5REFBRyxpQ0FBaUM7O0FBQ3BGLFNBQU87QUFDTCxTQUFLLDRIQUdHLFNBQVMsK0JBR2hCO0FBQ0QsVUFBTSxFQUFFO0FBQ04sVUFBSSxFQUFKLElBQUk7S0FDTDtHQUNGLENBQUM7Q0FDSDs7QUFFRCxJQUFNLGlDQUFpQyxxQ0FJdEMsQ0FBQzs7QUFFSyxTQUFTLGlCQUFpQixDQUFFLFdBQVcsRUFBaUQ7TUFBL0MsU0FBUyx5REFBRyxpQ0FBaUM7O0FBQzNGLFNBQU87QUFDTCxTQUFLLDJLQUdHLFNBQVMsK0JBR2hCO0FBQ0QsVUFBTSxFQUFFO0FBQ04sbUJBQWEsRUFBRSxXQUFXLENBQUMsR0FBRztBQUM5QixVQUFJLEVBQUUsV0FBVztLQUNsQjtHQUNGLENBQUM7Q0FDSDs7QUFFRCxJQUFNLG9DQUFvQyx5Q0FJekMsQ0FBQzs7QUFFSyxTQUFTLG9CQUFvQixDQUFFLGFBQWEsRUFBRSxJQUFJLEVBQW9EO01BQWxELFNBQVMseURBQUcsb0NBQW9DOztBQUN6RyxTQUFPO0FBQ0wsU0FBSyxvTUFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRTtBQUNOLG1CQUFhLEVBQWIsYUFBYTtBQUNiLFVBQUksRUFBSixJQUFJO0tBQ0w7R0FDRixDQUFDO0NBQ0g7O0FBRUQsSUFBTSx1Q0FBdUMseUNBSTVDLENBQUM7O0FBRUssU0FBUyx1QkFBdUIsQ0FBRSxpQkFBaUIsRUFBdUQ7TUFBckQsU0FBUyx5REFBRyx1Q0FBdUM7O0FBQzdHLFNBQU87QUFDTCxTQUFLLGtMQUdHLFNBQVMsK0JBR2hCO0FBQ0QsVUFBTSxFQUFFO0FBQ04sY0FBUSxFQUFFLGlCQUFpQixDQUFDLEdBQUc7QUFDL0IsVUFBSSxFQUFFLGlCQUFpQjtLQUN4QjtHQUNGLENBQUM7Q0FDSDs7QUFFRCxJQUFNLDJDQUEyQyxPQUNoRCxDQUFDOztBQUVLLFNBQVMsMkJBQTJCLENBQUUsUUFBUSxFQUFFLGFBQWEsRUFBMkQ7TUFBekQsU0FBUyx5REFBRywyQ0FBMkM7O0FBQzNILFNBQU87QUFDTCxTQUFLLDhKQUdHLFNBQVMsK0JBR2hCO0FBQ0QsVUFBTSxFQUFFO0FBQ04sU0FBRyxFQUFFLFFBQVE7QUFDYixtQkFBYSxFQUFiLGFBQWE7S0FDZDtHQUNGLENBQUM7Q0FDSDs7QUFFRCxJQUFNLDhCQUE4QixzREFLbkMsQ0FBQzs7QUFFSyxTQUFTLGNBQWMsQ0FBRSxRQUFRLEVBQThDO01BQTVDLFNBQVMseURBQUcsOEJBQThCOztBQUNsRixTQUFPO0FBQ0wsU0FBSyxvSEFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRTtBQUNOLFVBQUksRUFBRSxRQUFRO0tBQ2Y7R0FDRixDQUFDO0NBQ0giLCJmaWxlIjoibXV0YXRpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgY3JlYXRlQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIGNyZWF0ZWRBdCxcbiAgbmFtZVxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFwcGxpY2F0aW9uIChkYXRhLCBmcmFnbWVudHMgPSBjcmVhdGVBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gY3JlYXRlQXBwbGljYXRpb24gKCRkYXRhOiBBcHBsaWNhdGlvbklucHV0ISkge1xuICAgICAgICBjcmVhdGVBcHBsaWNhdGlvbihkYXRhOiAkZGF0YSkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IHtcbiAgICAgIGRhdGFcbiAgICB9XG4gIH07XG59XG5cbmNvbnN0IHVwZGF0ZUFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBjcmVhdGVkQXQsXG4gIG5hbWVcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBcHBsaWNhdGlvbiAoYXBwbGljYXRpb24sIGZyYWdtZW50cyA9IHVwZGF0ZUFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBtdXRhdGlvbiB1cGRhdGVBcHBsaWNhdGlvbiAoJGFwcGxpY2F0aW9uSWQ6IFN0cmluZyEsICRkYXRhOiBBcHBsaWNhdGlvbklucHV0ISkge1xuICAgICAgICB1cGRhdGVBcHBsaWNhdGlvbiAoX2lkOiAkYXBwbGljYXRpb25JZCwgZGF0YTogJGRhdGEpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICBhcHBsaWNhdGlvbklkOiBhcHBsaWNhdGlvbi5faWQsXG4gICAgICBkYXRhOiBhcHBsaWNhdGlvblxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgYWRkQXBwbGljYXRpb25Tb3VyY2VEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIGZpbGVuYW1lLFxuICBleHRlbnNpb25cbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRBcHBsaWNhdGlvblNvdXJjZSAoYXBwbGljYXRpb25JZCwgZGF0YSwgZnJhZ21lbnRzID0gYWRkQXBwbGljYXRpb25Tb3VyY2VEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIGFkZFNvdXJjZVRvQXBwbGljYXRpb24gKCRhcHBsaWNhdGlvbklkOiBTdHJpbmchLCAkZGF0YTogQXBwbGljYXRpb25Tb3VyY2VJbnB1dCEpIHtcbiAgICAgICAgYWRkU291cmNlVG9BcHBsaWNhdGlvbihhcHBsaWNhdGlvbklkOiAkYXBwbGljYXRpb25JZCwgZGF0YTogJGRhdGEpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICBhcHBsaWNhdGlvbklkLFxuICAgICAgZGF0YVxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgdXBkYXRlQXBwbGljYXRpb25Tb3VyY2VEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIGZpbGVuYW1lLFxuICBleHRlbnNpb25cbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVBcHBsaWNhdGlvblNvdXJjZSAoYXBwbGljYXRpb25Tb3VyY2UsIGZyYWdtZW50cyA9IHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBtdXRhdGlvbiB1cGRhdGVBcHBsaWNhdGlvblNvdXJjZSAoJHNvdXJjZUlkOiBTdHJpbmchLCAkZGF0YTogQXBwbGljYXRpb25Tb3VyY2VJbnB1dCEpIHtcbiAgICAgICAgdXBkYXRlQXBwbGljYXRpb25Tb3VyY2UoX2lkOiAkc291cmNlSWQsIGRhdGE6ICRkYXRhKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgc291cmNlSWQ6IGFwcGxpY2F0aW9uU291cmNlLl9pZCxcbiAgICAgIGRhdGE6IGFwcGxpY2F0aW9uU291cmNlXG4gICAgfVxuICB9O1xufVxuXG5jb25zdCByZW1vdmVTb3VyY2VGcm9tQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzID0gYFxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZVNvdXJjZUZyb21BcHBsaWNhdGlvbiAoc291cmNlSWQsIGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cyA9IHJlbW92ZVNvdXJjZUZyb21BcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gcmVtb3ZlU291cmNlICgkX2lkOiBTdHJpbmchLCAkYXBwbGljYXRpb25JZDogU3RyaW5nISkge1xuICAgICAgICByZW1vdmVTb3VyY2UgKF9pZDogJF9pZCwgYXBwbGljYXRpb25JZDogJGFwcGxpY2F0aW9uSWQpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICBfaWQ6IHNvdXJjZUlkLFxuICAgICAgYXBwbGljYXRpb25JZFxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgY3JlYXRlVGVtcGxhdGVEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIG5hbWUsXG4gIGRlc2NyaXB0aW9uLFxuICBwYXJhbWV0ZXJzXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGUgKHRlbXBsYXRlLCBmcmFnbWVudHMgPSBjcmVhdGVUZW1wbGF0ZURlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gY3JlYXRlVGVtcGxhdGUgKCRkYXRhOiBUZW1wbGF0ZUlucHV0ISkge1xuICAgICAgICBjcmVhdGVUZW1wbGF0ZSAoZGF0YTogJGRhdGEpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICBkYXRhOiB0ZW1wbGF0ZVxuICAgIH1cbiAgfTtcbn1cbiJdfQ==
