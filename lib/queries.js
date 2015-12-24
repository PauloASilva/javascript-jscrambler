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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9xdWVyaWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBTSw4QkFBOEIsZ0dBU25DLENBQUM7O0FBRUssU0FBUyxjQUFjLENBQUUsYUFBYSxFQUE4QztNQUE1QyxTQUFTLHlEQUFHLDhCQUE4Qjs7QUFDdkYsU0FBTztBQUNMLFNBQUssdUhBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNyQixtQkFBYSxFQUFiLGFBQWE7S0FDZCxDQUFDO0dBQ0gsQ0FBQztDQUNIOztBQUVELElBQU0sb0NBQW9DLHlDQUl6QyxDQUFDOztBQUVLLFNBQVMsb0JBQW9CLENBQUUsUUFBUSxFQUFvRDtNQUFsRCxTQUFTLHlEQUFHLG9DQUFvQzs7QUFDOUYsU0FBTztBQUNMLFNBQUsseUhBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNyQixjQUFRLEVBQVIsUUFBUTtLQUNULENBQUM7R0FDSCxDQUFDO0NBQ0g7O0FBRUQsSUFBTSx5Q0FBeUMsd0RBSzlDLENBQUM7O0FBRUssU0FBUyx5QkFBeUIsQ0FBRSxhQUFhLEVBQUUsTUFBTSxFQUF5RDtNQUF2RCxTQUFTLHlEQUFHLHlDQUF5Qzs7QUFDckgsU0FBTztBQUNMLFNBQUssa1RBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVM7QUFDcEIsbUJBQWEsRUFBYixhQUFhO09BQ1YsTUFBTSxFQUNUO0dBQ0gsQ0FBQztDQUNIOztBQUVELElBQU0sOENBQThDLGdCQUVuRCxDQUFDOztBQUVLLFNBQVMsOEJBQThCLENBQUUsYUFBYSxFQUE4RDtNQUE1RCxTQUFTLHlEQUFHLDhDQUE4Qzs7QUFDdkgsU0FBTztBQUNMLFNBQUssdUpBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNyQixtQkFBYSxFQUFiLGFBQWE7S0FDZCxDQUFDO0dBQ0gsQ0FBQztDQUNIOztBQUVELElBQU0sNEJBQTRCLDZCQUdqQyxDQUFDOztBQUVLLFNBQVMsWUFBWSxHQUE0QztNQUExQyxTQUFTLHlEQUFHLDRCQUE0Qjs7QUFDcEUsU0FBTztBQUNMLFNBQUssb0VBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUUsSUFBSTtHQUNiLENBQUE7Q0FDRjs7QUFFRCxJQUFNLCtCQUErQixzREFLcEMsQ0FBQzs7QUFFSyxTQUFTLGVBQWUsR0FBK0M7TUFBN0MsU0FBUyx5REFBRywrQkFBK0I7O0FBQzFFLFNBQU87QUFDTCxTQUFLLDBFQUdHLFNBQVMsK0JBR2hCO0FBQ0QsVUFBTSxFQUFFLElBQUk7R0FDYixDQUFBO0NBQ0YiLCJmaWxlIjoicXVlcmllcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGdldEFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBuYW1lLFxuICBjcmVhdGVkQXQsXG4gIHNvdXJjZXMge1xuICAgIF9pZCxcbiAgICBmaWxlbmFtZSxcbiAgICBleHRlbnNpb25cbiAgfVxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcGxpY2F0aW9uIChhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMgPSBnZXRBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgcXVlcnkgZ2V0QXBwbGljYXRpb24gKCRhcHBsaWNhdGlvbklkOiBTdHJpbmchKSB7XG4gICAgICAgIGFwcGxpY2F0aW9uKF9pZDogJGFwcGxpY2F0aW9uSWQpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhcHBsaWNhdGlvbklkXG4gICAgfSlcbiAgfTtcbn1cblxuY29uc3QgZ2V0QXBwbGljYXRpb25Tb3VyY2VEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIGZpbGVuYW1lLFxuICBleHRlbnNpb25cbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGlvblNvdXJjZSAoc291cmNlSWQsIGZyYWdtZW50cyA9IGdldEFwcGxpY2F0aW9uU291cmNlRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBxdWVyeSBnZXRBcHBsaWNhdGlvblNvdXJjZSAoJHNvdXJjZUlkOiBTdHJpbmchKSB7XG4gICAgICAgIGFwcGxpY2F0aW9uU291cmNlKF9pZDogJHNvdXJjZUlkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgc291cmNlSWRcbiAgICB9KVxuICB9O1xufVxuXG5jb25zdCBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBzb3VyY2VzLFxuICBwYXJhbWV0ZXJzLFxuICBmaW5pc2hlZEF0XG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9ucyAoYXBwbGljYXRpb25JZCwgcGFyYW1zLCBmcmFnbWVudHMgPSBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBxdWVyeSBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zICgkYXBwbGljYXRpb25JZDogU3RyaW5nISwgJHNvcnQ6IFN0cmluZywgJG9yZGVyOiBTdHJpbmcsICRsaW1pdDogSW50LCAkcGFnZTogSW50LCAkc2VhcmNoOiBTdHJpbmcsICRzOiBTdHJpbmcpIHtcbiAgICAgICAgYXBwbGljYXRpb25Qcm90ZWN0aW9ucyhfaWQ6ICRhcHBsaWNhdGlvbklkLCBzb3J0OiAkc29ydCwgb3JkZXI6ICRvcmRlciwgbGltaXQ6ICRsaW1pdCwgcGFnZTogJHBhZ2UsIHNlYXJjaDogJHNlYXJjaCwgczogJHMpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhcHBsaWNhdGlvbklkLFxuICAgICAgLi4ucGFyYW1zXG4gICAgfSlcbiAgfTtcbn1cblxuY29uc3QgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uc0NvdW50RGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgY291bnRcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zQ291bnQgKGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cyA9IGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNDb3VudERlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgcXVlcnkgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uc0NvdW50ICgkYXBwbGljYXRpb25JZDogU3RyaW5nISkge1xuICAgICAgICBhcHBsaWNhdGlvblByb3RlY3Rpb25zQ291bnQoX2lkOiAkYXBwbGljYXRpb25JZCkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGFwcGxpY2F0aW9uSWRcbiAgICB9KVxuICB9O1xufVxuXG5jb25zdCBnZXRUZW1wbGF0ZXNEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIHBhcmFtZXRlcnNcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUZW1wbGF0ZXMgKGZyYWdtZW50cyA9IGdldFRlbXBsYXRlc0RlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgcXVlcnkgZ2V0VGVtcGxhdGVzIHtcbiAgICAgICAgdGVtcGxhdGVzIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiAne30nXG4gIH1cbn1cblxuY29uc3QgZ2V0QXBwbGljYXRpb25zRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBuYW1lLFxuICBwcm90ZWN0aW9ucyxcbiAgcGFyYW1ldGVyc1xuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcGxpY2F0aW9ucyAoZnJhZ21lbnRzID0gZ2V0QXBwbGljYXRpb25zRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBxdWVyeSBnZXRBcHBsaWNhdGlvbnMge1xuICAgICAgICBhcHBsaWNhdGlvbnMge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6ICd7fSdcbiAgfVxufVxuIl19
