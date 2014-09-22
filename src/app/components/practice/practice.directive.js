angular.module("grockitApp.components")

.directive('ngCustomTopics', function () {

  function setSelect2Settings() {
    var elm = $('#practice-list select');
    elm.select2({
      allowClear: true
    });

    elm.on("change", function (e) {
      if (e.added) {

        $(e.added.element).css("background", '#f4b04f');
      }
    });
  }

  function togglePanel() {

    $('.practice-settings-switcher').switcher({
      theme: 'square',
      on_state_content: '<span class="fa fa-check" style="font-size:11px;"></span>',
      off_state_content: '<span class="fa fa-times" style="font-size:11px;"></span>'
    });

    $('#practice-settings-toggler').click(function () {
      $('#practice-settings').toggleClass('open');
      return false;
    });

    $('#practice-settings-list li > span').click(function () {
      $(this).parents('li').find('.switcher').click();
    });

  }

  return {
    restrict: 'A',
    templateUrl: 'app/components/practice/templates/custom-practice.tpl.html',
    link: function () {
      setSelect2Settings();
      togglePanel();
    }

  };
})

.directive('questionTiming', function () {
  return {
    restrict: 'A',
    templateUrl: 'app/components/practice/templates/questionTiming.tpl.html',
    scope: {
      data: '=',
      yourTime: '=',
      answerStatus: '=',
      percentAnswered: '=',
      confirmed: '=',
      xpTag: '=',
      lastAnswerLoaded: '='
    },
    link: function (scope) {
      scope.showPercAnswered = !(scope.lastAnswerLoaded === 'NumericEntry' || scope.lastAnswerLoaded === 'NumericEntryFraction');

      scope.compAvgStatus = ((scope.yourTime - scope.data.avg_time_to_answer) > 0);

      if (scope.compAvgStatus)
        scope.compAvg = (scope.yourTime - scope.data.avg_time_to_answer);
      else
        scope.compAvg = -(scope.yourTime - scope.data.avg_time_to_answer);

    }
  };
})

.directive('questionTagsOnly', function () {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: 'app/components/practice/templates/questionsTagsOnly.tpl.html',
    scope: {
      tags: '='
    }
  };
})

.directive('questionTags', function () {
  return {
    restrict: 'A',
    templateUrl: 'app/components/practice/templates/questionsTags.tpl.html',
    scope: {
      tags: '='
    }
  };
})

.directive('questionShareList', function (environmentCons) {
  return {
    restrict: 'A',
    templateUrl: 'app/components/practice/templates/uestionShareList.tpl.html',
    scope: {
      questCount: '=',
      currentGroup: '='
    },
    link: function (scope) {
      scope.currentDomain = environmentCons.localGrockit + '#/' + scope.currentGroup + '/question/';
    }

  };
})

.directive('questionCount', function() {
  return {
    restrict: 'A',
    templateUrl: 'app/components/practice/templates/questionCount.tpl.html',
    scope: {
      currentCount: '=',
      maxCount: '='
    }
  }
})

.directive('splashMessage', function(utilities) {
  return {
    restrict: 'A',
    templateUrl: 'app/components/practice/templates/splash-message.tpl.html',
    scope: {
      isVisible: '=',
      word: '='
    },
    link: function(scope){
      var loaderImages =[
      'CloudLoadBlue350350.gif'
      ];

     scope.loader = loaderImages[utilities.random(loaderImages.length - 1)];
    }

  };
});

