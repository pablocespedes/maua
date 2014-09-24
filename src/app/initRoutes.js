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
  appServices: 'app/application/application.services.js',
  app: 'app/app.js',
  practiceSrv: 'app/shared/services/practice.service.js',
  uiBootStrap: 'app/components/accordion/vendor/ui.bootstrap.min.js',
  accordion : 'app/components/accordion/accordion.js',
  historyM: 'app/history/history.module.js'

};

$script([
  paths.jqueryGrockit,
  paths.authServices,
  paths.components,
  paths.appModule,
  paths.restAngular,
  paths.analyticService
  ], 'init')

.ready('init', function() {
  $script([
    paths.appServices,
    paths.appFilters,
    paths.appDirectives,
    paths.appController,
    paths.restAngularFactory,
    paths.uiBootStrap,
    paths.accordion,
    paths.dashboard,
    paths.practiceSrv,
    paths.practice,
    paths.question,
    paths.historyM,
    paths.app
    ], function() {
      angular.element(document).ready(function() {
        angular.bootstrap(document, ['grockitApp']);
      });
      });
});
