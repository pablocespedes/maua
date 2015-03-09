// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      'src/lib/scripts.js',
      'src/bower_components/jquery/dist/jquery.min.js',
      'src/bower_components/angular/angular.js',
      'src/bower_components/angular-mocks/angular-mocks.js',
      'src/bower_components/angular-resource/angular-resource.js',
      'src/bower_components/angular-cookies/angular-cookies.js',
      'src/bower_components/angular-sanitize/angular-sanitize.js',
      'src/bower_components/ng-breadcrumbs/dist/ng-breadcrumbs.min.js',
      'src/bower_components/webStorageModule/angular-webstorage.js',
      'src/bower_components/angular-route/angular-route.js',
      'src/bower_components/ng-device-detector/ng-device-detector.js',
      'src/bower_components/lodash/dist/lodash.min.js',
      'src/bower_components/restangular/dist/restangular.min.js',


      'src/app/initRoutes.js',
      'src/app/api-requests/restAngular.module.js',
      'src/app/application/application.module.js',
      'src/app/components/components.module.js',
      'src/app/shared/services/practice.service.js',
      'src/app/dashboard/dashboard.module.js',
      'src/app/dashboard/sDashboard.ctrl.js',
      'src/app/history/history.module.js',
      'src/app/questions/question.module.js',
      'src/app/question-review/question-review.module.js',
      'src/app/practices/practice.module.js',
      'src/app/**/*.js',
      'src/app/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    'src/app/shared/socialMedia.scripts.js',
    'src/app/shared/jquery.grockit.js',
    'test/spec/spec.js'
    ],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
