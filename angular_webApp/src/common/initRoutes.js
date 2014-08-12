// load all of the dependencies asynchronously.

var paths={
    jqueryGrockit:'common/jquery.grockit.js',
    underscore:'common/lib/underscore.js',
    restAngularFactory:'common/restAngular/restAngular.service.js',
    restAngular:'common/restAngular/restAngular.module.js',
    home:'app/home/home.module.js',
    practiceGame:'app/practiceGame/practiceGame.module.js',
    generalServices:'common/services/application.services.js',
    generalFilters:'common/filters/application.filters.js',
    analyticService: 'common/services/analytic.service.js',
    generalDirectives:'common/directives/general.directive.js',
    authServices:'common/services/auth.services.js',
    accountCtrl:'app/account/application.ctrl.js',
    app:'app/app.js'
    // dev: 'dev/dev.ctrl.js'
};

$script([
    paths.underscore,
    paths.jqueryGrockit,
    paths.generalServices,
    paths.generalFilters,
    paths.analyticService,
    paths.generalDirectives,
    paths.restAngular,
    paths.home,
    paths.practiceGame,
    paths.authServices,
    paths.app
],'init')

    .ready('init', function() {
		$script([
				paths.restAngularFactory,
				paths.accountCtrl
		], function () {
				angular.bootstrap(document, ['grockitApp']);
		});
});
