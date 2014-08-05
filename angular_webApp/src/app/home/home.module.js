'use strict';
var home =  angular.module("grockitApp.home",['ng-breadcrumbs']).config(function($httpProvider,$routeProvider, $controllerProvider, $compileProvider, $provide,UserRoles) {
		home.controller = $controllerProvider.register;
		home.directive = $compileProvider.directive;
		home.routeProvider = $routeProvider;
		home.factory = $provide.factory;
		home.service = $provide.service;

		var filePath = {
				practice: {
						practiceCtrl: 'app/practiceGame/practice/practice.ctrl.js',
						practiceDrctv: 'app/practiceGame/practice/practice.directive.js',
						practiceServ: 'app/practiceGame/practice/practice.service.js',
						youtube: 'assets/javascripts/youtubeModal/bootstrap.youtubepopup.js'
				},
				dashboard: {
						dashCtrl: 'app/home/dashboard/sDashboard.ctrl.js',
						dashServ: 'app/home/dashboard/sDashboard.service.js'
				}
		};

		$routeProvider.when('/:subject/dashboard', {templateUrl: 'app/home/dashboard/dashboard.tpl.html', label: 'Dashboard', resolve: {deps: function ($q, $rootScope) {
				var deferred = $q.defer(),
				essentials = [
						filePath.dashboard.dashServ,
						filePath.dashboard.dashCtrl
				];
				$script(essentials, function () {
						// all dependencies have now been loaded by $script.js so resolve the promise
						$rootScope.$apply(function () {
								deferred.resolve();
						});
				});
				return deferred.promise;
		}},
				controller: 'SimpleDashController'
		})
		.when('/:subject/dashboard/practice/:questionId', {templateUrl: 'app/practiceGame/practice/practice.tpl.html', label: 'practice', resolve: {deps: function ($q, $rootScope) {
				var deferred = $q.defer(),
				essentials = [
						filePath.practice.practiceCtrl,
						filePath.practice.practiceDrctv,
						filePath.practice.practiceServ,
						filePath.practice.youtube
				];
				$script(essentials, function () {
						$rootScope.$apply(function () {
								deferred.resolve();
						});
				});

				return deferred.promise;
		}}, controller: 'PracticeController',
				reloadOnSearch: false
		});

		// $routeProvider.otherwise({redirectTo:'/'});
});

