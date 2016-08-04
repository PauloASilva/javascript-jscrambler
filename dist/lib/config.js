'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _rc = require('rc');

var _rc2 = _interopRequireDefault(_rc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Load RC configuration if present. Pass `[]` as last argument to avoid
// getting variables from `argv`.
var config = (0, _rc2.default)('jscrambler', {
  keys: {},
  host: 'api4.jscrambler.com',
  port: 443
}, []);

exports.default = config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvY29uZmlnLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7Ozs7QUFFQTtBQUNBO0FBQ0EsSUFBTSxTQUFTLGtCQUFHLFlBQUgsRUFBaUI7QUFDOUIsUUFBTSxFQUR3QjtBQUU5QixRQUFNLHFCQUZ3QjtBQUc5QixRQUFNO0FBSHdCLENBQWpCLEVBSVosRUFKWSxDQUFmOztrQkFNZSxNIiwiZmlsZSI6ImNvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByYyBmcm9tICdyYyc7XG5cbi8vIExvYWQgUkMgY29uZmlndXJhdGlvbiBpZiBwcmVzZW50LiBQYXNzIGBbXWAgYXMgbGFzdCBhcmd1bWVudCB0byBhdm9pZFxuLy8gZ2V0dGluZyB2YXJpYWJsZXMgZnJvbSBgYXJndmAuXG5jb25zdCBjb25maWcgPSByYygnanNjcmFtYmxlcicsIHtcbiAga2V5czoge30sXG4gIGhvc3Q6ICdhcGk0LmpzY3JhbWJsZXIuY29tJyxcbiAgcG9ydDogNDQzXG59LCBbXSk7XG5cbmV4cG9ydCBkZWZhdWx0IGNvbmZpZztcbiJdfQ==
