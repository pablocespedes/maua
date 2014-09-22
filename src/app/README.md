# The `src/app` Directory

## Overview

```
src/
  |- app/
  |  |- home/
  |  |- about/
  |  |- app.js
  |  |- app.spec.js
```

The `src/app` directory contains all code specific to this application. Apart
from `app.js`, this directory is filled with subdirectories corresponding to high-level sections or
features of the application, often corresponding to top-level routes. Each directory can have as
many subdirectories as it needs, and the build system will understand what to
do.

As `ngBoilerplate` is quite minimal, take a look at the two provided submodules
to gain a better understanding of how these are used as well as to get a
glimpse of how powerful this simple construct can be.

## `app.js`

This is our main app configuration file. It kickstarts the whole process by
requiring all the modules from `src/app` that we need. We must load these now to
ensure the routes are loaded. If as in our "practice" example there are
subroutes, we only require the top-level module, and allow the submodules to
require their own submodules.

However, the modules from `src/common` should be required by the app
submodules that need them to ensure proper dependency handling. These are
app-wide dependencies that are required to assemble your app.

```js
angular.module( 'grockitApp', [
   'grockitApp.practiceGame',
   'grockitApp.home',
   'grockitApp.directives'
])
```

With app modules broken down in this way, all routing is performed by the
submodules we include, as that is where our app's functionality is really
defined.  So all we need to do in `app.js` is specify a default route to follow,
which route of course is defined in a submodule. In this case, our `home` module
is where we want to start, which has a defined route for `/dashboard` in
`src/app/home/dashboard/sDashboard.js`.

```js
.config( function myAppConfig ( $routeProvider ) {
        $routeProvider.when('/:subject/dashboard', {templateUrl: 'app/home/dashboard/dashboard.tpl.html',
           controller: 'SimpleDashController'
       })
  $urlRouterProvider.otherwise( '/' );
})
```

Use the main applications run method to execute any code after services
have been instantiated.

```js
.run( function () {
})
```

And then we define our main application controller. This is a good place for logic
not specific to the template or route, such as menu logic or page title wiring.

```js
.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | grockitApp' ;
    }
  });
})
```
