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
  app: 'app/app.js',
  practiceSrv: 'app/shared/services/practice.service.js',
  practiceUtils: 'app/shared/services/practice.utils.js',
  uiBootStrap: 'app/components/accordion/vendor/ui.bootstrap.min.js',
  accordion: 'app/components/accordion/accordion.js',
  historyM: 'app/history/history.module.js',
  questionReview: 'app/question-review/question-review.module.js'

};
$script([
  paths.jqueryGrockit,
  paths.authServices,
  paths.components,
  paths.appModule,
  paths.restAngular,
  paths.analyticService
], function() {
  $script([
    paths.utilServices,
    paths.appServices,
    paths.appFilters,
    paths.appDirectives,
    paths.appController,
    paths.restAngularFactory,
    paths.practiceSrv,
    paths.uiBootStrap
  ], 'init')

  .ready('init', function() {
    $script([
      paths.accordion,
      paths.dashboard,
      paths.practiceUtils,
      paths.practice,
      paths.question,
      paths.historyM,
      paths.questionReview,
      paths.app
    ], function() {
      angular.element(document).ready(function() {
        angular.bootstrap(document, ['grockitApp']);
      });
    });
  });
});
