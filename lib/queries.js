'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.getApplication = getApplication;
exports.getApplicationSource = getApplicationSource;
exports.getApplicationProtections = getApplicationProtections;
exports.getTemplates = getTemplates;
exports.getApplications = getApplications;
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
  var fragments = arguments.length <= 2 || arguments[2] === undefined ? getApplicationSourceDefaultFragments : arguments[2];

  return {
    query: '\n      query getApplicationProtections ($applicationId: String!, $sort: String, $order: String, $limit: Int, $page: Int, $search: String, $s: String) {\n        applicationProtections(_id: $applicationId, sort: $sort, order: $order, limit: $limit, page: $page, search: $search, s: $s) {\n          ' + fragments + '\n        }\n      }\n    ',
    params: JSON.stringify(_extends({
      applicationId: applicationId
    }, params))
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9xdWVyaWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLDhCQUE4QixnR0FTbkMsQ0FBQzs7QUFFSyxTQUFTLGNBQWMsQ0FBRSxhQUFhLEVBQThDO01BQTVDLFNBQVMseURBQUcsOEJBQThCOztBQUN2RixTQUFPO0FBQ0wsU0FBSyx1SEFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ3JCLG1CQUFhLEVBQWIsYUFBYTtLQUNkLENBQUM7R0FDSCxDQUFDO0NBQ0g7O0FBRUQsSUFBTSxvQ0FBb0MseUNBSXpDLENBQUM7O0FBRUssU0FBUyxvQkFBb0IsQ0FBRSxRQUFRLEVBQW9EO01BQWxELFNBQVMseURBQUcsb0NBQW9DOztBQUM5RixTQUFPO0FBQ0wsU0FBSyx5SEFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ3JCLGNBQVEsRUFBUixRQUFRO0tBQ1QsQ0FBQztHQUNILENBQUM7Q0FDSDs7QUFFRCxJQUFNLHlDQUF5Qyx3REFLOUMsQ0FBQzs7QUFFSyxTQUFTLHlCQUF5QixDQUFFLGFBQWEsRUFBRSxNQUFNLEVBQW9EO01BQWxELFNBQVMseURBQUcsb0NBQW9DOztBQUNoSCxTQUFPO0FBQ0wsU0FBSyxrVEFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRSxJQUFJLENBQUMsU0FBUztBQUNwQixtQkFBYSxFQUFiLGFBQWE7T0FDVixNQUFNLEVBQ1Q7R0FDSCxDQUFDO0NBQ0g7O0FBRUQsSUFBTSw0QkFBNEIsNkJBR2pDLENBQUM7O0FBRUssU0FBUyxZQUFZLEdBQTRDO01BQTFDLFNBQVMseURBQUcsNEJBQTRCOztBQUNwRSxTQUFPO0FBQ0wsU0FBSyxvRUFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRSxJQUFJO0dBQ2IsQ0FBQTtDQUNGOztBQUVELElBQU0sK0JBQStCLHNEQUtwQyxDQUFDOztBQUVLLFNBQVMsZUFBZSxHQUErQztNQUE3QyxTQUFTLHlEQUFHLCtCQUErQjs7QUFDMUUsU0FBTztBQUNMLFNBQUssMEVBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUUsSUFBSTtHQUNiLENBQUE7Q0FDRiIsImZpbGUiOiJxdWVyaWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZ2V0QXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIG5hbWUsXG4gIGNyZWF0ZWRBdCxcbiAgc291cmNlcyB7XG4gICAgX2lkLFxuICAgIGZpbGVuYW1lLFxuICAgIGV4dGVuc2lvblxuICB9XG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwbGljYXRpb24gKGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cyA9IGdldEFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBxdWVyeSBnZXRBcHBsaWNhdGlvbiAoJGFwcGxpY2F0aW9uSWQ6IFN0cmluZyEpIHtcbiAgICAgICAgYXBwbGljYXRpb24oX2lkOiAkYXBwbGljYXRpb25JZCkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGFwcGxpY2F0aW9uSWRcbiAgICB9KVxuICB9O1xufVxuXG5jb25zdCBnZXRBcHBsaWNhdGlvblNvdXJjZURlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgZmlsZW5hbWUsXG4gIGV4dGVuc2lvblxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcGxpY2F0aW9uU291cmNlIChzb3VyY2VJZCwgZnJhZ21lbnRzID0gZ2V0QXBwbGljYXRpb25Tb3VyY2VEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIHF1ZXJ5IGdldEFwcGxpY2F0aW9uU291cmNlICgkc291cmNlSWQ6IFN0cmluZyEpIHtcbiAgICAgICAgYXBwbGljYXRpb25Tb3VyY2UoX2lkOiAkc291cmNlSWQpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBzb3VyY2VJZFxuICAgIH0pXG4gIH07XG59XG5cbmNvbnN0IGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIHNvdXJjZXMsXG4gIHBhcmFtZXRlcnMsXG4gIGZpbmlzaGVkQXRcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zIChhcHBsaWNhdGlvbklkLCBwYXJhbXMsIGZyYWdtZW50cyA9IGdldEFwcGxpY2F0aW9uU291cmNlRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBxdWVyeSBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zICgkYXBwbGljYXRpb25JZDogU3RyaW5nISwgJHNvcnQ6IFN0cmluZywgJG9yZGVyOiBTdHJpbmcsICRsaW1pdDogSW50LCAkcGFnZTogSW50LCAkc2VhcmNoOiBTdHJpbmcsICRzOiBTdHJpbmcpIHtcbiAgICAgICAgYXBwbGljYXRpb25Qcm90ZWN0aW9ucyhfaWQ6ICRhcHBsaWNhdGlvbklkLCBzb3J0OiAkc29ydCwgb3JkZXI6ICRvcmRlciwgbGltaXQ6ICRsaW1pdCwgcGFnZTogJHBhZ2UsIHNlYXJjaDogJHNlYXJjaCwgczogJHMpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhcHBsaWNhdGlvbklkLFxuICAgICAgLi4ucGFyYW1zXG4gICAgfSlcbiAgfTtcbn1cblxuY29uc3QgZ2V0VGVtcGxhdGVzRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBwYXJhbWV0ZXJzXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGVtcGxhdGVzIChmcmFnbWVudHMgPSBnZXRUZW1wbGF0ZXNEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIHF1ZXJ5IGdldFRlbXBsYXRlcyB7XG4gICAgICAgIHRlbXBsYXRlcyB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczogJ3t9J1xuICB9XG59XG5cbmNvbnN0IGdldEFwcGxpY2F0aW9uc0RlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgbmFtZSxcbiAgcHJvdGVjdGlvbnMsXG4gIHBhcmFtZXRlcnNcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGlvbnMgKGZyYWdtZW50cyA9IGdldEFwcGxpY2F0aW9uc0RlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgcXVlcnkgZ2V0QXBwbGljYXRpb25zIHtcbiAgICAgICAgYXBwbGljYXRpb25zIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiAne30nXG4gIH1cbn1cbiJdfQ==
