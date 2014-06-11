// load all of the dependencies asynchronously.

var paths={
    jqueryGrockit:'common/jquery.grockit.js',
    underscore:'common/lib/underscore.js',
    restAngularFactory:'common/restAngular/restAngular.service.js',
    restAngular:'common/restAngular/restAngular.module.js',
    home:'app/home/home.module.js',
    practiceGame:'app/practiceGame/practiceGame.module.js',
    app:'app/app.js',
    generalDrctv:'common/directives/general.directive.js'
};

$script([
    paths.underscore,
    paths.restAngular,
    paths.home,
    paths.practiceGame,
    paths.app
],'init')

    .ready('init', function(){
        $script([
            paths.restAngularFactory,
            //paths.generalDrctv,
            paths.jqueryGrockit
        ], function() {
            angular.bootstrap(document, ['grockitApp']);
        });
    });