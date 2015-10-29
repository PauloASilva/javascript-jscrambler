"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApplication = createApplication;
exports.updateApplication = updateApplication;
exports.addApplicationSource = addApplicationSource;
exports.updateApplicationSource = updateApplicationSource;
exports.removeSourceFromApplication = removeSourceFromApplication;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tdXRhdGlvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQU0saUNBQWlDLHFDQUl0QyxDQUFDOztBQUVLLFNBQVMsaUJBQWlCLENBQUUsSUFBSSxFQUFpRDtNQUEvQyxTQUFTLHlEQUFHLGlDQUFpQzs7QUFDcEYsU0FBTztBQUNMLFNBQUssNEhBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUU7QUFDTixVQUFJLEVBQUosSUFBSTtLQUNMO0dBQ0YsQ0FBQztDQUNIOztBQUVELElBQU0saUNBQWlDLHFDQUl0QyxDQUFDOztBQUVLLFNBQVMsaUJBQWlCLENBQUUsV0FBVyxFQUFpRDtNQUEvQyxTQUFTLHlEQUFHLGlDQUFpQzs7QUFDM0YsU0FBTztBQUNMLFNBQUssMktBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUU7QUFDTixtQkFBYSxFQUFFLFdBQVcsQ0FBQyxHQUFHO0FBQzlCLFVBQUksRUFBRSxXQUFXO0tBQ2xCO0dBQ0YsQ0FBQztDQUNIOztBQUVELElBQU0sb0NBQW9DLHlDQUl6QyxDQUFDOztBQUVLLFNBQVMsb0JBQW9CLENBQUUsYUFBYSxFQUFFLElBQUksRUFBb0Q7TUFBbEQsU0FBUyx5REFBRyxvQ0FBb0M7O0FBQ3pHLFNBQU87QUFDTCxTQUFLLG9NQUdHLFNBQVMsK0JBR2hCO0FBQ0QsVUFBTSxFQUFFO0FBQ04sbUJBQWEsRUFBYixhQUFhO0FBQ2IsVUFBSSxFQUFKLElBQUk7S0FDTDtHQUNGLENBQUM7Q0FDSDs7QUFFRCxJQUFNLHVDQUF1Qyx5Q0FJNUMsQ0FBQzs7QUFFSyxTQUFTLHVCQUF1QixDQUFFLGlCQUFpQixFQUF1RDtNQUFyRCxTQUFTLHlEQUFHLHVDQUF1Qzs7QUFDN0csU0FBTztBQUNMLFNBQUssa0xBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUU7QUFDTixjQUFRLEVBQUUsaUJBQWlCLENBQUMsR0FBRztBQUMvQixVQUFJLEVBQUUsaUJBQWlCO0tBQ3hCO0dBQ0YsQ0FBQztDQUNIOztBQUVELElBQU0sMkNBQTJDLE9BQ2hELENBQUM7O0FBRUssU0FBUywyQkFBMkIsQ0FBRSxRQUFRLEVBQUUsYUFBYSxFQUEyRDtNQUF6RCxTQUFTLHlEQUFHLDJDQUEyQzs7QUFDM0gsU0FBTztBQUNMLFNBQUssOEpBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUU7QUFDTixTQUFHLEVBQUUsUUFBUTtBQUNiLG1CQUFhLEVBQWIsYUFBYTtLQUNkO0dBQ0YsQ0FBQztDQUNIIiwiZmlsZSI6Im11dGF0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNyZWF0ZUFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBjcmVhdGVkQXQsXG4gIG5hbWVcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBcHBsaWNhdGlvbiAoZGF0YSwgZnJhZ21lbnRzID0gY3JlYXRlQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIGNyZWF0ZUFwcGxpY2F0aW9uICgkZGF0YTogQXBwbGljYXRpb25JbnB1dCEpIHtcbiAgICAgICAgY3JlYXRlQXBwbGljYXRpb24oZGF0YTogJGRhdGEpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICBkYXRhXG4gICAgfVxuICB9O1xufVxuXG5jb25zdCB1cGRhdGVBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgY3JlYXRlZEF0LFxuICBuYW1lXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQXBwbGljYXRpb24gKGFwcGxpY2F0aW9uLCBmcmFnbWVudHMgPSB1cGRhdGVBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gdXBkYXRlQXBwbGljYXRpb24gKCRhcHBsaWNhdGlvbklkOiBTdHJpbmchLCAkZGF0YTogQXBwbGljYXRpb25JbnB1dCEpIHtcbiAgICAgICAgdXBkYXRlQXBwbGljYXRpb24gKF9pZDogJGFwcGxpY2F0aW9uSWQsIGRhdGE6ICRkYXRhKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgYXBwbGljYXRpb25JZDogYXBwbGljYXRpb24uX2lkLFxuICAgICAgZGF0YTogYXBwbGljYXRpb25cbiAgICB9XG4gIH07XG59XG5cbmNvbnN0IGFkZEFwcGxpY2F0aW9uU291cmNlRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBmaWxlbmFtZSxcbiAgZXh0ZW5zaW9uXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkQXBwbGljYXRpb25Tb3VyY2UgKGFwcGxpY2F0aW9uSWQsIGRhdGEsIGZyYWdtZW50cyA9IGFkZEFwcGxpY2F0aW9uU291cmNlRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBtdXRhdGlvbiBhZGRTb3VyY2VUb0FwcGxpY2F0aW9uICgkYXBwbGljYXRpb25JZDogU3RyaW5nISwgJGRhdGE6IEFwcGxpY2F0aW9uU291cmNlSW5wdXQhKSB7XG4gICAgICAgIGFkZFNvdXJjZVRvQXBwbGljYXRpb24oYXBwbGljYXRpb25JZDogJGFwcGxpY2F0aW9uSWQsIGRhdGE6ICRkYXRhKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgYXBwbGljYXRpb25JZCxcbiAgICAgIGRhdGFcbiAgICB9XG4gIH07XG59XG5cbmNvbnN0IHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBmaWxlbmFtZSxcbiAgZXh0ZW5zaW9uXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQXBwbGljYXRpb25Tb3VyY2UgKGFwcGxpY2F0aW9uU291cmNlLCBmcmFnbWVudHMgPSB1cGRhdGVBcHBsaWNhdGlvblNvdXJjZURlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gdXBkYXRlQXBwbGljYXRpb25Tb3VyY2UgKCRzb3VyY2VJZDogU3RyaW5nISwgJGRhdGE6IEFwcGxpY2F0aW9uU291cmNlSW5wdXQhKSB7XG4gICAgICAgIHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlKF9pZDogJHNvdXJjZUlkLCBkYXRhOiAkZGF0YSkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IHtcbiAgICAgIHNvdXJjZUlkOiBhcHBsaWNhdGlvblNvdXJjZS5faWQsXG4gICAgICBkYXRhOiBhcHBsaWNhdGlvblNvdXJjZVxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgcmVtb3ZlU291cmNlRnJvbUFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cyA9IGBcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTb3VyY2VGcm9tQXBwbGljYXRpb24gKHNvdXJjZUlkLCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMgPSByZW1vdmVTb3VyY2VGcm9tQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIHJlbW92ZVNvdXJjZSAoJF9pZDogU3RyaW5nISwgJGFwcGxpY2F0aW9uSWQ6IFN0cmluZyEpIHtcbiAgICAgICAgcmVtb3ZlU291cmNlIChfaWQ6ICRfaWQsIGFwcGxpY2F0aW9uSWQ6ICRhcHBsaWNhdGlvbklkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgX2lkOiBzb3VyY2VJZCxcbiAgICAgIGFwcGxpY2F0aW9uSWRcbiAgICB9XG4gIH07XG59XG4iXX0=
