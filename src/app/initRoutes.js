// load all of the dependencies asynchronously.
var paths = {
  jqueryGrockit: 'app/shared/jquery.grockit.js',
  restAngularFactory: 'app/api-requests/restAngular.service.js',
  restAngular: 'app/api-requests/restAngular.module.js',
  components: 'app/components/components.module.js',
  dashboard: 'app/dashboard/dashboard.module.js',
  practice: 'app/practices/practice.module.js',
  question: 'app/questions/question.module.js',
  analyticService: 'app/shared/services/analytic.service.js',
  authServices: 'app/shared/services/auth.services.js',
  appModule: 'app/application/application.module.js',
  appDirectives: 'app/components/application/application.directive.js',
  appController: 'app/application/application.ctrl.js',
  appFilters: 'app/application/application.filters.js',
  utilServices: 'app/application/util.services.js',
  appServices: 'app/application/application.services.js',
  practiceSrv: 'app/shared/services/practice.service.js',
  practiceUtils: 'app/shared/services/practice.utils.js',
  historyM: 'app/history/history.module.js',
  questionReview: 'app/question-review/question-review.module.js',
  app: 'app/app.js'
};


$script([paths.jqueryGrockit,
  paths.appModule,
  paths.components,
  paths.restAngular,
  paths.analyticService
], 'init').ready('init', function() {
  $script([
    paths.appFilters,
    paths.appDirectives,
    paths.utilServices,
    paths.appServices,
    paths.authServices,
    paths.appController,
    paths.restAngularFactory,
    paths.practiceSrv,
  ], 'secondLoad').ready('secondLoad', function() {
    $script([
      paths.historyM,
      paths.dashboard,
      paths.practiceUtils,
      paths.practice,
      paths.question,
      paths.questionReview,
      paths.app
    ], function() {
      angular.element(document).ready(function() {
        angular.bootstrap(document, ['grockitApp']);
      });
    });
  })

})
