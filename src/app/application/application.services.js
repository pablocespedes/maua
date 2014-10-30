(function() {
  'use strict';

  angular.module("grockitApp.application")
  .factory('utilities', utilities)
  .factory('grockitModal', grockitModal)
  .factory('alerts', alerts)
  .service('collectionService', collectionService)
  .service('Observable', Observable)
  .factory('Timer', Timer)
  .factory('dateFormatter', dateFormatter)
  .service('currentProduct', currentProduct)
  .factory('dateUtils', dateUtils)
  .factory('appService', appService)
  .factory('menuService',menuService);


  utilities.$inject = ['$rootScope', '$http', '$location', '$route', '$q', '$window', 'webStorage', 'YoutubeVideoApi', 'environmentCons'];
  grockitModal.$inject = ['$http', 'utilities', 'environmentCons'];
  Observable.$inject = [];
  Timer.$inject = ['$interval', 'collectionService'];
  currentProduct.$inject = ['webStorage', 'Observable', 'utilities'];
  appService.$inject = ['$window','$q', '$location', 'Auth', 'GroupsApi', 'utilities', 'membershipService', 'currentProduct','alerts'];
  menuService.$inject =['utilities'];

  function utilities($rootScope, $http, $location, $route, $q, $window, webStorage, YoutubeVideoApi, environmentCons) {
    var currentTrack = {};
    var service = {
      newGrockit: newGrockit,
      originalGrockit: originalGrockit,
      getActiveTrack: getActiveTrack,
      setActiveTrack: setActiveTrack,
      random: random,
      mapObject: mapObject,
      getIndexArray: getIndexArray,
      internalRedirect: internalRedirect,
      redirect: redirect,
      dialogService: dialogService,
      getCurrentParam: getCurrentParam,
      getYoutubeVideosId: getYoutubeVideosId,
      setGroupTitle: setGroupTitle,
      getGroupTitle: getGroupTitle
    };
    return service;

    function grockitHostEvaluation(isNewGrockit) {
      if (isNewGrockit) {
        return location.host == '127.0.0.1:9000' ? environmentCons.oldGrockit : environmentCons.liveGrockit;
      } else {
        return location.host == '127.0.0.1:9000' ? environmentCons.stagingGrockit : location.host == environmentCons.ww2Grockit2 ? environmentCons.oldGrockit : location.origin
      }
    }

    function getResourceObject(resourceObject) {
      var nDeferred = $q.defer();
      var videoObject = {},
      videoId = '';
      if (resourceObject.resource_type == "youtube") {
        var video = getYoutubeVideosId(resourceObject.resource);
        video.then(function(idVid) {
          videoId = idVid;
          return YoutubeVideoApi.setYouTubeTitle(idVid);

        }).then(function(videoTime) {
          videoObject = {
            videoTime: videoTime,
            videoId: videoId,
            resourceType: resourceObject.resource_type
          };
          nDeferred.resolve(videoObject);
        });
      } else {
        videoObject = {
          videoTime: null,
          videoId: decodeURIComponent(resourceObject.resource).replace(/"/g, ""),
          resourceType: resourceObject.resource_type
        };
        nDeferred.resolve(videoObject);
      }
      return nDeferred.promise;
    }

    function newGrockit() {
      return {
        url: grockitHostEvaluation(true)
      };
    }

    function originalGrockit() {
      return {
        url: grockitHostEvaluation(false)
      };
    }

    function getActiveTrack() {
      return currentTrack;
    }

    function setActiveTrack(subject, trackId) {
      currentTrack.subject = subject;
      currentTrack.trackId = trackId;
    }

    function random(min, max) {
      min = min | 0;
      return _.random(min, max);
    }

    function mapObject(collection, key, getter) {

      return _.map(collection, function(val) {
        var obj = {};
        obj[key] = getter(val);
        return obj;
      });
    }

    function getIndexArray(arr, key, val) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][key] == val)
          return i;
      }
      return -1;
    }

    function internalRedirect(url) {
      return $location.path(url);
    }

    function redirect(url) {

      $window.location = url;
    }

    function dialogService(options) {
      bootbox.dialog(options);
    }

    function getCurrentParam(key) {
      return angular.isDefined($route.current) ? $route.current.pathParams[key] : undefined;
    }

    function setCurrentParam(key, param) {
      $route.current.pathParams[key] = null;
      $route.current.pathParams[key] = param;
    }

    function getYoutubeVideosId(url) {

      var id = '';
      url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
      if (url[2] !== undefined) {
        id = url[2].split(/[^0-9a-z_]/i);
        id = id[0];
      } else {
        id = url;
      }
      return id;

    }

    function setGroupTitle(title) {
      if ($rootScope.groupTitle === null || $rootScope.groupTitle === '' || $rootScope.groupTitle !== title) {
        $rootScope.groupTitle = title;
      }
    }

    function getGroupTitle() {
      return $rootScope.groupTitle;
    }
  }

  function grockitModal($http, utilities, environmentCons) {

    var service = {
      showTrialExpiration: showTrialExpiration
    };
    return service;

    function showTrialExpiration(titleM, groupId, nQuestions) {
      var msg = 'Looks like you\'ve been pretty busy these past few days. You\'ve answered ' +
      +nQuestions + ' questions and are well on your way to Grocking the ' + utilities.getGroupTitle() + '!';
      var dialogOptions = {
        title: '<i class="fa fa-clock-o"></i> ' + titleM,
        animate: true,
        message: '<div class="text-lg trial text-center">' + msg +
        '<br><br>Keep Grocking the ' + utilities.getGroupTitle() + '. Starting at just $9.99.<div>',
        className: "modal-trial modal-success",
        buttons: {
          success: {
            label: 'Continue using Grockit.',
            className: 'btn-success',
            callback: function() {
              var baseUrl = utilities.originalGrockit(false).url;
              utilities.redirect(baseUrl + '/' + groupId + '/subscriptions/new');
            }
          },
        }
      };

      utilities.dialogService(dialogOptions);
    }
  }

  function alerts() {
    var service = {
      showAlert: showAlert,
      setErrorApiMsg: setErrorApiMsg
    };

    return service;

    function showAlert(alertMsg, type) {

      var options = {
        type: type,
        namespace: 'pa_page_alerts_dark',
        classes: 'alert-dark',
        auto_close: 30 /*seconds*/
      };
      setTimeout(function() {
        PixelAdmin.plugins.alerts.add(alertMsg, options);
      }, 250);
    }

    function setErrorApiMsg(e) {
      return 'Uh oh! We\'re having difficulty retrieving your data.';
    }
  };

  function collectionService() {
    this.items = [];
    this.lastId = 1;
    this.add = function(item) {
      item.serviceId = this.lastId++;
      if (!this.get(item.serviceId)) {
        this.items.push(item);
      }
    };
    this.equals = function(item, serviceId) {
      return item.serviceId === serviceId;
    };
    this.get = function(serviceId) {
      var self = this;
      return _.find(this.items, function(item) {
        return self.equals(item, serviceId);
      });
    };
    this.remove = function(item) {
      var self = this;
      this.items = _.reject(this.items, function(storedItem) {
        return self.equals(item, storedItem.serviceId);
      });
    };
  }

  function Observable() {

    var observables = [];
    return {
      create: function(key) {
        if (this.get(key)) return false;
        var observable = {
          key: key,
          lastId: 0,
          observers: [],
          notify: function(data) {
            _.forEach(this.observers, function(observer) {
              observer.callback(data);
            });
          },
          register: function(callback) {
            var observer = {
              id: this.lastId++,
              callback: callback
            };
            this.observers.push(observer);
            return observer;
          },
          unregister: function(observer) {
            this.observers = _.reject(this.observers, {
              'id': observer.id
            });
          }
        };
        observables.push(observable);
        return observable;
      },
      get: function(key) {
        return _.find(observables, {
          'key': key
        });
      }
    };
  }

  function Timer($interval, collectionService) {

    var createTimer = function() {
      var timer = {
        seconds: 0,
        interval: null,
        start: function() {
          var timer = this;
          this.interval = $interval(function() {
            timer.seconds++;
          }, 1000);
        },
        pause: function() {
          $interval.cancel(this.interval);
        },
        reset: function() {
          this.seconds = 0;
          this.pause();
        }
      };
      return timer;
    };

    function create() {
      var timer = createTimer();
      collectionService.add(timer);
      return timer;
    }

    function destroy(timer) {
      $interval.cancel(timer.interval);
      collectionService.remove(timer);
    }

    var service = {
      create: create,
      destroy: destroy
    };
    return service;
  }

  function dateFormatter() {

    var formatSeconds = function(seconds) {
      var secs = seconds,
      hours = Math.floor(secs / (60 * 60)),
      divisor_for_minutes = secs % (60 * 60),
      minutes = Math.floor(divisor_for_minutes / 60),
      divisor_for_seconds = divisor_for_minutes % 60,
      seconds = Math.ceil(divisor_for_seconds);

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      var time = (hours > 0 ? hours + ':' : '') + (minutes >= 0 ? minutes + ':' : '') + (seconds >= 0 ? seconds : '');
      return time;
    };

    var service = {
      formatSeconds: formatSeconds
    };
    return service;
  }

  function currentProduct(webStorage, Observable, utilities) {
    var currentUser = webStorage.get('currentUser'),
    observable = Observable.create('currentProduct');

    this.currentGroupId = function(groupId, actualGroup) {
      if (currentUser !== null && groupId !== currentUser.currentGroup) {
        currentUser.currentGroup = groupId;
        webStorage.add('currentUser', currentUser);
      }
      utilities.setGroupTitle(actualGroup.name)
      observable.notify(groupId);
    };

    this.observeGroupId = function() {
      return Observable.get('currentProduct');
    }

    this.unregisterGroup = function(groupObserver) {
      observable.unregister(groupObserver);
    }
  }

  function dateUtils() {
    var service = {
      secondsBetweenDates: secondsBetweenDates,
      getStandardDate: getStandardDate,
      getMonthName: getMonthName,
      formatDate: formatDate
    }
    return service;


    function secondsBetweenDates(date1, date2) {
      date1 = new Date(date1);
      date2 = new Date(date2);
      return Math.abs(date2.getTime() - date1.getTime()) / 1000;
    }

    function getStandardDate(date) {
      var day = date.getDate(),
      month = date.getMonth();
      return getMonthName(month) + ' ' + day;
    }

    function formatDate(date) {
      var initialDate = this.getStandardDate(date),
      year = date.getYear();
      return initialDate + ' ' + year;
    }

    function getMonthName(index) {
      var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
      ];
      return monthNames[index];
    }
  }

  function appService($window, $q, $location, Auth, GroupsApi, utilities, membershipService, currentProduct,alerts) {


    var _appFn = {
      actualGroup: function(groups, urlGroup) {
        return _.find(groups, {
          'id': urlGroup
        })
      },
      userGroup: function(gMembership, urlGroup) {
        return _.find(gMembership, {
          'group_id': urlGroup
        })
      },
      isBasePath: function(userResponse) {
        return ($location.path() === '/' || $location.path() === '/' + userResponse.currentGroup || $location.path() == '');
      },
      getUserData: function() {
        var userData = Auth.getUpdateUserData(),
        userMembership = GroupsApi.membershipGroups(true);

        return $q.all([userData, userMembership]);
      }
    };

    var service = {
      userPreflight: userPreflight
    };

    return service;


    function userPreflight() {
      if (Auth.isLoggedIn()) {

        _appFn.getUserData()
        .then(getUserDataCompleted)
        .catch(getUserDataFailed);

      } else {
        $("body").html('The user is not logged in! <a href=\"/logout\">Click here to restart</a>.');
        event.preventDefault();
      }


      function getUserDataCompleted(response) {
        var userResponse = response[0];

        if (userResponse != null) {

          var groups = response[1].data.groups;

          if (_appFn.isBasePath(userResponse)) {

            utilities.internalRedirect('/' + userResponse.currentGroup + '/dashboard');

          } else {

            var urlGroup = utilities.getCurrentParam('subject'),
            actualGroup = _appFn.actualGroup(groups, urlGroup),
            userGroup = _appFn.userGroup(userResponse.groupMemberships, urlGroup);

            if (angular.isUndefined(actualGroup) || angular.isUndefined(userGroup)) {

              $window.location = '404.html';

            } else {
              membershipService.setMembershipInfo(userResponse, userGroup, urlGroup);
              membershipService.userCanAccesPage(urlGroup);
              currentProduct.currentGroupId(urlGroup, actualGroup);

            }
          }
        }
      }

      function getUserDataFailed(e) {
        alerts.showAlert(alerts.setErrorApiMsg(e), 'danger');
      }

    }
  }

  function menuService(utilities) {
    var grockitTV = 'http://grockit.tv',
    baseUrl = utilities.originalGrockit().url;

    var service = {
      createLeftMenu: createLeftMenu
    };
    return service;

    function createLeftMenu(options,hideStudyPlan,hideVideoOption) {

      return [{
        id: 'dashboard',
        url: '#/' + options.groupId + '/dashboard',
        canAccess: options.canAccess,
        title: 'Dashboard',
        isReady: options.isReady,
        iconclass: 'fa-dashboard',
        shouldShow: true

      }, {
        id: 'study_plan',
        url: baseUrl + '/' + options.groupId + '/study_plan',
        canAccess: options.canAccess,
        title: 'Study Plan',
        isReady: options.isReady,
        iconclass: 'fa-tasks',
        shouldShow: (!hideStudyPlan)
      }, {
        id: 'social',
        url: baseUrl + '/' + options.groupId + '/social',
        canAccess: options.canAccess,
        title: 'Group Practice',
        isReady: options.isReady,
        iconclass: 'fa-users',
        shouldShow: (options.groupId != 'gre')
      }, {
        id: 'video_courses',
        url: baseUrl + '/' + options.groupId + '/video_courses',
        canAccess: options.canAccess,
        title: 'Video Library',
        isReady: options.isReady,
        iconclass: 'fa-video-camera',
        shouldShow: (!hideVideoOption)
      }, {
        id: 'custom_practice',
        url: baseUrl + '/' + options.groupId + '/custom_games/new',
        canAccess: options.canAccess,
        title: 'Custom Practice',
        isReady: options.isReady,
        iconclass: 'fa-book',
        shouldShow: (options.groupId != 'gre')
      }, {
        id: 'gre_fullLenghtTest',
        url: grockitTV + options.groupId + '/grepracticetest',
        canAccess: options.canAccess,
        title: 'Take a Full Length Test',
        isReady: options.isReady,
        iconclass: 'fa-lightbulb-o',
        shouldShow: (options.groupId === 'gre')
      }, {
        id: 'gmat_fullLenghtTest',
        url: baseUrl + '/' + options.groupId + '/join_cat_game',
        canAccess: options.canAccess,
        title: 'Take a Full Length Test',
        isReady: options.isReady,
        iconclass: 'fa-lightbulb-o',
        shouldShow: (options.groupId === 'gmat')
      }, {
        id: 'tutoring',
        url: baseUrl + '/' + options.groupId + '/tutoring',
        canAccess: options.canAccess,
        title: 'Tutoring',
        isReady: options.isReady,
        iconclass: 'fa-briefcase',
        shouldShow: true
      }, {
        id: 'skill_data',
        url: baseUrl + '/' + options.groupId + '/skill_data',
        canAccess: options.canAccess,
        title: 'Skill Data',
        isReady: options.isReady,
        iconclass: 'fa-dashboard',
        shouldShow: true
      }, {
        id: 'history',
        url: '#/' + options.groupId + '/history',
        canAccess: options.canAccess,
        title: 'History',
        isReady: options.isReady,
        iconclass: 'fa-bar-chart-o',
        shouldShow: (options.groupId === 'gre')
      }, {
        id: 'history',
        url: baseUrl + '/' + options.groupId + '/reviews',
        canAccess: options.canAccess,
        title: 'History',
        isReady: options.isReady,
        iconclass: 'fa-bar-chart-o',
        shouldShow: (options.groupId !== 'gre')
      },

      ];
    }

  }



})();
