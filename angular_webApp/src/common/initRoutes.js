/**
 * Created by Jose on 5/8/14.
 */
// load all of the dependencies asynchronously.

var paths={
    jqueryGrockit:'common/jquery.grockit.js',
    underscore:'common/lib/underscore.js',
    restAngularFactory:'common/restAngular/restAngular.service.js',
    restAngular:'common/restAngular/restAngular.module.js',
    home:'app/home/home.module.js',
    subjects:'app/subjects/subjects.module.js',
    app:'app/app.js'//,
    //homeCtrl:'app/home/home.ctrl.js'
};

$script([
    paths.underscore,
    paths.restAngular,
    paths.home,
    paths.subjects,
    paths.app
],'init')

    .ready('init', function(){
        $script([
            paths.restAngularFactory,
            //paths.homeCtrl,
            paths.jqueryGrockit
        ], function() {
            angular.bootstrap(document, ['grockitApp']);
        });
    });