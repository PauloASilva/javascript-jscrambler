'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getApplication = getApplication;
exports.getApplicationSource = getApplicationSource;
exports.getTemplates = getTemplates;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9xdWVyaWVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsSUFBTSw4QkFBOEIsZ0dBU25DLENBQUM7O0FBRUssU0FBUyxjQUFjLENBQUUsYUFBYSxFQUE4QztNQUE1QyxTQUFTLHlEQUFHLDhCQUE4Qjs7QUFDdkYsU0FBTztBQUNMLFNBQUssdUhBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNyQixtQkFBYSxFQUFiLGFBQWE7S0FDZCxDQUFDO0dBQ0gsQ0FBQztDQUNIOztBQUVELElBQU0sb0NBQW9DLHlDQUl6QyxDQUFDOztBQUVLLFNBQVMsb0JBQW9CLENBQUUsUUFBUSxFQUFvRDtNQUFsRCxTQUFTLHlEQUFHLG9DQUFvQzs7QUFDOUYsU0FBTztBQUNMLFNBQUsseUhBR0csU0FBUywrQkFHaEI7QUFDRCxVQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztBQUNyQixjQUFRLEVBQVIsUUFBUTtLQUNULENBQUM7R0FDSCxDQUFDO0NBQ0g7O0FBRUQsSUFBTSw0QkFBNEIsNkJBR2pDLENBQUM7O0FBRUssU0FBUyxZQUFZLEdBQTRDO01BQTFDLFNBQVMseURBQUcsNEJBQTRCOztBQUNwRSxTQUFPO0FBQ0wsU0FBSyxvRUFHRyxTQUFTLCtCQUdoQjtBQUNELFVBQU0sRUFBRSxJQUFJO0dBQ2IsQ0FBQTtDQUNGIiwiZmlsZSI6InF1ZXJpZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBnZXRBcHBsaWNhdGlvbkRlZmF1bHRGcmFnbWVudHMgPSBgXG4gIF9pZCxcbiAgbmFtZSxcbiAgY3JlYXRlZEF0LFxuICBzb3VyY2VzIHtcbiAgICBfaWQsXG4gICAgZmlsZW5hbWUsXG4gICAgZXh0ZW5zaW9uXG4gIH1cbmA7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHBsaWNhdGlvbiAoYXBwbGljYXRpb25JZCwgZnJhZ21lbnRzID0gZ2V0QXBwbGljYXRpb25EZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIHF1ZXJ5IGdldEFwcGxpY2F0aW9uICgkYXBwbGljYXRpb25JZDogU3RyaW5nISkge1xuICAgICAgICBhcHBsaWNhdGlvbihfaWQ6ICRhcHBsaWNhdGlvbklkKSB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgYXBwbGljYXRpb25JZFxuICAgIH0pXG4gIH07XG59XG5cbmNvbnN0IGdldEFwcGxpY2F0aW9uU291cmNlRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBmaWxlbmFtZSxcbiAgZXh0ZW5zaW9uXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwbGljYXRpb25Tb3VyY2UgKHNvdXJjZUlkLCBmcmFnbWVudHMgPSBnZXRBcHBsaWNhdGlvblNvdXJjZURlZmF1bHRGcmFnbWVudHMpIHtcbiAgcmV0dXJuIHtcbiAgICBxdWVyeTogYFxuICAgICAgcXVlcnkgZ2V0QXBwbGljYXRpb25Tb3VyY2UgKCRzb3VyY2VJZDogU3RyaW5nISkge1xuICAgICAgICBhcHBsaWNhdGlvblNvdXJjZShfaWQ6ICRzb3VyY2VJZCkge1xuICAgICAgICAgICR7ZnJhZ21lbnRzfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgYCxcbiAgICBwYXJhbXM6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHNvdXJjZUlkXG4gICAgfSlcbiAgfTtcbn1cblxuY29uc3QgZ2V0VGVtcGxhdGVzRGVmYXVsdEZyYWdtZW50cyA9IGBcbiAgX2lkLFxuICBwYXJhbWV0ZXJzXG5gO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGVtcGxhdGVzIChmcmFnbWVudHMgPSBnZXRUZW1wbGF0ZXNEZWZhdWx0RnJhZ21lbnRzKSB7XG4gIHJldHVybiB7XG4gICAgcXVlcnk6IGBcbiAgICAgIHF1ZXJ5IGdldFRlbXBsYXRlcyB7XG4gICAgICAgIHRlbXBsYXRlcyB7XG4gICAgICAgICAgJHtmcmFnbWVudHN9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBgLFxuICAgIHBhcmFtczogJ3t9J1xuICB9XG59XG4iXX0=
