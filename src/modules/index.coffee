'use strict'

###
browserify-shim dependencies (can be edited in package.json)
###

global.jQuery = require('jquery')
global.$ = require('jquery')## client-side code dependency

require 'angular'
global._ = require "lodash"
require 'angular-ui-router'
require 'angular-messages'
require 'satellizer'
require 'restangular'
require 'bootstrap-sass'
require 'select2'
require 'pixel-admin'
require 'youtube-modal'
##require 'masonry-package'
##require 'image-loaded'
#require 'masonry'
#require 'chardinjs'
###
app entry point
###
require './app'

angular.element(document).ready ->
  angular.bootstrap document, ["grockitApp"]
  return
#ng-app='grockitApp'
