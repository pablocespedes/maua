(function() {
'use strict';
angular
.module("grockitApp.components")
.directive('customTopics', customTopics)
.directive('questionTiming', questionTiming)
.directive('questionTagsOnly', questionTagsOnly)
.directive('questionTags', questionTags)
.directive('questionShareList', questionShareList)
.directive('questionCount', questionCount)
.directive('splashMessage', splashMessage)

questionShareList.$inject=['environmentCons'];

function customTopics() {
  var directive = {
    link: link,
    templateUrl: 'app/components/practice/templates/custom-practice.tpl.html',
    restrict: 'A'
  };
  return directive;

  function setSelect2Settings() {
    var elm = $('#practice-list select');
    elm.select2({
      allowClear: true
    });

    elm.on("change", function(e) {
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

    $('#practice-settings-toggler').click(function() {
      $('#practice-settings').toggleClass('open');
      return false;
    });

    $('#practice-settings-list li > span').click(function() {
      $(this).parents('li').find('.switcher').click();
    });

  }

  function link(scope, element, attrs) {
    setSelect2Settings();
    togglePanel();
  }
}

function questionTiming() {
  var directive = {
    link: link,
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
    restrict: 'A'
  };
  return directive;

  function link(scope, element, attrs) {
    scope.showPercAnswered = !(scope.lastAnswerLoaded === 'NumericEntry' || scope.lastAnswerLoaded === 'NumericEntryFraction');

    if (scope.data.avg_time_to_answer >= 1) {
      scope.compAvgStatus = ((scope.yourTime - scope.data.avg_time_to_answer) > 0);

      if (scope.compAvgStatus)
        scope.compAvg = (scope.yourTime - scope.data.avg_time_to_answer);
      else
        scope.compAvg = -(scope.yourTime - scope.data.avg_time_to_answer);
    }

  }
}

function questionTagsOnly() {
  var directive = {
    replace: true,
    templateUrl: 'app/components/practice/templates/questionsTagsOnly.tpl.html',
    scope: {
      tags: '='
    },
    restrict: 'A'
  };
  return directive;
}

function questionTags() {
  var directive = {
    templateUrl: 'app/components/practice/templates/questionsTags.tpl.html',
    restrict: 'A',
    scope: {
      tags: '='
    }
  };
  return directive;
}

function questionShareList(environmentCons) {
  var directive = {
    link: link,
    templateUrl: 'app/components/practice/templates/uestionShareList.tpl.html',
    scope: {
      questCount: '=',
      currentGroup: '='
    },
    restrict: 'A'
  };
  return directive;

  function link(scope, element, attrs) {
    scope.currentDomain = environmentCons.localGrockit + '#/' + scope.currentGroup + '/question/';
  }
}

function questionCount() {
  var directive = {
    templateUrl: 'app/components/practice/templates/questionCount.tpl.html',
    scope: {
      currentCount: '=',
      maxCount: '='
    },
    restrict: 'A'
  };
  return directive;
}

function splashMessage() {
  var directive = {
    link: link,
    templateUrl: 'app/components/practice/templates/splash-message.tpl.html',
    scope: {
      isVisible: '=',
      word: '='
    },
    restrict: 'A'
  };
  return directive;

  function link(scope, element, attrs) {
    /* */
  }
}
})();
