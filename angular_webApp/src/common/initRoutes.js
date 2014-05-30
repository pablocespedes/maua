/**
 * Created by Jose on 5/8/14.
 */
// load all of the dependencies asynchronously.

var paths={
    jqueryGrockit:'common/components/jquery.grockit.js',
    underscore:'common/lib/underscore.js',
    requestFactory:'app/requests/requests.factory.js',
    requests:'app/requests/requests.module.js',
    home:'app/home/home.module.js',
    practice:'app/practice/practice.module.js',
    app:'app/app.js',
    homeCtrl:'app/home/home.ctrl.js'
};

$script([
    paths.underscore,
    paths.requests,
    paths.home,
    paths.practice,
    paths.app
],'init')

    .ready('init', function(){
        $script([
            paths.requestFactory,
            paths.homeCtrl,
            paths.jqueryGrockit
        ], function() {
            angular.bootstrap(document, ['grockitApp']);
        });
    });