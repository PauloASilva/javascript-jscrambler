'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _rc = require('rc');

var _rc2 = _interopRequireDefault(_rc);

try {
  // Load RC configuration if present. Pass `[]` as last argument to avoid
  // getting variables from `argv`.
  var config = (0, _rc2['default'])('jscrambler', {
    keys: {},
    host: 'api.jscrambler.com',
    port: 443,
    apiVersion: 3
  }, []);

  module.exports = config;
} catch (error) {
  module.exports = {};
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztrQkFBZSxJQUFJOzs7O0FBRW5CLElBQUk7OztBQUdGLE1BQUksTUFBTSxHQUFHLHFCQUFHLFlBQVksRUFBRTtBQUM1QixRQUFJLEVBQUUsRUFBRTtBQUNSLFFBQUksRUFBRSxvQkFBb0I7QUFDMUIsUUFBSSxFQUFFLEdBQUc7QUFDVCxjQUFVLEVBQUUsQ0FBQztHQUNkLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRVAsUUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Q0FDekIsQ0FBQyxPQUFPLEtBQUssRUFBRTtBQUNkLFFBQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0NBQ3JCIiwiZmlsZSI6ImNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByYyBmcm9tICdyYyc7XG5cbnRyeSB7XG4gIC8vIExvYWQgUkMgY29uZmlndXJhdGlvbiBpZiBwcmVzZW50LiBQYXNzIGBbXWAgYXMgbGFzdCBhcmd1bWVudCB0byBhdm9pZFxuICAvLyBnZXR0aW5nIHZhcmlhYmxlcyBmcm9tIGBhcmd2YC5cbiAgdmFyIGNvbmZpZyA9IHJjKCdqc2NyYW1ibGVyJywge1xuICAgIGtleXM6IHt9LFxuICAgIGhvc3Q6ICdhcGkuanNjcmFtYmxlci5jb20nLFxuICAgIHBvcnQ6IDQ0MyxcbiAgICBhcGlWZXJzaW9uOiAzXG4gIH0sIFtdKTtcblxuICBtb2R1bGUuZXhwb3J0cyA9IGNvbmZpZztcbn0gY2F0Y2ggKGVycm9yKSB7XG4gIG1vZHVsZS5leHBvcnRzID0ge307XG59XG4iXX0=
