'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getApplication = getApplication;
exports.getApplicationSource = getApplicationSource;
exports.getApplicationProtections = getApplicationProtections;
exports.getApplicationProtectionsCount = getApplicationProtectionsCount;
exports.getTemplates = getTemplates;
exports.getApplications = getApplications;
exports.getProtection = getProtection;
var getApplicationDefaultFragments = '\n  _id,\n  name,\n  createdAt,\n  sources {\n    _id,\n    filename,\n    extension\n  }\n';

function getApplication(applicationId) {
  var fragments = arguments.length <= 1 || arguments[1] === undefined ? getApplicationDefaultFragments : arguments[1];

  return {
    query: '\n      query getApplication ($applicationId: String!) {\n        application(_id: $applicationId) {\n          ' + fragments + '\n        }\n      }\n    ',
    params: JSON.stringify({
      applicationId: applicationId
    })
  };
}

var getApplicationSourceDefaultFragments = '\n  _id,\n  filename,\n  extension\n';

function getApplicationSource(sourceId) {
  var fragments = arguments.length <= 1 || arguments[1] === undefined ? getApplicationSourceDefaultFragments : arguments[1];

  return {
    query: '\n      query getApplicationSource ($sourceId: String!) {\n        applicationSource(_id: $sourceId) {\n          ' + fragments + '\n        }\n      }\n    ',
    params: JSON.stringify({
      sourceId: sourceId
    })
  };
}

var getApplicationProtectionsDefaultFragments = '\n  _id,\n  sources,\n  parameters,\n  finishedAt\n';

function getApplicationProtections(applicationId, params) {
  var fragments = arguments.length <= 2 || arguments[2] === undefined ? getApplicationProtectionsDefaultFragments : arguments[2];

  return {
    query: '\n      query getApplicationProtections ($applicationId: String!, $sort: String, $order: String, $limit: Int, $page: Int, $search: String, $s: String) {\n        applicationProtections(_id: $applicationId, sort: $sort, order: $order, limit: $limit, page: $page, search: $search, s: $s) {\n          ' + fragments + '\n        }\n      }\n    ',
    params: JSON.stringify(_extends({
      applicationId: applicationId
    }, params))
  };
}

var getApplicationProtectionsCountDefaultFragments = '\n  count\n';

function getApplicationProtectionsCount(applicationId) {
  var fragments = arguments.length <= 1 || arguments[1] === undefined ? getApplicationProtectionsCountDefaultFragments : arguments[1];

  return {
    query: '\n      query getApplicationProtectionsCount ($applicationId: String!) {\n        applicationProtectionsCount(_id: $applicationId) {\n          ' + fragments + '\n        }\n      }\n    ',
    params: JSON.stringify({
      applicationId: applicationId
    })
  };
}

var getTemplatesDefaultFragments = '\n  _id,\n  parameters\n';

function getTemplates() {
  var fragments = arguments.length <= 0 || arguments[0] === undefined ? getTemplatesDefaultFragments : arguments[0];

  return {
    query: '\n      query getTemplates {\n        templates {\n          ' + fragments + '\n        }\n      }\n    ',
    params: '{}'
  };
}

var getApplicationsDefaultFragments = '\n  _id,\n  name,\n  protections,\n  parameters\n';

function getApplications() {
  var fragments = arguments.length <= 0 || arguments[0] === undefined ? getApplicationsDefaultFragments : arguments[0];

  return {
    query: '\n      query getApplications {\n        applications {\n          ' + fragments + '\n        }\n      }\n    ',
    params: '{}'
  };
}

var getProtectionDefaultFragments = {
  application: '\n    name\n  ',
  applicationProtection: '\n    _id,\n    state\n  '
};

function getProtection(applicationId, protectionId) {
  var fragments = arguments.length <= 2 || arguments[2] === undefined ? getProtectionDefaultFragments : arguments[2];

  return {
    query: '\n      query getProtection ($applicationId: String!, $protectionId: String!) {\n        application (_id: $applicationId) {\n          ' + fragments.application + '\n        }\n        applicationProtection (_id: $protectionId) {\n          ' + fragments.applicationProtection + '\n        }\n      }\n    ',
    params: JSON.stringify({
      applicationId: applicationId,
      protectionId: protectionId
    })
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9xdWVyaWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQU0sOEJBQThCLGdHQVNuQyxDQUFDOztBQUVLLFNBQVMsY0FBYyxDQUFFLGFBQWEsRUFBOEM7TUFBNUMsU0FBUyx5REFBRyw4QkFBOEI7O0FBQ3ZGLFNBQU87QUFDTCxTQUFLLHVIQUdHLFNBQVMsK0JBR2hCO0FBQ0QsVUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDckIsbUJBQWEsRUFBYixhQUFhO0tBQ2QsQ0FBQztHQUNILENBQUM7Q0FDSDs7QUFFRCxJQUFNLG9DQUFvQyx5Q0FJekMsQ0FBQzs7QUFFSyxTQUFTLG9CQUFvQixDQUFFLFFBQVEsRUFBb0Q7TUFBbEQsU0FBUyx5REFBRyxvQ0FBb0M7O0FBQzlGLFNBQU87QUFDTCxTQUFLLHlIQUdHLFNBQVMsK0JBR2hCO0FBQ0QsVUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDckIsY0FBUSxFQUFSLFFBQVE7S0FDVCxDQUFDO0dBQ0gsQ0FBQztDQUNIOztBQUVELElBQU0seUNBQXlDLHdEQUs5QyxDQUFDOztBQUVLLFNBQVMseUJBQXlCLENBQUUsYUFBYSxFQUFFLE1BQU0sRUFBeUQ7TUFBdkQsU0FBUyx5REFBRyx5Q0FBeUM7O0FBQ3JILFNBQU87QUFDTCxTQUFLLGtUQUdHLFNBQVMsK0JBR2hCO0FBQ0QsVUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTO0FBQ3BCLG1CQUFhLEVBQWIsYUFBYTtPQUNWLE1BQU0sRUFDVDtHQUNILENBQUM7Q0FDSDs7QUFFRCxJQUFNLDhDQUE4QyxnQkFFbkQsQ0FBQzs7QUFFSyxTQUFTLDhCQUE4QixDQUFFLGFBQWEsRUFBOEQ7TUFBNUQsU0FBUyx5REFBRyw4Q0FBOEM7O0FBQ3ZILFNBQU87QUFDTCxTQUFLLHVKQUdHLFNBQVMsK0JBR2hCO0FBQ0QsVUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDckIsbUJBQWEsRUFBYixhQUFhO0tBQ2QsQ0FBQztHQUNILENBQUM7Q0FDSDs7QUFFRCxJQUFNLDRCQUE0Qiw2QkFHakMsQ0FBQzs7QUFFSyxTQUFTLFlBQVksR0FBNEM7TUFBMUMsU0FBUyx5REFBRyw0QkFBNEI7O0FBQ3BFLFNBQU87QUFDTCxTQUFLLG9FQUdHLFNBQVMsK0JBR2hCO0FBQ0QsVUFBTSxFQUFFLElBQUk7R0FDYixDQUFDO0NBQ0g7O0FBRUQsSUFBTSwrQkFBK0Isc0RBS3BDLENBQUM7O0FBRUssU0FBUyxlQUFlLEdBQStDO01BQTdDLFNBQVMseURBQUcsK0JBQStCOztBQUMxRSxTQUFPO0FBQ0wsU0FBSywwRUFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRSxJQUFJO0dBQ2IsQ0FBQztDQUNIOztBQUVELElBQU0sNkJBQTZCLEdBQUc7QUFDcEMsYUFBVyxrQkFFVjtBQUNELHVCQUFxQiw2QkFHcEI7Q0FDRixDQUFDOztBQUVLLFNBQVMsYUFBYSxDQUFFLGFBQWEsRUFBRSxZQUFZLEVBQTZDO01BQTNDLFNBQVMseURBQUcsNkJBQTZCOztBQUNuRyxTQUFPO0FBQ0wsU0FBSywrSUFHRyxTQUFTLENBQUMsV0FBVyxxRkFHckIsU0FBUyxDQUFDLHFCQUFxQiwrQkFHdEM7QUFDRCxVQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNyQixtQkFBYSxFQUFiLGFBQWE7QUFDYixrQkFBWSxFQUFaLFlBQVk7S0FDYixDQUFDO0dBQ0gsQ0FBQztDQUNIIiwiZmlsZSI6InF1ZXJpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBnZXRBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgbmFtZSxcbiAgY3JlYXRlZEF0LFxuICBzb3VyY2VzIHtcbiAgICBfaWQsXG4gICAgZmlsZW5hbWUsXG4gICAgZXh0ZW5zaW9uXG4gIH1cbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGlvbiAoYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzID0gZ2V0QXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIHF1ZXJ5IGdldEFwcGxpY2F0aW9uICgkYXBwbGljYXRpb25JZDogU3RyaW5nISkge1xuICAgICAgICBhcHBsaWNhdGlvbihfaWQ6ICRhcHBsaWNhdGlvbklkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgYXBwbGljYXRpb25JZFxuICAgIH0pXG4gIH07XG59XG5cbmNvbnN0IGdldEFwcGxpY2F0aW9uU291cmNlRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBmaWxlbmFtZSxcbiAgZXh0ZW5zaW9uXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwbGljYXRpb25Tb3VyY2UgKHNvdXJjZUlkLCBmcmFnbWVudHMgPSBnZXRBcHBsaWNhdGlvblNvdXJjZURlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgcXVlcnkgZ2V0QXBwbGljYXRpb25Tb3VyY2UgKCRzb3VyY2VJZDogU3RyaW5nISkge1xuICAgICAgICBhcHBsaWNhdGlvblNvdXJjZShfaWQ6ICRzb3VyY2VJZCkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHNvdXJjZUlkXG4gICAgfSlcbiAgfTtcbn1cblxuY29uc3QgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uc0RlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgc291cmNlcyxcbiAgcGFyYW1ldGVycyxcbiAgZmluaXNoZWRBdFxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnMgKGFwcGxpY2F0aW9uSWQsIHBhcmFtcywgZnJhZ21lbnRzID0gZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uc0RlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgcXVlcnkgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9ucyAoJGFwcGxpY2F0aW9uSWQ6IFN0cmluZyEsICRzb3J0OiBTdHJpbmcsICRvcmRlcjogU3RyaW5nLCAkbGltaXQ6IEludCwgJHBhZ2U6IEludCwgJHNlYXJjaDogU3RyaW5nLCAkczogU3RyaW5nKSB7XG4gICAgICAgIGFwcGxpY2F0aW9uUHJvdGVjdGlvbnMoX2lkOiAkYXBwbGljYXRpb25JZCwgc29ydDogJHNvcnQsIG9yZGVyOiAkb3JkZXIsIGxpbWl0OiAkbGltaXQsIHBhZ2U6ICRwYWdlLCBzZWFyY2g6ICRzZWFyY2gsIHM6ICRzKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgYXBwbGljYXRpb25JZCxcbiAgICAgIC4uLnBhcmFtc1xuICAgIH0pXG4gIH07XG59XG5cbmNvbnN0IGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNDb3VudERlZmF1bHRGcmFnbWVudHMgPSBgXG4gIGNvdW50XG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uc0NvdW50IChhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMgPSBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zQ291bnREZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIHF1ZXJ5IGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNDb3VudCAoJGFwcGxpY2F0aW9uSWQ6IFN0cmluZyEpIHtcbiAgICAgICAgYXBwbGljYXRpb25Qcm90ZWN0aW9uc0NvdW50KF9pZDogJGFwcGxpY2F0aW9uSWQpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhcHBsaWNhdGlvbklkXG4gICAgfSlcbiAgfTtcbn1cblxuY29uc3QgZ2V0VGVtcGxhdGVzRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBwYXJhbWV0ZXJzXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGVtcGxhdGVzIChmcmFnbWVudHMgPSBnZXRUZW1wbGF0ZXNEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIHF1ZXJ5IGdldFRlbXBsYXRlcyB7XG4gICAgICAgIHRlbXBsYXRlcyB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczogJ3t9J1xuICB9O1xufVxuXG5jb25zdCBnZXRBcHBsaWNhdGlvbnNEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIG5hbWUsXG4gIHByb3RlY3Rpb25zLFxuICBwYXJhbWV0ZXJzXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwbGljYXRpb25zIChmcmFnbWVudHMgPSBnZXRBcHBsaWNhdGlvbnNEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIHF1ZXJ5IGdldEFwcGxpY2F0aW9ucyB7XG4gICAgICAgIGFwcGxpY2F0aW9ucyB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczogJ3t9J1xuICB9O1xufVxuXG5jb25zdCBnZXRQcm90ZWN0aW9uRGVmYXVsdEZyYWdtZW50cyA9IHtcbiAgYXBwbGljYXRpb246IGBcbiAgICBuYW1lXG4gIGAsXG4gIGFwcGxpY2F0aW9uUHJvdGVjdGlvbjogYFxuICAgIF9pZCxcbiAgICBzdGF0ZVxuICBgXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvdGVjdGlvbiAoYXBwbGljYXRpb25JZCwgcHJvdGVjdGlvbklkLCBmcmFnbWVudHMgPSBnZXRQcm90ZWN0aW9uRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBxdWVyeSBnZXRQcm90ZWN0aW9uICgkYXBwbGljYXRpb25JZDogU3RyaW5nISwgJHByb3RlY3Rpb25JZDogU3RyaW5nISkge1xuICAgICAgICBhcHBsaWNhdGlvbiAoX2lkOiAkYXBwbGljYXRpb25JZCkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzLmFwcGxpY2F0aW9ufVxuICAgICAgICB9XG4gICAgICAgIGFwcGxpY2F0aW9uUHJvdGVjdGlvbiAoX2lkOiAkcHJvdGVjdGlvbklkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHMuYXBwbGljYXRpb25Qcm90ZWN0aW9ufVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGFwcGxpY2F0aW9uSWQsXG4gICAgICBwcm90ZWN0aW9uSWRcbiAgICB9KVxuICB9O1xufVxuIl19
