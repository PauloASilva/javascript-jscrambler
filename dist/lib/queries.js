'use strict';

Object.defineProperty(exports, "__esModule", {
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
  var limits = arguments[2];

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvcXVlcmllcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQVdnQixjLEdBQUEsYztRQXFCQSxvQixHQUFBLG9CO1FBdUJBLHlCLEdBQUEseUI7UUFvQkEsOEIsR0FBQSw4QjtRQW9CQSxZLEdBQUEsWTtRQW9CQSxlLEdBQUEsZTtRQXVCQSxhLEdBQUEsYTtBQTFJaEIsSUFBTSw4SEFBTjs7QUFXTyxTQUFTLGNBQVQsQ0FBeUIsYUFBekIsRUFBb0Y7QUFBQSxNQUE1QyxTQUE0Qyx5REFBaEMsOEJBQWdDOztBQUN6RixTQUFPO0FBQ0wsZ0lBR1EsU0FIUiwrQkFESztBQVFMLFlBQVEsS0FBSyxTQUFMLENBQWU7QUFDckI7QUFEcUIsS0FBZjtBQVJILEdBQVA7QUFZRDs7QUFFRCxJQUFNLDZFQUFOOztBQU1PLFNBQVMsb0JBQVQsQ0FBK0IsUUFBL0IsRUFBbUc7QUFBQSxNQUExRCxTQUEwRCx5REFBOUMsb0NBQThDO0FBQUEsTUFBUixNQUFROztBQUN4RyxTQUFPO0FBQ0wsZ1BBR1EsU0FIUiwrQkFESztBQVFMLFlBQVEsS0FBSyxTQUFMO0FBQ047QUFETSxPQUVILE1BRkc7QUFSSCxHQUFQO0FBYUQ7O0FBRUQsSUFBTSxpR0FBTjs7QUFPTyxTQUFTLHlCQUFULENBQW9DLGFBQXBDLEVBQW1ELE1BQW5ELEVBQWtIO0FBQUEsTUFBdkQsU0FBdUQseURBQTNDLHlDQUEyQzs7QUFDdkgsU0FBTztBQUNMLHNRQUdRLFNBSFIsK0JBREs7QUFRTCxZQUFRLEtBQUssU0FBTDtBQUNOO0FBRE0sT0FFSCxNQUZHO0FBUkgsR0FBUDtBQWFEOztBQUVELElBQU0sOERBQU47O0FBSU8sU0FBUyw4QkFBVCxDQUF5QyxhQUF6QyxFQUFvSDtBQUFBLE1BQTVELFNBQTRELHlEQUFoRCw4Q0FBZ0Q7O0FBQ3pILFNBQU87QUFDTCxnS0FHUSxTQUhSLCtCQURLO0FBUUwsWUFBUSxLQUFLLFNBQUwsQ0FBZTtBQUNyQjtBQURxQixLQUFmO0FBUkgsR0FBUDtBQVlEOztBQUVELElBQU0seURBQU47O0FBS08sU0FBUyxZQUFULEdBQWlFO0FBQUEsTUFBMUMsU0FBMEMseURBQTlCLDRCQUE4Qjs7QUFDdEUsU0FBTztBQUNMLDZFQUdRLFNBSFIsK0JBREs7QUFRTCxZQUFRO0FBUkgsR0FBUDtBQVVEOztBQUVELElBQU0scUZBQU47O0FBT08sU0FBUyxlQUFULEdBQXVFO0FBQUEsTUFBN0MsU0FBNkMseURBQWpDLCtCQUFpQzs7QUFDNUUsU0FBTztBQUNMLG1GQUdRLFNBSFIsK0JBREs7QUFRTCxZQUFRO0FBUkgsR0FBUDtBQVVEOztBQUVELElBQU0sZ0NBQWdDO0FBQ3BDLCtCQURvQztBQUlwQztBQUpvQyxDQUF0Qzs7QUFVTyxTQUFTLGFBQVQsQ0FBd0IsYUFBeEIsRUFBdUMsWUFBdkMsRUFBZ0c7QUFBQSxNQUEzQyxTQUEyQyx5REFBL0IsNkJBQStCOztBQUNyRyxTQUFPO0FBQ0wsd0pBR1EsVUFBVSxXQUhsQixxRkFNUSxVQUFVLHFCQU5sQiwrQkFESztBQVdMLFlBQVEsS0FBSyxTQUFMLENBQWU7QUFDckIsa0NBRHFCO0FBRXJCO0FBRnFCLEtBQWY7QUFYSCxHQUFQO0FBZ0JEIiwiZmlsZSI6InF1ZXJpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBnZXRBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgbmFtZSxcbiAgY3JlYXRlZEF0LFxuICBzb3VyY2VzIHtcbiAgICBfaWQsXG4gICAgZmlsZW5hbWUsXG4gICAgZXh0ZW5zaW9uXG4gIH1cbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGlvbiAoYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzID0gZ2V0QXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIHF1ZXJ5IGdldEFwcGxpY2F0aW9uICgkYXBwbGljYXRpb25JZDogU3RyaW5nISkge1xuICAgICAgICBhcHBsaWNhdGlvbihfaWQ6ICRhcHBsaWNhdGlvbklkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgYXBwbGljYXRpb25JZFxuICAgIH0pXG4gIH07XG59XG5cbmNvbnN0IGdldEFwcGxpY2F0aW9uU291cmNlRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBmaWxlbmFtZSxcbiAgZXh0ZW5zaW9uXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwbGljYXRpb25Tb3VyY2UgKHNvdXJjZUlkLCBmcmFnbWVudHMgPSBnZXRBcHBsaWNhdGlvblNvdXJjZURlZmF1bHRGcmFnbWVudHMsIGxpbWl0cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBxdWVyeSBnZXRBcHBsaWNhdGlvblNvdXJjZSAoJHNvdXJjZUlkOiBTdHJpbmchLCAkY29udGVudExpbWl0OiBJbnQsICR0cmFuc2Zvcm1lZExpbWl0OiBJbnQpIHtcbiAgICAgICAgYXBwbGljYXRpb25Tb3VyY2UoX2lkOiAkc291cmNlSWQsIGNvbnRlbnRMaW1pdDogJGNvbnRlbnRMaW1pdCwgdHJhbnNmb3JtZWRMaW1pdDogJHRyYW5zZm9ybWVkTGltaXQpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBzb3VyY2VJZCxcbiAgICAgIC4uLmxpbWl0c1xuICAgIH0pXG4gIH07XG59XG5cbmNvbnN0IGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIHNvdXJjZXMsXG4gIHBhcmFtZXRlcnMsXG4gIGZpbmlzaGVkQXRcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zIChhcHBsaWNhdGlvbklkLCBwYXJhbXMsIGZyYWdtZW50cyA9IGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIHF1ZXJ5IGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnMgKCRhcHBsaWNhdGlvbklkOiBTdHJpbmchLCAkc29ydDogU3RyaW5nLCAkb3JkZXI6IFN0cmluZywgJGxpbWl0OiBJbnQsICRwYWdlOiBJbnQpIHtcbiAgICAgICAgYXBwbGljYXRpb25Qcm90ZWN0aW9ucyhfaWQ6ICRhcHBsaWNhdGlvbklkLCBzb3J0OiAkc29ydCwgb3JkZXI6ICRvcmRlciwgbGltaXQ6ICRsaW1pdCwgcGFnZTogJHBhZ2UpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhcHBsaWNhdGlvbklkLFxuICAgICAgLi4ucGFyYW1zXG4gICAgfSlcbiAgfTtcbn1cblxuY29uc3QgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uc0NvdW50RGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgY291bnRcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGlvblByb3RlY3Rpb25zQ291bnQgKGFwcGxpY2F0aW9uSWQsIGZyYWdtZW50cyA9IGdldEFwcGxpY2F0aW9uUHJvdGVjdGlvbnNDb3VudERlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgcXVlcnkgZ2V0QXBwbGljYXRpb25Qcm90ZWN0aW9uc0NvdW50ICgkYXBwbGljYXRpb25JZDogU3RyaW5nISkge1xuICAgICAgICBhcHBsaWNhdGlvblByb3RlY3Rpb25zQ291bnQoX2lkOiAkYXBwbGljYXRpb25JZCkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIGFwcGxpY2F0aW9uSWRcbiAgICB9KVxuICB9O1xufVxuXG5jb25zdCBnZXRUZW1wbGF0ZXNEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIHBhcmFtZXRlcnNcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUZW1wbGF0ZXMgKGZyYWdtZW50cyA9IGdldFRlbXBsYXRlc0RlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgcXVlcnkgZ2V0VGVtcGxhdGVzIHtcbiAgICAgICAgdGVtcGxhdGVzIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiAne30nXG4gIH07XG59XG5cbmNvbnN0IGdldEFwcGxpY2F0aW9uc0RlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgbmFtZSxcbiAgcHJvdGVjdGlvbnMsXG4gIHBhcmFtZXRlcnNcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGlvbnMgKGZyYWdtZW50cyA9IGdldEFwcGxpY2F0aW9uc0RlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgcXVlcnkgZ2V0QXBwbGljYXRpb25zIHtcbiAgICAgICAgYXBwbGljYXRpb25zIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiAne30nXG4gIH07XG59XG5cbmNvbnN0IGdldFByb3RlY3Rpb25EZWZhdWx0RnJhZ21lbnRzID0ge1xuICBhcHBsaWNhdGlvbjogYFxuICAgIG5hbWVcbiAgYCxcbiAgYXBwbGljYXRpb25Qcm90ZWN0aW9uOiBgXG4gICAgX2lkLFxuICAgIHN0YXRlXG4gIGBcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQcm90ZWN0aW9uIChhcHBsaWNhdGlvbklkLCBwcm90ZWN0aW9uSWQsIGZyYWdtZW50cyA9IGdldFByb3RlY3Rpb25EZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIHF1ZXJ5IGdldFByb3RlY3Rpb24gKCRhcHBsaWNhdGlvbklkOiBTdHJpbmchLCAkcHJvdGVjdGlvbklkOiBTdHJpbmchKSB7XG4gICAgICAgIGFwcGxpY2F0aW9uIChfaWQ6ICRhcHBsaWNhdGlvbklkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHMuYXBwbGljYXRpb259XG4gICAgICAgIH1cbiAgICAgICAgYXBwbGljYXRpb25Qcm90ZWN0aW9uIChfaWQ6ICRwcm90ZWN0aW9uSWQpIHtcbiAgICAgICAgICAke2ZyYWdtZW50cy5hcHBsaWNhdGlvblByb3RlY3Rpb259XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgYXBwbGljYXRpb25JZCxcbiAgICAgIHByb3RlY3Rpb25JZFxuICAgIH0pXG4gIH07XG59XG4iXX0=
