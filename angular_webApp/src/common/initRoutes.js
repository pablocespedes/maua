/**
 * Created by Jose on 5/8/14.
 */
// load all of the dependencies asynchronously.
$script([
    'common/lib/underscore.js',
    'app/home/home.module.js',
    'app/practice/practice.module.js',
    'app/app.js',
    'common/components/general.service.js'
], function() {
    angular.bootstrap(document, ['gRockitApp']);
});