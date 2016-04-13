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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvcXVlcmllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFNLDhCQUE4QixnR0FTbkMsQ0FBQzs7QUFFSyxTQUFTLGNBQWMsQ0FBRSxhQUFhLEVBQThDO01BQTVDLFNBQVMseURBQUcsOEJBQThCOztBQUN2RixTQUFPO0FBQ0wsU0FBSyx1SEFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ3JCLG1CQUFhLEVBQWIsYUFBYTtLQUNkLENBQUM7R0FDSCxDQUFDO0NBQ0g7O0FBRUQsSUFBTSxvQ0FBb0MseUNBSXpDLENBQUM7O0FBRUssU0FBUyxvQkFBb0IsQ0FBRSxRQUFRLEVBQW9EO01BQWxELFNBQVMseURBQUcsb0NBQW9DOztBQUM5RixTQUFPO0FBQ0wsU0FBSyx5SEFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ3JCLGNBQVEsRUFBUixRQUFRO0tBQ1QsQ0FBQztHQUNILENBQUM7Q0FDSDs7QUFFRCxJQUFNLHlDQUF5Qyx3REFLOUMsQ0FBQzs7QUFFSyxTQUFTLHlCQUF5QixDQUFFLGFBQWEsRUFBRSxNQUFNLEVBQXlEO01BQXZELFNBQVMseURBQUcseUNBQXlDOztBQUNySCxTQUFPO0FBQ0wsU0FBSyw2UEFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRSxJQUFJLENBQUMsU0FBUztBQUNwQixtQkFBYSxFQUFiLGFBQWE7T0FDVixNQUFNLEVBQ1Q7R0FDSCxDQUFDO0NBQ0g7O0FBRUQsSUFBTSw4Q0FBOEMsZ0JBRW5ELENBQUM7O0FBRUssU0FBUyw4QkFBOEIsQ0FBRSxhQUFhLEVBQThEO01BQTVELFNBQVMseURBQUcsOENBQThDOztBQUN2SCxTQUFPO0FBQ0wsU0FBSyx1SkFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO0FBQ3JCLG1CQUFhLEVBQWIsYUFBYTtLQUNkLENBQUM7R0FDSCxDQUFDO0NBQ0g7O0FBRUQsSUFBTSw0QkFBNEIsNkJBR2pDLENBQUM7O0FBRUssU0FBUyxZQUFZLEdBQTRDO01BQTFDLFNBQVMseURBQUcsNEJBQTRCOztBQUNwRSxTQUFPO0FBQ0wsU0FBSyxvRUFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRSxJQUFJO0dBQ2IsQ0FBQztDQUNIOztBQUVELElBQU0sK0JBQStCLHNEQUtwQyxDQUFDOztBQUVLLFNBQVMsZUFBZSxHQUErQztNQUE3QyxTQUFTLHlEQUFHLCtCQUErQjs7QUFDMUUsU0FBTztBQUNMLFNBQUssMEVBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUUsSUFBSTtHQUNiLENBQUM7Q0FDSDs7QUFFRCxJQUFNLDZCQUE2QixHQUFHO0FBQ3BDLGFBQVcsa0JBRVY7QUFDRCx1QkFBcUIsNkJBR3BCO0NBQ0YsQ0FBQzs7QUFFSyxTQUFTLGFBQWEsQ0FBRSxhQUFhLEVBQUUsWUFBWSxFQUE2QztNQUEzQyxTQUFTLHlEQUFHLDZCQUE2Qjs7QUFDbkcsU0FBTztBQUNMLFNBQUssK0lBR0csU0FBUyxDQUFDLFdBQVcscUZBR3JCLFNBQVMsQ0FBQyxxQkFBcUIsK0JBR3RDO0FBQ0QsVUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDckIsbUJBQWEsRUFBYixhQUFhO0FBQ2Isa0JBQVksRUFBWixZQUFZO0tBQ2IsQ0FBQztHQUNILENBQUM7Q0FDSCIsImZpbGUiOiJxdWVyaWVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgZ2V0QXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIG5hbWUsXG4gIGNyZWF0ZWRBdCxcbiAgc291cmNlcyB7XG4gICAgX2lkLFxuICAgIGZpbGVuYW1lLFxuICAgIGV4dGVuc2lvblxuICB9XG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwbGljYXRpb24gKGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cyA9IGdldEFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBxdWVyeSBnZXRBcHBsaWNhdGlvbiAoJGFwcGxpY2F0aW9uSWQ6IFN0cmluZyEpIHtcbiAgICAgICAgYXBwbGljYXRpb24oX2lkOiAkYXBwbGljYXRpb25JZCkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGFwcGxpY2F0aW9uSWRcbiAgICB9KVxuICB9O1xufVxuXG5jb25zdCBnZXRBcHBsaWNhdGlvblNvdXJjZURlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgZmlsZW5hbWUsXG4gIGV4dGVuc2lvblxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcGxpY2F0aW9uU291cmNlIChzb3VyY2VJZCwgZnJhZ21lbnRzID0gZ2V0QXBwbGljYXRpb25Tb3VyY2VEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIHF1ZXJ5IGdldEFwcGxpY2F0aW9uU291cmNlICgkc291cmNlSWQ6IFN0cmluZyEpIHtcbiAgICAgICAgYXBwbGljYXRpb25Tb3VyY2UoX2lkOiAkc291cmNlSWQpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBzb3VyY2VJZFxuICAgIH0pXG4gIH07XG59XG5cbmNvbnN0IGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIHNvdXJjZXMsXG4gIHBhcmFtZXRlcnMsXG4gIGZpbmlzaGVkQXRcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zIChhcHBsaWNhdGlvbklkLCBwYXJhbXMsIGZyYWdtZW50cyA9IGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIHF1ZXJ5IGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnMgKCRhcHBsaWNhdGlvbklkOiBTdHJpbmchLCAkc29ydDogU3RyaW5nLCAkb3JkZXI6IFN0cmluZywgJGxpbWl0OiBJbnQsICRwYWdlOiBJbnQpIHtcbiAgICAgICAgYXBwbGljYXRpb25Qcm90ZWN0aW9ucyhfaWQ6ICRhcHBsaWNhdGlvbklkLCBzb3J0OiAkc29ydCwgb3JkZXI6ICRvcmRlciwgbGltaXQ6ICRsaW1pdCwgcGFnZTogJHBhZ2UpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhcHBsaWNhdGlvbklkLFxuICAgICAgLi4ucGFyYW1zXG4gICAgfSlcbiAgfTtcbn1cblxuY29uc3QgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uc0NvdW50RGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgY291bnRcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zQ291bnQgKGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cyA9IGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNDb3VudERlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgcXVlcnkgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uc0NvdW50ICgkYXBwbGljYXRpb25JZDogU3RyaW5nISkge1xuICAgICAgICBhcHBsaWNhdGlvblByb3RlY3Rpb25zQ291bnQoX2lkOiAkYXBwbGljYXRpb25JZCkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGFwcGxpY2F0aW9uSWRcbiAgICB9KVxuICB9O1xufVxuXG5jb25zdCBnZXRUZW1wbGF0ZXNEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIHBhcmFtZXRlcnNcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUZW1wbGF0ZXMgKGZyYWdtZW50cyA9IGdldFRlbXBsYXRlc0RlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgcXVlcnkgZ2V0VGVtcGxhdGVzIHtcbiAgICAgICAgdGVtcGxhdGVzIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiAne30nXG4gIH07XG59XG5cbmNvbnN0IGdldEFwcGxpY2F0aW9uc0RlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgbmFtZSxcbiAgcHJvdGVjdGlvbnMsXG4gIHBhcmFtZXRlcnNcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGlvbnMgKGZyYWdtZW50cyA9IGdldEFwcGxpY2F0aW9uc0RlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgcXVlcnkgZ2V0QXBwbGljYXRpb25zIHtcbiAgICAgICAgYXBwbGljYXRpb25zIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiAne30nXG4gIH07XG59XG5cbmNvbnN0IGdldFByb3RlY3Rpb25EZWZhdWx0RnJhZ21lbnRzID0ge1xuICBhcHBsaWNhdGlvbjogYFxuICAgIG5hbWVcbiAgYCxcbiAgYXBwbGljYXRpb25Qcm90ZWN0aW9uOiBgXG4gICAgX2lkLFxuICAgIHN0YXRlXG4gIGBcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm90ZWN0aW9uIChhcHBsaWNhdGlvbklkLCBwcm90ZWN0aW9uSWQsIGZyYWdtZW50cyA9IGdldFByb3RlY3Rpb25EZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIHF1ZXJ5IGdldFByb3RlY3Rpb24gKCRhcHBsaWNhdGlvbklkOiBTdHJpbmchLCAkcHJvdGVjdGlvbklkOiBTdHJpbmchKSB7XG4gICAgICAgIGFwcGxpY2F0aW9uIChfaWQ6ICRhcHBsaWNhdGlvbklkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHMuYXBwbGljYXRpb259XG4gICAgICAgIH1cbiAgICAgICAgYXBwbGljYXRpb25Qcm90ZWN0aW9uIChfaWQ6ICRwcm90ZWN0aW9uSWQpIHtcbiAgICAgICAgICAke2ZyYWdtZW50cy5hcHBsaWNhdGlvblByb3RlY3Rpb259XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgYXBwbGljYXRpb25JZCxcbiAgICAgIHByb3RlY3Rpb25JZFxuICAgIH0pXG4gIH07XG59XG4iXX0=
