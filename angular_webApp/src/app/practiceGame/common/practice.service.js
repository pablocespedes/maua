'use strict';
/*Services to manage diretives logic*/

practiceGame.factory('questionTypesService', function () {

  var removeItem = function (options, idInput) {
    return $.grep(options, function (value) {
      return value != idInput;
    });
  };


  function oneChoiceFactory() {
    var content = $('#parent');
    content.on('click', '#oneChoice .middle', function (e) {
      if (e.handled !== true) // This will prevent event triggering more then once
      {
        var choice = $(e.target).closest('.choice'),
          input = choice.find('[type="checkbox"]'),
          button = choice.find(':button'),
          isChecked = input.is(':checked'),
          hasPrimary = button.hasClass('btn-primary'),
          nexAction = $('#nextAction'),
          seeAnswer = $('#skipAction');


        $('.choice').find('[type="checkbox"]').prop('value', false);
        $('.choice button').removeClass('btn-primary btn-danger');


        if (!isChecked && !hasPrimary) {
          input.prop('value', true);
          button.addClass('btn-primary');
          nexAction.addClass('btn-primary');
          seeAnswer.addClass('hide');
        } else {
          nexAction.removeClass('btn-primary');
          seeAnswer.removeClass('hide');
          input.prop('value', false);
          button.removeClass('btn-primary');
        }
      }
      e.handled = true;


    });
  }

  function multipleChoiceFactory() {
    var content = $('#parent');
    content.on('click', '#multipleChoice .middle', function (e) {
      if (e.handled !== true) // This will prevent event triggering more then once
      {
        var choice = $(e.target).closest('.choice'),
          general = $('.choice .middle button'),
          input = choice.find('[type="checkbox"]'),
          choiceB = choice.find('.middle'),
          button = choiceB.find('.letter'),
          isChecked = input.is(':checked'),
          hasPrimary = button.hasClass('btn-primary'),
          nexAction = $('#nextAction'),
          seeAnswer = $('#skipAction');

        if (!isChecked && !hasPrimary) {
          input.prop('value', true);
          button.addClass('btn-primary');
          nexAction.addClass('btn-primary');
          seeAnswer.addClass('hide');
        } else {
          input.prop('value', false);
          button.removeClass('btn-primary');
          if (!general.hasClass('btn-primary')) {
            nexAction.removeClass('btn-primary');
            seeAnswer.removeClass('hide');
          }

        }
        e.handled = true;
      }

    });

  }

  function matrix2x3ChoiceFactory() {
    var content = $('#parent');
    content.on('click', '#matrix2x3 .middle', function (e) {

      if (e.handled !== true) // This will prevent event triggering more then once
      {
        var choice = $(e.target).closest('.choice'),
          general = $('.choice .middle button'),
          input = choice.find('[type="radio"]'),
          choiceB = choice.find('.middle'),
          button = choiceB.find('.letter'),
          isChecked = input.is(':checked'),
          hasPrimary = button.hasClass('btn-primary'),
          nexAction = $('#nextAction'),
          seeAnswer = $('#skipAction'),
          limitSelection = choice.parent().find('[data-group=' + choiceB.data('group') + ']');

        if (limitSelection.find('button').hasClass('btn-primary')) {
          limitSelection.find('button').removeClass('btn-primary');
          limitSelection.find('input').prop('value', false);
        }

        if (!isChecked && !hasPrimary) {
          input.prop('value', true);
          button.addClass('btn-primary');
          nexAction.addClass('btn-primary');
          seeAnswer.addClass('hide');
        } else {
          input.prop('value', false);
          button.removeClass('btn-primary');
          if (!general.hasClass('btn-primary')) {
            nexAction.removeClass('btn-primary');
            seeAnswer.removeClass('hide');
          }
        }
      }
      e.handled = true;
    });

  }

  function matrix3x3ChoiceFactory() {
    var content = $('#parent');
    content.on('click', '#matrix3x3 .middle', function (e) {

      if (e.handled !== true) // This will prevent event triggering more then once
      {
        var choice = $(e.target).closest('.choice'),
          input = choice.find('[type="radio"]'),
          general = $('.choice .middle button'),
          choiceB = choice.find('.middle'),
          button = choiceB.find('.letter'),
          isChecked = input.is(':checked'),
          hasPrimary = button.hasClass('btn-primary'),
          nexAction = $('#nextAction'),
          seeAnswer = $('#skipAction'),
          limitSelection = choice.parent().find('[data-group=' + choiceB.data('group') + ']');

        if (limitSelection.find('button').hasClass('btn-primary')) {
          limitSelection.find('button').removeClass('btn-primary');
          limitSelection.find('input').prop('value', false);
        }
        if (!isChecked && !hasPrimary) {
          input.prop('value', true);
          button.addClass('btn-primary');
          nexAction.addClass('btn-primary');
          seeAnswer.addClass('hide');
        } else {
          input.prop('value', false);
          button.removeClass('btn-primary');
          if (!general.hasClass('btn-primary')) {
            nexAction.removeClass('btn-primary');
            seeAnswer.removeClass('hide');
          }
        }
      }
      e.handled = true;

    });
  }

  function multipleChoiceTwoCorrect() {
    var content = $('#parent'),
      options = [];
    content.on('click', '#twoChoice .middle', function (e) {
      if (e.handled !== true) // This will prevent event triggering more then once
      {
        var choice = $(e.target).closest('.choice'),
          input = choice.find('[type="checkbox"]'),
          idInput = input.attr('id'),
          choiceB = choice.find('.middle'),
          button = choiceB.find('.letter'),
          isChecked = input.is(':checked'),
          hasPrimary = button.hasClass('btn-primary'),
          nexAction = $('#nextAction'),
          seeAnswer = $('#skipAction');


        // normal flow, this just identify when check or uncheck
        if (!isChecked && !hasPrimary) {

          // validation which takes care to keep just 2 options selected
          if (options.length >= 2) {
            var itemToRemove = options[0];
            options = removeItem(options, itemToRemove);
            var removedButton = $('button#' + itemToRemove), removeInput = removedButton.parent().find('input');
            removeInput.prop('value', false);
            removedButton.removeClass('btn-primary');
            event.preventDefault();
          }

          options.push(idInput);
          input.prop('value', true);
          button.addClass('btn-primary');
          nexAction.addClass('btn-primary');
          seeAnswer.addClass('hide');
        } else {
          options = removeItem(options, idInput);

          nexAction.removeClass('btn-primary');
          seeAnswer.removeClass('hide');
          input.prop('value', false);
          button.removeClass('btn-primary');
        }
      }
      e.handled = true;

    });

  }

  function satFactory() {
    var content = $('#parent');
    content.on('click', '#sat .column-matrix', function (e) {
      if (e.handled !== true) // This will prevent event triggering more then once
      {
        var choice = $(e.target),
          choiceVal = choice.text(),
          selectedGroup = $(e.target).parents('td').data('group'),
          groups = $(e.target).parents('.choice').find('[data-group=' + selectedGroup + ']'),
          hasPrimary = choice.hasClass('btn-primary'),
          nexAction = $('#nextAction'),
          seeAnswer = $('#skipAction');

        groups.find('[type=button]').removeClass('btn-primary');
        groups.find('[type=button]').addClass('btn-outline');
        if (!hasPrimary) {
          choice.removeClass('btn-outline');
          choice.addClass('btn-primary');
          $('#input' + selectedGroup).text(choiceVal);
          nexAction.addClass('btn-primary');
          seeAnswer.addClass('hide');
        } else {
          $('#input' + selectedGroup).text('');
          choice.removeClass('btn-primary');
          choice.addClass('btn-outline');
        }
      }
      e.handled = true;


    });


  }

  function numericEntry(scope) {
    scope.$watch('portal.numerator', function (newVal, oldVal) {
      handleValidation(newVal);
    });
  }

  function fractionEntry(scope) {
    scope.$watch('portal.numerator', function (newVal, oldVal) {
      scope.isNumeratorValid = validateNumber(newVal);
      handleValidation(scope.isNumeratorValid && scope.isDenominatorValid);
    });
    scope.$watch('portal.denominator', function (newVal, oldVal) {
      scope.isDenominatorValid = validateNumber(newVal);
      handleValidation(scope.isNumeratorValid && scope.isDenominatorValid);
    });
  }

  function validateNumber(value) {
      if (angular.isUndefined(value) || value === '') {
        return null;
      } else {
        console.log(value);
        value = value * 1;
        console.log(value);
        return (angular.isDefined(value) && value != null && !isNaN(value) && angular.isNumber(value));
      }
  }

  var nexAction = $('#nextAction'),
      seeAnswer = $('#skipAction');
  function handleValidation(isValid) {
      if (isValid) {
        console.log("add");
        nexAction.addClass('btn-primary');
        seeAnswer.addClass('hide');
      }
      else {
        console.log("remove");
        nexAction.removeClass('btn-primary');
        seeAnswer.removeClass('hide');
      }
  }

  return {
    oneChoiceFactory: oneChoiceFactory,
    multipleChoiceFactory: multipleChoiceFactory,
    matrix2x3ChoiceFactory: matrix2x3ChoiceFactory,
    matrix3x3ChoiceFactory: matrix3x3ChoiceFactory,
    multipleChoiceTwoCorrect: multipleChoiceTwoCorrect,
    satFactory: satFactory,
    numericEntry: numericEntry,
    fractionEntry: fractionEntry
  };
});

practiceGame.factory('fraction', function () {


  function Fraction(n, d) {
    if ("number" !== typeof n)
      throw new TypeError("Excptected Parameter to be of type number");

    var strings = n.toString(2).split("."); //Split the number by its decimal point

    if (strings.length > 1 && !d) { //No denominator given and n is a float

      var floats = [strings[1].substr(0, 27), strings[1].substr(27, 54)]; //Split into to parts

      var int64 = [
          parseInt(floats[0], 2) << 1,
          parseInt(floats[1], 2) << 1
      ];

      var denominator = Math.pow(2, strings[1].length + 1); //
      var numerator = int64[0] * Math.pow(2, floats[1].length);

      numerator += int64[1];
      numerator += parseInt(strings[0], 2) * denominator;

      this.numerator = numerator;
      this.denominator = denominator;
      this.reduce();

      this.approx = approx(n);

    } else if (strings.length < 2 && !d) { // If no denominator and n is an int
      this.numerator = n;
      this.denominator = 1;
    } else { //if n and d
      this.numerator = n;
      this.denominator = d;
    }

    function approx(f, n) {
      n = n || 0;
      var fraction = new Fraction(1, 1);

      var float = Math.pow(f, -1);
      var rec = ~~float;
      var decimal = float - rec;

      if (float.toPrecision(Fraction.precision) == rec)
        return new Fraction(1, rec);
      var _fraction = approx(decimal, n + 1);

      fraction.denominator = rec * _fraction.denominator + _fraction.numerator;
      fraction.numerator = _fraction.denominator;

      return fraction;

    }

  }

  //The approx precision
  Fraction.precision = 10;

  Fraction.prototype.gcd = function () {
    return (function gcd(u, v) {
      return ((u > 0) ? gcd(v % u, u) : v);
    })(numerator, denominator);
  };
  Fraction.prototype.reduce = function () {
    var _gcd = this.gcd();
    this.numerator /= _gcd;
    this.denominator /= _gcd;
  };

  Fraction.prototype.valueOf = function () {
    return numerator / denominator;
  };
  Fraction.prototype.toString = function () {
    return numerator + "/" + denominator;
  };


  return {
    evaluate: Fraction
  };
});


practiceGame.factory('practiceSrv',function(Utilities,$q,practiceRequests,Alerts){

  var Practice = {
    usersRunOutQuestions: function(){
      var options = {
        message: "You've answered all of the adaptive questions we have for you in "+$scope.activeTracks.trackTitle+".  " +
          "That's a lot of practice.  Would you like to work on a different track or go back to the main dashboard? ",
        title: "Congratulations!",
        buttons: {
          main: {
            label: "Go to Dashboard",
            className: "btn-primary",
            callback: function() {
              Utilities.redirect('#/' + $scope.activeGroupId + "/dashboard");
            }
          }
        }
      };

      Utilities.dialogService(options);

    },
    setLayoutBasedOnQuestionInfo: function (setLayout) {
      var panel1 = angular.element('#Panel1'),
        panel2 = angular.element('#Panel2');

      if (setLayout) {
        panel1.removeClass('col-md-offset-3');
        panel2.removeClass('col-md-offset-3');
      }
      else {
        panel1.addClass('col-md-offset-3');
        panel2.addClass('col-md-offset-3');
      }
    },
    resetLayout: function () {
      $scope.titleQuest = '';
      $scope.titleQuest = $scope.activeTracks.trackTitle + ' Explanation';
      this.setLayoutBasedOnQuestionInfo(true);
      angular.element('#skipAction').addClass('hide');
      angular.element('#nextAction').removeClass('btn-primary');
      angular.element('.list-group *').addClass('no-hover');
      $scope.nextActionTitle = 'Next Question';


    },
    nextQuestion: function () {
      this.loadQuestionsSet();

      //Enable/disable answer section
      $scope.numerator = null;
      $scope.denominator = null;
      angular.element('#answercontent *').removeClass('btn-primary btn-danger btn-success').removeAttr('disabled');
      $scope.showVideo = false;
      $scope.showExplanation = false;
      $scope.answerStatus = null;
      $scope.nextActionTitle = 'Confirm Choice';
      $scope.messageConfirmation = '';
      angular.element('#nextAction').removeClass('btn-success');
      angular.element('#skipAction').removeClass('hide');
      angular.element('#answersPanels').removeClass().addClass('fadeIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        angular.element(this).removeClass();
      });

    },
    loadQuestion: function (questionToRequest) {

      var setLayoutType = false;

      /*Get question and Create Round Session by Question*/
      var getQuestion = practiceRequests.questions().getQuestionById(questionToRequest),
        questionPresentation = practiceRequests.roundSessions().createQuestionPresentation($scope.gameResponseId, questionToRequest);

      $q.all([getQuestion, questionPresentation]).then(function (result) {

        var questionResult = result[0].data.question;
        $scope.answerObject = result[1].data;
        $scope.roundSessionAnswer = $scope.answerObject.round_session;

        Practice.setCurrentQuestionId(questionResult.id);
        Practice.setMailToInformation(questionResult.id);

        angular.element('.choice.active').removeClass('active');

        if ($scope.lastAnswerLoaded == '' || $scope.lastAnswerLoaded != questionResult.kind) {
          //  $scope.currentA = Utilities.findInArray(questionResult.kind, $scope.directives, 'type').id;
          $scope.lastAnswerLoaded = questionResult.kind;
        }

        $scope.items = [];
        $scope.stimulus = "";
        $scope.template = $scope.actualView;
        $scope.questionItems = questionResult;

        $scope.questionInformation = $sce.trustAsHtml(questionResult.question_set.info);

        /*Find if there is a question info defined or retrieve it by the API*/
        setLayoutType = angular.isDefined($scope.questionInformation) && $scope.questionInformation != null && $scope.questionInformation != '' ? true : false;

        /*Set the layout based on the question info*/
        Practice.setLayoutBasedOnQuestionInfo(setLayoutType);
        $scope.stimulus = $sce.trustAsHtml($scope.questionItems.stimulus);

        var options = $scope.optionList.toUpperCase().split(""),
          answers = $scope.questionItems.answers;
        angular.forEach(answers, function (value, index) {

          value["option"] = options[index];
          $scope.items.push(value);
        });
        $scope.position++;
        Practice.removeBadImage();

        $scope.loading = false;
      }).catch(function error(error) {

        Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
      });

    },


    tagResourcesInfo: function () {
      var tags = [];

      angular.forEach($scope.questionItems.tags, function (value) {
        tags.push({
          name: value.name,
          tagResource: Utilities.getYoutubeVideosInfo(value.tag_resources)
        });
      });
      $scope.tags = tags;

    },
    showAnswer: function () {
      this.resetLayout();

      /*Question Explanation*/
      $scope.questionExplanation = $scope.questionItems.explanation;

      if ($scope.questionExplanation != null)
        $scope.showExplanation = true;


      /*video validation*/
      if ($scope.questionItems.youtube_video_id !== null) {
        $scope.showVideo = true;
        $scope.videoId = $scope.questionItems.youtube_video_id;
        VideoService.setYouTubeTitle($scope.videoId).then(function (videoTime) {
          $scope.videoText = 'Video Explanation (' + videoTime + ')';
        });
      }

      /*Get answers from the previous request and Explain*/
      var answers = $scope.questionItems.answers;

      /*Evaluate tag resources info, get video Ids and video time*/
      Practice.tagResourcesInfo();

      $scope.xpTag = $scope.questionItems.experience_points;


      /*   Work with the styles to shown result
       define is some answer is bad.*/
      angular.element('.choice button').removeClass('btn-primary');

      angular.forEach(answers, function (value, key) {
        var selectIdButton = '#' + value.id;
        if (value.correct) {
          angular.element(selectIdButton).addClass('btn-success');
        }
      });

      angular.element("#answercontent *").prop('disabled', true);

    },
    displayGeneralConfirmInfo: function () {
      /* Question Explanation*/
      $scope.questionExplanation = $scope.questionItems.explanation;

      if ($scope.questionExplanation != null)
        $scope.showExplanation = true;


      /* video validation*/
      if ($scope.questionItems.youtube_video_id !== null) {
        $scope.showVideo = true;
        $scope.videoId = $scope.questionItems.youtube_video_id;
        VideoService.setYouTubeTitle($scope.videoId).then(function (videoTime) {
          $scope.videoText = 'Video Explanation (' + videoTime + ')';
        });
      }

      /*Evaluate tag resources info, get video Ids and video time*/
      Practice.tagResourcesInfo();
      $scope.xpTag = $scope.questionItems.experience_points;

      /* Work with the styles to shown result
       define is some answer is bad.*/
      $scope.answerStatus = true;
    },
    confirmChoice: function () {


      var selectedPosition = '', selectedOptions = [], selectedOptionsCount, i = 0;

      /*Get selected answers*/
      angular.element('.choice input[value=true]').each(function () {
        selectedPosition = $(this).attr('id');
        selectedOptions.push(selectedPosition);
      });

      selectedOptionsCount = selectedOptions.length;
      if (selectedOptionsCount > 0) {
        this.resetLayout();
        this.displayGeneralConfirmInfo();
        var answers = $scope.questionItems.answers;

        angular.element('.choice button').removeClass('btn-primary');
        angular.forEach(answers, function (value) {

          var selectIdButton = ('#' + value.id);

          /*set the correct class on the button*/
          if (value.correct) {
            if (Utilities.existsInArray(value.id, selectedOptions)) {
              /*Send answer response to server, important this line have to be inside this if
               * since just the users answers get into this evaluation
               * */
              $scope.answerObject.one($scope.roundSessionAnswer.id).put({answer_id: value.id });
            }
            else {
              $scope.answerStatus = false;
            }
            angular.element(selectIdButton).addClass('btn-success');

          }
          else {
            if (Utilities.existsInArray(value.id, selectedOptions)) {
              /*Send answer response to server, important this line have to be inside this if
               * since just the users answers get into this evaluation
               * */
              $scope.answerObject.one($scope.roundSessionAnswer.id).put({answer_id: value.id });
              angular.element(selectIdButton).addClass('btn-danger');
              angular.element(selectIdButton).parents('#answer').addClass('incorrectAnswer');
              $scope.answerStatus = false;
            }

          }

        });


        $scope.messageConfirmation = $scope.answerStatus ? 'Your answer was correct' : 'Your answer was incorrect';
        angular.element("#answercontent *").prop('disabled', true);
      }
      else {
        Alerts.showAlert('Please select an option!', 'warning');

      }
    },
    numericEntryConfirmChoice: function () {

      var userAnswer=0;
      /*Get selected answers*/

      if ($scope.numerator || $scope.denominator) {
        this.resetLayout();
        this.displayGeneralConfirmInfo();

        if ($scope.lastAnswerLoaded == 'NumericEntryFraction') {

          userAnswer=$scope.numerator+'/'+$scope.denominator;

        }
        else{
          userAnswer=$scope.numerator;
        }

        var answers = $scope.questionItems.answers;
        $scope.selectedAnswer = 0;

        angular.forEach(answers, function (value) {
          /*evaluate just one time the quivalence between body and numerator*/
          var answerEval = (value.body == userAnswer);

          if (answerEval)
            $scope.selectedAnswer = value.answer_id;

          $scope.answerStatus = answerEval;

        });

        $scope.answerObject.one($scope.roundSessionAnswer.id).put({answer_id: $scope.selectedAnswer});


        $scope.messageConfirmation = $scope.answerStatus ? 'Your answer was correct' : 'Your answer was incorrect';
        angular.element("#answercontent *").prop('disabled', true);
      }
      else {
        Alerts.showAlert(Alerts.setErrorApiMsg(error), 'warning');

      }


    },
    evaluateConfirmMethod: function () {
      switch ($scope.lastAnswerLoaded) {
        case 'NumericEntry':
        case 'NumericEntryFraction':
          Practice.numericEntryConfirmChoice();
          break;
        default:
          Practice.confirmChoice();
      }
    },
    setCurrentQuestionId: function (questionId) {

      Utilities.setCurrentParam('questionId', questionId);
      $location.path(Utilities.getCurrentParam('subject') + '/dashboard/practice/' + questionId);
    },
    getQuestionSets: function (gameId,tracks) {
      var getQuestionSet = practiceRequests.practiceGames().getQuestionNewSetByPractice(gameId, tracks);

      getQuestionSet.then(function (result) {

        if (result.data.question_sets.length > 0) {
          $scope.questionSetList = result.data.question_sets;
          Practice.loadQuestionsSet();
        }
        else {
          /*if user run out of the questions show message*/
          Practice.usersRunOutQuestions();

        }


      }).catch(function error(error) {

        Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');

      });

    },
    loadQuestionsSet: function () {

      if (angular.isDefined($scope.questionSetList) && $scope.questionSetList.length > 0) {

          /*if $scope.setPosition is bigger than $scope.questionSetList.length we already finish the list of question sets */
          if ($scope.setPosition < $scope.questionSetList.length) {
            $scope.titleQuest = '';
            $scope.titleQuest = $scope.activeTracks.trackTitle;

            var setPosition = $scope.setPosition,

            /* Iterate between all the question sets retrieved it by the API */
              questionSetResult = $scope.questionSetList[setPosition];

            var position = $scope.position,
            /* questionsCount Give us the number of questions by questionSet*/
              questionsCount = questionSetResult.questions.length;

            $scope.questByQSetTitle = questionsCount > 1 ? 'Question ' + (position + 1) + ' of ' + (questionsCount) + ' for this set' : '';


            /* Iterate between all the question retrieved it by the API which belong to a specific Question set */
            var questionIdToRequest = questionSetResult.questions[position];
            if (position < questionsCount) {

              Practice.loadQuestion(questionIdToRequest)
            }
            else {
              $scope.position = 0;
              $scope.setPosition++;
              Practice.loadQuestionsSet();
            }
          }
          else {
            /*If we finish with the first load of questions id/question sets que create a new game*/
            $scope.setPosition = 0;
            Practice.setCurrentQuestionId('_');
            Practice.getQuestionSets();
          }

        }

    },
    setMailToInformation: function (questionId) {

      $scope.subjectMail = 'Problem with ' + $scope.titleQuest + ' question #' + questionId;
    },
    removeBadImage: function () {
      /*This function was added to solve the problem with the img on LSAT, loaded from the content editor*/
      angular.element('img').error(function () {

        angular.element('img').attr('src', '');
      });
    }
  };


  return {

  }
});