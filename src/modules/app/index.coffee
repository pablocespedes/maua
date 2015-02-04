'use strict'

module.exports = angular.module('grockitApp', [
  'ui.router'
  'ngMessages'
  'satellizer'
  'restangular'
  require('../../../tmp/templates').name
  require('./application/index').name
  require('./account/register/index').name
  require('./account/logout/index').name
  require('./account/login/index').name
  require('./dashboard/index').name
])
.constant "apiUrl", 'http://localhost:3000/'
.config(require('./main/index.config'))
# .run(($window) ->
#   params = $window.location.search.substring(1)

#   if params and $window.opener and $window.opener.location.origin is
#    $window.location.origin
#     console.log $window
#     pair = params.split("=")
#     code = decodeURIComponent(pair[1])
#     $window.opener.postMessage code, $window.location.origin
#   return)

