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

function getApplicationSource(sourceId, fragments, limits) {
  if (fragments === undefined) fragments = getApplicationSourceDefaultFragments;

  return {
    query: '\n      query getApplicationSource ($sourceId: String!, $contentLimit: Int, $transformedLimit: Int) {\n        applicationSource(_id: $sourceId, contentLimit: $contentLimit, transformedLimit: $transformedLimit) {\n          ' + fragments + '\n        }\n      }\n    ',
    params: JSON.stringify(_extends({
      sourceId: sourceId
    }, limits))
  };
}

var getApplicationProtectionsDefaultFragments = '\n  _id,\n  sources,\n  parameters,\n  finishedAt\n';

function getApplicationProtections(applicationId, params) {
  var fragments = arguments.length <= 2 || arguments[2] === undefined ? getApplicationProtectionsDefaultFragments : arguments[2];

  return {
    query: '\n      query getApplicationProtections ($applicationId: String!, $sort: String, $order: String, $limit: Int, $page: Int) {\n        applicationProtections(_id: $applicationId, sort: $sort, order: $order, limit: $limit, page: $page) {\n          ' + fragments + '\n        }\n      }\n    ',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvcXVlcmllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLDhCQUE4QixnR0FTbkMsQ0FBQzs7QUFFSyxTQUFTLGNBQWMsQ0FBRSxhQUFhLEVBQThDO01BQTVDLFNBQVMseURBQUcsOEJBQThCOztBQUN2RixTQUFPO0FBQ0wsU0FBSyx1SEFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ3JCLG1CQUFhLEVBQWIsYUFBYTtLQUNkLENBQUM7R0FDSCxDQUFDO0NBQ0g7O0FBRUQsSUFBTSxvQ0FBb0MseUNBSXpDLENBQUM7O0FBRUssU0FBUyxvQkFBb0IsQ0FBRSxRQUFRLEVBQUUsU0FBUyxFQUF5QyxNQUFNLEVBQUU7TUFBMUQsU0FBUyxnQkFBVCxTQUFTLEdBQUcsb0NBQW9DOztBQUM5RixTQUFPO0FBQ0wsU0FBSyx1T0FHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRSxJQUFJLENBQUMsU0FBUztBQUNwQixjQUFRLEVBQVIsUUFBUTtPQUNMLE1BQU0sRUFDVDtHQUNILENBQUM7Q0FDSDs7QUFFRCxJQUFNLHlDQUF5Qyx3REFLOUMsQ0FBQzs7QUFFSyxTQUFTLHlCQUF5QixDQUFFLGFBQWEsRUFBRSxNQUFNLEVBQXlEO01BQXZELFNBQVMseURBQUcseUNBQXlDOztBQUNySCxTQUFPO0FBQ0wsU0FBSyw2UEFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRSxJQUFJLENBQUMsU0FBUztBQUNwQixtQkFBYSxFQUFiLGFBQWE7T0FDVixNQUFNLEVBQ1Q7R0FDSCxDQUFDO0NBQ0g7O0FBRUQsSUFBTSw4Q0FBOEMsZ0JBRW5ELENBQUM7O0FBRUssU0FBUyw4QkFBOEIsQ0FBRSxhQUFhLEVBQThEO01BQTVELFNBQVMseURBQUcsOENBQThDOztBQUN2SCxTQUFPO0FBQ0wsU0FBSyx1SkFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ3JCLG1CQUFhLEVBQWIsYUFBYTtLQUNkLENBQUM7R0FDSCxDQUFDO0NBQ0g7O0FBRUQsSUFBTSw0QkFBNEIsNkJBR2pDLENBQUM7O0FBRUssU0FBUyxZQUFZLEdBQTRDO01BQTFDLFNBQVMseURBQUcsNEJBQTRCOztBQUNwRSxTQUFPO0FBQ0wsU0FBSyxvRUFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRSxJQUFJO0dBQ2IsQ0FBQztDQUNIOztBQUVELElBQU0sK0JBQStCLHNEQUtwQyxDQUFDOztBQUVLLFNBQVMsZUFBZSxHQUErQztNQUE3QyxTQUFTLHlEQUFHLCtCQUErQjs7QUFDMUUsU0FBTztBQUNMLFNBQUssMEVBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUUsSUFBSTtHQUNiLENBQUM7Q0FDSDs7QUFFRCxJQUFNLDZCQUE2QixHQUFHO0FBQ3BDLGFBQVcsa0JBRVY7QUFDRCx1QkFBcUIsNkJBR3BCO0NBQ0YsQ0FBQzs7QUFFSyxTQUFTLGFBQWEsQ0FBRSxhQUFhLEVBQUUsWUFBWSxFQUE2QztNQUEzQyxTQUFTLHlEQUFHLDZCQUE2Qjs7QUFDbkcsU0FBTztBQUNMLFNBQUssK0lBR0csU0FBUyxDQUFDLFdBQVcscUZBR3JCLFNBQVMsQ0FBQyxxQkFBcUIsK0JBR3RDO0FBQ0QsVUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDckIsbUJBQWEsRUFBYixhQUFhO0FBQ2Isa0JBQVksRUFBWixZQUFZO0tBQ2IsQ0FBQztHQUNILENBQUM7Q0FDSCIsImZpbGUiOiJxdWVyaWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZ2V0QXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIG5hbWUsXG4gIGNyZWF0ZWRBdCxcbiAgc291cmNlcyB7XG4gICAgX2lkLFxuICAgIGZpbGVuYW1lLFxuICAgIGV4dGVuc2lvblxuICB9XG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwbGljYXRpb24gKGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cyA9IGdldEFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBxdWVyeSBnZXRBcHBsaWNhdGlvbiAoJGFwcGxpY2F0aW9uSWQ6IFN0cmluZyEpIHtcbiAgICAgICAgYXBwbGljYXRpb24oX2lkOiAkYXBwbGljYXRpb25JZCkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGFwcGxpY2F0aW9uSWRcbiAgICB9KVxuICB9O1xufVxuXG5jb25zdCBnZXRBcHBsaWNhdGlvblNvdXJjZURlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgZmlsZW5hbWUsXG4gIGV4dGVuc2lvblxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcGxpY2F0aW9uU291cmNlIChzb3VyY2VJZCwgZnJhZ21lbnRzID0gZ2V0QXBwbGljYXRpb25Tb3VyY2VEZWZhdWx0RnJhZ21lbnRzLCBsaW1pdHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgcXVlcnkgZ2V0QXBwbGljYXRpb25Tb3VyY2UgKCRzb3VyY2VJZDogU3RyaW5nISwgJGNvbnRlbnRMaW1pdDogSW50LCAkdHJhbnNmb3JtZWRMaW1pdDogSW50KSB7XG4gICAgICAgIGFwcGxpY2F0aW9uU291cmNlKF9pZDogJHNvdXJjZUlkLCBjb250ZW50TGltaXQ6ICRjb250ZW50TGltaXQsIHRyYW5zZm9ybWVkTGltaXQ6ICR0cmFuc2Zvcm1lZExpbWl0KSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgc291cmNlSWQsXG4gICAgICAuLi5saW1pdHNcbiAgICB9KVxuICB9O1xufVxuXG5jb25zdCBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBzb3VyY2VzLFxuICBwYXJhbWV0ZXJzLFxuICBmaW5pc2hlZEF0XG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9ucyAoYXBwbGljYXRpb25JZCwgcGFyYW1zLCBmcmFnbWVudHMgPSBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBxdWVyeSBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zICgkYXBwbGljYXRpb25JZDogU3RyaW5nISwgJHNvcnQ6IFN0cmluZywgJG9yZGVyOiBTdHJpbmcsICRsaW1pdDogSW50LCAkcGFnZTogSW50KSB7XG4gICAgICAgIGFwcGxpY2F0aW9uUHJvdGVjdGlvbnMoX2lkOiAkYXBwbGljYXRpb25JZCwgc29ydDogJHNvcnQsIG9yZGVyOiAkb3JkZXIsIGxpbWl0OiAkbGltaXQsIHBhZ2U6ICRwYWdlKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgYXBwbGljYXRpb25JZCxcbiAgICAgIC4uLnBhcmFtc1xuICAgIH0pXG4gIH07XG59XG5cbmNvbnN0IGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNDb3VudERlZmF1bHRGcmFnbWVudHMgPSBgXG4gIGNvdW50XG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uc0NvdW50IChhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMgPSBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zQ291bnREZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIHF1ZXJ5IGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNDb3VudCAoJGFwcGxpY2F0aW9uSWQ6IFN0cmluZyEpIHtcbiAgICAgICAgYXBwbGljYXRpb25Qcm90ZWN0aW9uc0NvdW50KF9pZDogJGFwcGxpY2F0aW9uSWQpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhcHBsaWNhdGlvbklkXG4gICAgfSlcbiAgfTtcbn1cblxuY29uc3QgZ2V0VGVtcGxhdGVzRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBwYXJhbWV0ZXJzXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGVtcGxhdGVzIChmcmFnbWVudHMgPSBnZXRUZW1wbGF0ZXNEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIHF1ZXJ5IGdldFRlbXBsYXRlcyB7XG4gICAgICAgIHRlbXBsYXRlcyB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczogJ3t9J1xuICB9O1xufVxuXG5jb25zdCBnZXRBcHBsaWNhdGlvbnNEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIG5hbWUsXG4gIHByb3RlY3Rpb25zLFxuICBwYXJhbWV0ZXJzXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwbGljYXRpb25zIChmcmFnbWVudHMgPSBnZXRBcHBsaWNhdGlvbnNEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIHF1ZXJ5IGdldEFwcGxpY2F0aW9ucyB7XG4gICAgICAgIGFwcGxpY2F0aW9ucyB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczogJ3t9J1xuICB9O1xufVxuXG5jb25zdCBnZXRQcm90ZWN0aW9uRGVmYXVsdEZyYWdtZW50cyA9IHtcbiAgYXBwbGljYXRpb246IGBcbiAgICBuYW1lXG4gIGAsXG4gIGFwcGxpY2F0aW9uUHJvdGVjdGlvbjogYFxuICAgIF9pZCxcbiAgICBzdGF0ZVxuICBgXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvdGVjdGlvbiAoYXBwbGljYXRpb25JZCwgcHJvdGVjdGlvbklkLCBmcmFnbWVudHMgPSBnZXRQcm90ZWN0aW9uRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBxdWVyeSBnZXRQcm90ZWN0aW9uICgkYXBwbGljYXRpb25JZDogU3RyaW5nISwgJHByb3RlY3Rpb25JZDogU3RyaW5nISkge1xuICAgICAgICBhcHBsaWNhdGlvbiAoX2lkOiAkYXBwbGljYXRpb25JZCkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzLmFwcGxpY2F0aW9ufVxuICAgICAgICB9XG4gICAgICAgIGFwcGxpY2F0aW9uUHJvdGVjdGlvbiAoX2lkOiAkcHJvdGVjdGlvbklkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHMuYXBwbGljYXRpb25Qcm90ZWN0aW9ufVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGFwcGxpY2F0aW9uSWQsXG4gICAgICBwcm90ZWN0aW9uSWRcbiAgICB9KVxuICB9O1xufVxuIl19
