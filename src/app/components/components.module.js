'use strict';

angular.module("grockitApp.components",[])
.config(function ($compileProvider) {
  angular.module("grockitApp.components").directive = $compileProvider.directive;

});

