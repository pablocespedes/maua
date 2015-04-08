'use strict'

###
browserify-shim dependencies (can be edited in package.json)
###
global.$ = global.jQuery = require("jquery")

require 'angular'
require 'angular-animate'
require 'angular-aria'
require 'angular-material'
require 'angular-ui-router'
require 'angular-sanitize'
require 'angular-messages'
global._ = require "lodash"
require 'satellizer'
require 'restangular'
require 'angular-resource'
###
app entry point
###
require './app'
angular.element(document).ready ->
  angular.bootstrap document, ["grockitApp"]
  return