/**
 * Created by Jose on 5/8/14.
 */
// load all of the dependencies asynchronously.

var paths={
    underscore:'common/lib/underscore.js',
    home:'app/home/home.module.js',
    practice:'app/practice/practice.module.js',
    app:'app/app.js',
    homeCtrl:'app/home/home.ctrl.js',
    generalService:'common/components/general.service.js'
};
$script([
    paths.underscore,
    paths.home,
    paths.practice,
    paths.app,
    paths.homeCtrl,
    paths.generalService
], function() {
    angular.bootstrap(document, ['gRockitApp']);
});