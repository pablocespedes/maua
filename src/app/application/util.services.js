(function() {
  'use strict';

  angular.module("grockitApp.application")
    .factory('utilities', utilities)
    .factory('alerts', alerts)
    .service('collectionService', collectionService)
    .service('Observable', Observable)
    .factory('Timer', Timer)
    .factory('dateFormatter', dateFormatter)
    .factory('dateUtils', dateUtils);

  utilities.$inject = ['$rootScope', '$http', '$location', '$route', '$q', '$window', 'webStorage', 'YoutubeVideoApi', 'environmentCons'];
  Observable.$inject = [];
  Timer.$inject = ['$interval', 'collectionService'];


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

  function alerts() {
    var service = {
      showAlert: showAlert,
      setErrorApiMsg: setErrorApiMsg
    };

    return service;

    function showAlert(alertMsg, type) {

      angular.element.growl.error({
        message: alertMsg
      });
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
        start: function(count) {
          if (typeof count === 'undefined') { count = 0; }
          var timer = this;
          this.interval = $interval(function() {
            timer.seconds++;
          }, 1000, count);
        },
        pause: function() {
          $interval.cancel(this.interval);
        },
        reset: function() {
          this.seconds = 0;
          this.pause();
        },
        getInterval: function(){
          return timer.interval;
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


})();
