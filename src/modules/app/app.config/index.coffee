module.exports = angular.module('grockitApp.config', [])
  .provider('ApiUrls', require('./apiurls'))
  .config(require('./config'))