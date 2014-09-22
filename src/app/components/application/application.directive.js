angular.module("grockitApp.components")

.directive('youtube',function() {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      $(element).YouTubeModal({autoplay: 0, height: 480, width: '100%'});
    }
  };
})

.directive('breadcrumb', function() {
  return {
    restrict: 'A',
    templateUrl: 'app/components/application/templates/breadcrumb.tpl.html',
    scope: {
      breadcrumbs: '='
    }
  };
})

.directive('fadingText', function() {
  return {
    restrict: 'A',
    templateUrl: 'app/components/application/templates/fading-text.tpl.html',
    scope: {
      word: '=',
      isVisible: '='
    },
    link: function(scope, elem, atttrs) {
      scope.word = scope.word.split("");
    }
  };
})

.directive("trackToggle", function(){
  return {
    scope: {},
    restrict: 'A',
    transclude:true,
    templateUrl: 'app/components/application/templates/toggle-element.tpl.html',
    link: function(scope){
      scope.toggled = false;

      scope.toggle = function(){
        scope.toggled = !scope.toggled;
      }
    }
  }
})

.directive('btnRadio',function() {
  var activeClass = 'btn-info';

  return {
    require: 'ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {

      var value = scope.$eval(attrs.btnRadio);

      //model -> UI
      scope.$watch(function() {
        return ngModelCtrl.$modelValue;
      }, function(modelValue) {
        if (angular.equals(modelValue, value)) {
          element.addClass(activeClass);
        } else {
          element.removeClass(activeClass);
        }
      });

      //ui->model
      element.bind('click', function() {
        if (!element.hasClass(activeClass)) {
          scope.$apply(function() {
            ngModelCtrl.$setViewValue(value);
          });
        }
      });
    }
  };
})

.directive('topicList', function() {
  return {
    restrict: 'A',
    templateUrl: 'app/components/application/templates/topics-list.tpl.html',
    scope: {
    },
    link: function (scope, element, attrs) {

    }
  };
})

.directive('searchInput', function() {
  return {
    restrict: 'A',
    templateUrl: 'app/components/application/templates/search-input.tpl.html'
  };
})
.directive('welcome', function() {
  return {
    restrict: 'A',
    templateUrl: 'app/components/application/templates/welcome.tpl.html',
    scope:{
      data:'=data',
      url:'=',
      logOutUrl:'=',
      logOut:'&'
    }
  };
});
