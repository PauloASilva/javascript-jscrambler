'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getApplication = getApplication;
exports.getApplicationSource = getApplicationSource;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9xdWVyaWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLElBQU0sOEJBQThCLGdHQVNuQyxDQUFDOztBQUVLLFNBQVMsY0FBYyxDQUFFLGFBQWEsRUFBOEM7TUFBNUMsU0FBUyx5REFBRyw4QkFBOEI7O0FBQ3ZGLFNBQU87QUFDTCxTQUFLLHVIQUdHLFNBQVMsK0JBR2hCO0FBQ0QsVUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDckIsbUJBQWEsRUFBYixhQUFhO0tBQ2QsQ0FBQztHQUNILENBQUM7Q0FDSDs7QUFFRCxJQUFNLG9DQUFvQyx5Q0FJekMsQ0FBQzs7QUFFSyxTQUFTLG9CQUFvQixDQUFFLFFBQVEsRUFBb0Q7TUFBbEQsU0FBUyx5REFBRyxvQ0FBb0M7O0FBQzlGLFNBQU87QUFDTCxTQUFLLHlIQUdHLFNBQVMsK0JBR2hCO0FBQ0QsVUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7QUFDckIsY0FBUSxFQUFSLFFBQVE7S0FDVCxDQUFDO0dBQ0gsQ0FBQztDQUNIOztBQUVELElBQU0sNEJBQTRCLDZCQUdqQyxDQUFDOztBQUVLLFNBQVMsWUFBWSxHQUE0QztNQUExQyxTQUFTLHlEQUFHLDRCQUE0Qjs7QUFDcEUsU0FBTztBQUNMLFNBQUssb0VBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUUsSUFBSTtHQUNiLENBQUE7Q0FDRjs7QUFFRCxJQUFNLCtCQUErQixzREFLcEMsQ0FBQzs7QUFFSyxTQUFTLGVBQWUsR0FBK0M7TUFBN0MsU0FBUyx5REFBRywrQkFBK0I7O0FBQzFFLFNBQU87QUFDTCxTQUFLLDBFQUdHLFNBQVMsK0JBR2hCO0FBQ0QsVUFBTSxFQUFFLElBQUk7R0FDYixDQUFBO0NBQ0YiLCJmaWxlIjoicXVlcmllcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IGdldEFwcGxpY2F0aW9uRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBuYW1lLFxuICBjcmVhdGVkQXQsXG4gIHNvdXJjZXMge1xuICAgIF9pZCxcbiAgICBmaWxlbmFtZSxcbiAgICBleHRlbnNpb25cbiAgfVxuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcGxpY2F0aW9uIChhcHBsaWNhdGlvbklkLCBmcmFnbWVudHMgPSBnZXRBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgcXVlcnkgZ2V0QXBwbGljYXRpb24gKCRhcHBsaWNhdGlvbklkOiBTdHJpbmchKSB7XG4gICAgICAgIGFwcGxpY2F0aW9uKF9pZDogJGFwcGxpY2F0aW9uSWQpIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICBhcHBsaWNhdGlvbklkXG4gICAgfSlcbiAgfTtcbn1cblxuY29uc3QgZ2V0QXBwbGljYXRpb25Tb3VyY2VEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIGZpbGVuYW1lLFxuICBleHRlbnNpb25cbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGlvblNvdXJjZSAoc291cmNlSWQsIGZyYWdtZW50cyA9IGdldEFwcGxpY2F0aW9uU291cmNlRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBxdWVyeSBnZXRBcHBsaWNhdGlvblNvdXJjZSAoJHNvdXJjZUlkOiBTdHJpbmchKSB7XG4gICAgICAgIGFwcGxpY2F0aW9uU291cmNlKF9pZDogJHNvdXJjZUlkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgc291cmNlSWRcbiAgICB9KVxuICB9O1xufVxuXG5jb25zdCBnZXRUZW1wbGF0ZXNEZWZhdWx0RnJhZ21lbnRzID0gYFxuICBfaWQsXG4gIHBhcmFtZXRlcnNcbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUZW1wbGF0ZXMgKGZyYWdtZW50cyA9IGdldFRlbXBsYXRlc0RlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgcXVlcnkgZ2V0VGVtcGxhdGVzIHtcbiAgICAgICAgdGVtcGxhdGVzIHtcbiAgICAgICAgICAke2ZyYWdtZW50c31cbiAgICAgICAgfVxuICAgICAgfVxuICAgIGAsXG4gICAgcGFyYW1zOiAne30nXG4gIH1cbn1cblxuY29uc3QgZ2V0QXBwbGljYXRpb25zRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBuYW1lLFxuICBwcm90ZWN0aW9ucyxcbiAgcGFyYW1ldGVyc1xuYDtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcGxpY2F0aW9ucyAoZnJhZ21lbnRzID0gZ2V0QXBwbGljYXRpb25zRGVmYXVsdEZyYWdtZW50cykge1xuICByZXR1cm4ge1xuICAgIHF1ZXJ5OiBgXG4gICAgICBxdWVyeSBnZXRBcHBsaWNhdGlvbnMge1xuICAgICAgICBhcHBsaWNhdGlvbnMge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6ICd7fSdcbiAgfVxufVxuIl19
