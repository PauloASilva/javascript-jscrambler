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
exports.removeTemplate = removeTemplate;
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

var removeTemplateDefaultFragments = "\n  _id\n";

function removeTemplate(id) {
  var fragments = arguments.length <= 1 || arguments[1] === undefined ? removeTemplateDefaultFragments : arguments[1];

  return {
    query: "\n      mutation removeTemplate($_id: String!) {\n        removeTemplate (_id: $_id) {\n          " + fragments + "\n        }\n      }\n    ",
    params: {
      _id: id
    }
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tdXRhdGlvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTSxpQ0FBaUMscUNBSXRDLENBQUM7O0FBRUssU0FBUyxpQkFBaUIsQ0FBRSxJQUFJLEVBQWlEO01BQS9DLFNBQVMseURBQUcsaUNBQWlDOztBQUNwRixTQUFPO0FBQ0wsU0FBSyw0SEFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRTtBQUNOLFVBQUksRUFBSixJQUFJO0tBQ0w7R0FDRixDQUFDO0NBQ0g7O0FBRUQsSUFBTSxpQ0FBaUMscUNBSXRDLENBQUM7O0FBRUssU0FBUyxpQkFBaUIsQ0FBRSxXQUFXLEVBQWlEO01BQS9DLFNBQVMseURBQUcsaUNBQWlDOztBQUMzRixTQUFPO0FBQ0wsU0FBSywyS0FHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRTtBQUNOLG1CQUFhLEVBQUUsV0FBVyxDQUFDLEdBQUc7QUFDOUIsVUFBSSxFQUFFLFdBQVc7S0FDbEI7R0FDRixDQUFDO0NBQ0g7O0FBRUQsSUFBTSxvQ0FBb0MseUNBSXpDLENBQUM7O0FBRUssU0FBUyxvQkFBb0IsQ0FBRSxhQUFhLEVBQUUsSUFBSSxFQUFvRDtNQUFsRCxTQUFTLHlEQUFHLG9DQUFvQzs7QUFDekcsU0FBTztBQUNMLFNBQUssb01BR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUU7QUFDTixtQkFBYSxFQUFiLGFBQWE7QUFDYixVQUFJLEVBQUosSUFBSTtLQUNMO0dBQ0YsQ0FBQztDQUNIOztBQUVELElBQU0sdUNBQXVDLHlDQUk1QyxDQUFDOztBQUVLLFNBQVMsdUJBQXVCLENBQUUsaUJBQWlCLEVBQXVEO01BQXJELFNBQVMseURBQUcsdUNBQXVDOztBQUM3RyxTQUFPO0FBQ0wsU0FBSyxrTEFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRTtBQUNOLGNBQVEsRUFBRSxpQkFBaUIsQ0FBQyxHQUFHO0FBQy9CLFVBQUksRUFBRSxpQkFBaUI7S0FDeEI7R0FDRixDQUFDO0NBQ0g7O0FBRUQsSUFBTSwyQ0FBMkMsT0FDaEQsQ0FBQzs7QUFFSyxTQUFTLDJCQUEyQixDQUFFLFFBQVEsRUFBRSxhQUFhLEVBQTJEO01BQXpELFNBQVMseURBQUcsMkNBQTJDOztBQUMzSCxTQUFPO0FBQ0wsU0FBSyw4SkFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRTtBQUNOLFNBQUcsRUFBRSxRQUFRO0FBQ2IsbUJBQWEsRUFBYixhQUFhO0tBQ2Q7R0FDRixDQUFDO0NBQ0g7O0FBRUQsSUFBTSw4QkFBOEIsc0RBS25DLENBQUM7O0FBRUssU0FBUyxjQUFjLENBQUUsUUFBUSxFQUE4QztNQUE1QyxTQUFTLHlEQUFHLDhCQUE4Qjs7QUFDbEYsU0FBTztBQUNMLFNBQUssb0hBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUU7QUFDTixVQUFJLEVBQUUsUUFBUTtLQUNmO0dBQ0YsQ0FBQztDQUNIOztBQUVELElBQU0sOEJBQThCLGNBRW5DLENBQUM7O0FBRUssU0FBUyxjQUFjLENBQUUsRUFBRSxFQUE4QztNQUE1QyxTQUFTLHlEQUFHLDhCQUE4Qjs7QUFDNUUsU0FBTztBQUNMLFNBQUsseUdBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUU7QUFDTixTQUFHLEVBQUUsRUFBRTtLQUNSO0dBQ0YsQ0FBQztDQUNIIiwiZmlsZSI6Im11dGF0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGNyZWF0ZUFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBjcmVhdGVkQXQsXG4gIG5hbWVcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVBcHBsaWNhdGlvbiAoZGF0YSwgZnJhZ21lbnRzID0gY3JlYXRlQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIGNyZWF0ZUFwcGxpY2F0aW9uICgkZGF0YTogQXBwbGljYXRpb25JbnB1dCEpIHtcbiAgICAgICAgY3JlYXRlQXBwbGljYXRpb24oZGF0YTogJGRhdGEpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiB7XG4gICAgICBkYXRhXG4gICAgfVxuICB9O1xufVxuXG5jb25zdCB1cGRhdGVBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgY3JlYXRlZEF0LFxuICBuYW1lXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQXBwbGljYXRpb24gKGFwcGxpY2F0aW9uLCBmcmFnbWVudHMgPSB1cGRhdGVBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gdXBkYXRlQXBwbGljYXRpb24gKCRhcHBsaWNhdGlvbklkOiBTdHJpbmchLCAkZGF0YTogQXBwbGljYXRpb25JbnB1dCEpIHtcbiAgICAgICAgdXBkYXRlQXBwbGljYXRpb24gKF9pZDogJGFwcGxpY2F0aW9uSWQsIGRhdGE6ICRkYXRhKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgYXBwbGljYXRpb25JZDogYXBwbGljYXRpb24uX2lkLFxuICAgICAgZGF0YTogYXBwbGljYXRpb25cbiAgICB9XG4gIH07XG59XG5cbmNvbnN0IGFkZEFwcGxpY2F0aW9uU291cmNlRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBmaWxlbmFtZSxcbiAgZXh0ZW5zaW9uXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gYWRkQXBwbGljYXRpb25Tb3VyY2UgKGFwcGxpY2F0aW9uSWQsIGRhdGEsIGZyYWdtZW50cyA9IGFkZEFwcGxpY2F0aW9uU291cmNlRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBtdXRhdGlvbiBhZGRTb3VyY2VUb0FwcGxpY2F0aW9uICgkYXBwbGljYXRpb25JZDogU3RyaW5nISwgJGRhdGE6IEFwcGxpY2F0aW9uU291cmNlSW5wdXQhKSB7XG4gICAgICAgIGFkZFNvdXJjZVRvQXBwbGljYXRpb24oYXBwbGljYXRpb25JZDogJGFwcGxpY2F0aW9uSWQsIGRhdGE6ICRkYXRhKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgYXBwbGljYXRpb25JZCxcbiAgICAgIGRhdGFcbiAgICB9XG4gIH07XG59XG5cbmNvbnN0IHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBmaWxlbmFtZSxcbiAgZXh0ZW5zaW9uXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlQXBwbGljYXRpb25Tb3VyY2UgKGFwcGxpY2F0aW9uU291cmNlLCBmcmFnbWVudHMgPSB1cGRhdGVBcHBsaWNhdGlvblNvdXJjZURlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gdXBkYXRlQXBwbGljYXRpb25Tb3VyY2UgKCRzb3VyY2VJZDogU3RyaW5nISwgJGRhdGE6IEFwcGxpY2F0aW9uU291cmNlSW5wdXQhKSB7XG4gICAgICAgIHVwZGF0ZUFwcGxpY2F0aW9uU291cmNlKF9pZDogJHNvdXJjZUlkLCBkYXRhOiAkZGF0YSkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IHtcbiAgICAgIHNvdXJjZUlkOiBhcHBsaWNhdGlvblNvdXJjZS5faWQsXG4gICAgICBkYXRhOiBhcHBsaWNhdGlvblNvdXJjZVxuICAgIH1cbiAgfTtcbn1cblxuY29uc3QgcmVtb3ZlU291cmNlRnJvbUFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cyA9IGBcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTb3VyY2VGcm9tQXBwbGljYXRpb24gKHNvdXJjZUlkLCBhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMgPSByZW1vdmVTb3VyY2VGcm9tQXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIHJlbW92ZVNvdXJjZSAoJF9pZDogU3RyaW5nISwgJGFwcGxpY2F0aW9uSWQ6IFN0cmluZyEpIHtcbiAgICAgICAgcmVtb3ZlU291cmNlIChfaWQ6ICRfaWQsIGFwcGxpY2F0aW9uSWQ6ICRhcHBsaWNhdGlvbklkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgX2lkOiBzb3VyY2VJZCxcbiAgICAgIGFwcGxpY2F0aW9uSWRcbiAgICB9XG4gIH07XG59XG5cbmNvbnN0IGNyZWF0ZVRlbXBsYXRlRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBuYW1lLFxuICBkZXNjcmlwdGlvbixcbiAgcGFyYW1ldGVyc1xuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRlbXBsYXRlICh0ZW1wbGF0ZSwgZnJhZ21lbnRzID0gY3JlYXRlVGVtcGxhdGVEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIG11dGF0aW9uIGNyZWF0ZVRlbXBsYXRlICgkZGF0YTogVGVtcGxhdGVJbnB1dCEpIHtcbiAgICAgICAgY3JlYXRlVGVtcGxhdGUgKGRhdGE6ICRkYXRhKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgZGF0YTogdGVtcGxhdGVcbiAgICB9XG4gIH07XG59XG5cbmNvbnN0IHJlbW92ZVRlbXBsYXRlRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlVGVtcGxhdGUgKGlkLCBmcmFnbWVudHMgPSByZW1vdmVUZW1wbGF0ZURlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgbXV0YXRpb24gcmVtb3ZlVGVtcGxhdGUoJF9pZDogU3RyaW5nISkge1xuICAgICAgICByZW1vdmVUZW1wbGF0ZSAoX2lkOiAkX2lkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczoge1xuICAgICAgX2lkOiBpZFxuICAgIH1cbiAgfTtcbn1cbiJdfQ==
