angular.module('grockitApp.services', ['webStorageModule'])
.factory('Utilities', function($http,webStorage,$location,$route,VideoService,$q,environmentCons,$window) {

  var internalUtilities = {
    grockitHostEvaluation : function (isNewGrockit) {
      if (isNewGrockit) {
        return location.host == '127.0.0.1:9000' ? environmentCons.oldGrockit :environmentCons.liveGrockit;
      }
      else {
        return location.host == '127.0.0.1:9000' ? environmentCons.stagingGrockit : location.host == environmentCons.ww2Grockit2 ? environmentCons.oldGrockit : location.origin
      }
    },

    getResourceObject: function(resourceObject) {
      var nDeferred = $q.defer();
      var videoObject = {},videoId='';
      if (resourceObject.resource_type=="youtube") {
        var video = internalUtilities.getYoutubeVideosId(resourceObject.resource);
        video.then(function(idVid){
          videoId=idVid;
          return  VideoService.setYouTubeTitle(idVid);

        }).then(function (videoTime) {
          videoObject = {
            videoTime: videoTime,
            videoId: videoId,
            resourceType: resourceObject.resource_type
          };
          nDeferred.resolve(videoObject);
        });
      }
      else {
        videoObject = {
          videoTime: null,
          videoId: decodeURIComponent(resourceObject.resource).replace(/"/g, ""),
          resourceType: resourceObject.resource_type
        };
        nDeferred.resolve(videoObject);
      }
      return nDeferred.promise;
    }

  };


  return {
   newGrockit: function () {
     return {
       url: internalUtilities.grockitHostEvaluation(true)
     };
   },
   originalGrockit: function () {
     return {
       url: internalUtilities.grockitHostEvaluation(false)
     };
   },
   getActiveGroup: function () {
     if (!!webStorage.get('currentUser')) {
       return webStorage.get('currentUser').currentGroup;
     }
   },
   getActiveTrack: function () {
     return webStorage.get('currentUser').trackData;
   },
   setActiveTrack: function (data) {
     var currentUser = webStorage.get('currentUser');
     currentUser.trackData = data;
     webStorage.add('currentUser', currentUser);
   },
   findInCollection: function (collection, filter) {
    return  _.find(collection,filter);

  },
  random: function(min, max) {
    min = min | 0;
    return _.random(min, max);
  },
  mapObject: function(collection, key,getter){

   return _.map(collection, function(val) {
     var obj = {};
     obj[key]= getter(val);
     return obj;
   });

 },
 mergeCollection: function (collection1, collection2) {
   return  _.merge(collection1,collection2);

 },
 getIndexArray: function (arr, key, val) {
   for (var i = 0; i < arr.length; i++) {
     if (arr[i][key] == val)
       return i;
   }
   return -1;
 },
 internalRedirect: function (url) {
   $location.path(url);
 },
 redirect: function (url) {

   $window.location.href =  url;
 },
 setActiveTab: function (position) {
   this.clearActiveTab();
   var menuList = angular.element('div#main-menu-inner ul.navigation li');
   angular.element(menuList[position]).addClass('active');

 },
 clearActiveTab: function () {
   angular.element('div#main-menu-inner ul.navigation li').removeClass('active');
 },
 dialogService: function (options) {
   bootbox.dialog(options);
 },
 getCurrentParam: function (key) {
   return angular.isDefined($route.current)? $route.current.pathParams[key] : undefined;
 },
 setCurrentParam: function (key, param) {
   $route.current.pathParams[key] = null;
   $route.current.pathParams[key] = param;
 },
 getYoutubeVideosId: function(url) {

   var id = '';
   url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
   if (url[2] !== undefined) {
     id = url[2].split(/[^0-9a-z_]/i);
     id = id[0];
   }
   else {
     id = url;
   }
   return id;

 }
}
})

.factory('Alerts', function() {
  return {
    showAlert: function (alertMsg, type) {

      var options = {
        type: type,
        namespace: 'pa_page_alerts_dark',
        classes: 'alert-dark',
        auto_close: 30 /*seconds*/
      };
      setTimeout(function () {
        PixelAdmin.plugins.alerts.add(alertMsg, options);
      },250);
    },
    setErrorApiMsg: function (e) {
      return 'Uh oh! We\'re having difficulty retrieving your data.';
    }
  }

})

.factory('GrockitNewFeatures', function($http, Utilities,environmentCons) {

  return {
    showDialog: function () {
      var dialogOptions = {
        title: "Welcome to Grockit 2.0 Beta",
        message: ""
      },
      url = location.host == '127.0.0.1:9000' ? environmentCons.localGrockit : environmentCons.liveGrockit;
      $http.get(url + '/common/templates/newFeatures2.0.html').success(function (data) {
        dialogOptions.message = data;
        Utilities.dialogService(dialogOptions);

      }).error(function (jqXHR, textStatus, errorThrown) {

      });
    }

  }
})

.service('ServiceFactory', function() {
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
    return _.find(this.items, function(item) { return self.equals(item, serviceId); });
  };
  this.remove = function(item) {
    var self = this;
    this.items = _.reject(this.items, function(storedItem) { return self.equals(item, storedItem.serviceId); });
  };
})

.factory('Timer', ['$interval', 'ServiceFactory',
  function($interval, ServiceFactory) {
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
    return {
      create: function() {
        var timer = createTimer();
        ServiceFactory.add(timer);
        return timer;
      },
      destroy: function(timer) {
        $interval.cancel(timer.interval);
        ServiceFactory.remove(timer);
      }
    };
  }])

.factory('DateFormatter', function() {
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
    // var time = hours+':'+minutes+':'+seconds;

    var time = (hours > 0 ? hours + ':' : '') +
    (minutes >= 0 ? minutes + ':' : '') + (seconds >= 0 ? seconds : '');
    return time;
  };
  return {
    formatSeconds: formatSeconds
  };
});
