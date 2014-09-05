'use strict';
/*Services to manage diretives logic*/

practiceGame.factory('questionTypesService', function () {

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
      scope.isNumeratorValid = validateNumber(newVal);
      handleValidation(scope.isNumeratorValid);
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
    if (angular.isUndefined(value) || value === '' || value === null) {
      return null;
    } else {
      value = value * 1;
      return (angular.isDefined(value) && value != null && !isNaN(value) && angular.isNumber(value));
    }
  }

  function handleValidation(isValid) {
    var nexAction = $('#nextAction'),
      seeAnswer = $('#skipAction');
    if (isValid) {
      nexAction.addClass('btn-primary');
      seeAnswer.addClass('hide');
    }
    else {
      nexAction.removeClass('btn-primary');
      seeAnswer.removeClass('hide');
    }
  }

  return {
    satFactory: satFactory,
    numericEntry: numericEntry,
    fractionEntry: fractionEntry
  };
});

practiceGame.factory('practiceSrv', function (Utilities, $q, practiceRequests, Alerts, $sce, VideoService, environmentCons, $resource) {

  var optionList = "abcdefghijklmnopqrstuvwxyz",
    Practice = {
      /*This methods takes care to set the practice layout based on the API response*/
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
      removeBadImage: function () {
        /*This function was added to solve the problem with the img on LSAT, loaded from the content editor*/
        angular.element('img').error(function () {

          angular.element('img').attr('src', '');
        });
      }
    };

  return {
    getRoundSession: function (questionToRequest, gameId) {
      var deferred = $q.defer(), resultObject = {};
      practiceRequests.roundSessions().createQuestionPresentation(gameId, questionToRequest).then(function (result) {

        resultObject.roundSessionAnswer = result.data.round_session;
        deferred.resolve(resultObject);

      }).catch(function errorHandler(e) {
        deferred.reject(resultObject);
        Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
      });
      return deferred.promise;
    },
    loadQuestion: function (questionToRequest) {
      var deferred = $q.defer(),
        setLayoutType = false, resultObject = {};

      practiceRequests.questions().getQuestionById(questionToRequest).then(function (result) {

        resultObject.questionResult = result.data.question;

        if (resultObject.lastAnswerLoaded == '' || resultObject.lastAnswerLoaded != resultObject.questionResult.kind) {
          resultObject.lastAnswerLoaded = resultObject.questionResult.kind;
        }
        resultObject.questionInformation = $sce.trustAsHtml(resultObject.questionResult.question_set.info);

        /*Find if there is a question info defined or retrieve it by the API*/
        setLayoutType = angular.isDefined(resultObject.questionInformation) && resultObject.questionInformation != null && resultObject.questionInformation != '' ? true : false;

        /*Set the layout based on the question info*/
        Practice.setLayoutBasedOnQuestionInfo(setLayoutType);

        /*@Jose TODO This can be performed on a better way*/
        angular.element('.choice.active').removeClass('active');

        resultObject.items = [];
        resultObject.stimulus = "";

        resultObject.stimulus = $sce.trustAsHtml(resultObject.questionResult.stimulus);

        var options = optionList.toUpperCase().split(""),
          answers = resultObject.questionResult.answers,
          len = answers.length, i;

        for (i = 0; i < len; i++) {
          var value = answers[i];
          value["option"] = options[i];
          value["selected"] = false;
          resultObject.items.push(value);
        }
        Practice.removeBadImage();
        deferred.resolve(resultObject);

      })
        .catch(function errorHandler(e) {
          deferred.reject(resultObject);
          Alerts.showAlert(Alerts.setErrorApiMsg(e), 'danger');
        });

      return deferred.promise;

    },
    confirmChoice: function (questionResult, roundSessionAnswer, answers) {
      var i, answerStatus = true, len = answers.length,
        areSelectedAnswers = _.filter(answers, {'selected': true});
      if (areSelectedAnswers.length > 0) {
        angular.element('.choice button').removeClass('btn-primary');

        for (i = 0; i < len; i++) {
          var answer = answers[i], selectIdButton = ('#' + answer.id);
          if (answer.correct) {
            if (answer.selected) {
              /*Send answer response to server, important this line have to be inside this if
               * since just the users answers get into this evaluation
               * */

              practiceRequests.roundSessions().updateAnswer(roundSessionAnswer.id, answer.id);
            }
            else {
              answerStatus = false;
            }
            angular.element(selectIdButton).addClass('btn-success');

          }
          else {
            if (answer.selected) {
              /*Send answer response to server, important this line have to be inside this if
               * since just the users answers get into this evaluation
               * */
              practiceRequests.roundSessions().updateAnswer(roundSessionAnswer.id, answer.id);
              angular.element(selectIdButton).addClass('btn-danger');
              angular.element(selectIdButton).parents('#answer').addClass('incorrectAnswer');
              answerStatus = false;
            }

          }

        }
        angular.element("#answercontent *").prop('disabled', true);

        return answerStatus;

      }
      else {
        Alerts.showAlert('Please select an option!', 'warning');
      }

    },
    resetLayout: function () {
      Practice.setLayoutBasedOnQuestionInfo(true);
      angular.element('#skipAction').addClass('hide');
      angular.element('#nextAction').removeClass('btn-primary');
      angular.element('.list-group *').addClass('no-hover');

    },
    parseTagsAndResources: function (tags) {
      var parsedTags = [],
        parsedResources = [],
        tgR = {};
      angular.forEach(tags, function (value) {
        var tagR = value.tag_resources;
        if (!Utilities.findInCollection(parsedTags, function (tag) { return tag.name === value.name; }))
          parsedTags.push(value);
        angular.forEach(tagR, function (val) {
          tgR = {
            name: value.name,
            resource_type: val.resource_type,
            resource: val.resource_type == 'youtube' ? Utilities.getYoutubeVideosId(val.resource) : val.resource
          };
          parsedResources.push(tgR);
        });
      });
      return {tags: parsedTags, resources: parsedResources};
    },
    displayGeneralConfirmInfo: function (questionResult) {
      var generalObject = {};
      /* Question Explanation*/
      generalObject.questionExplanation = questionResult.explanation;

      if (generalObject.questionExplanation != null)
        generalObject.showExplanation = true;

      /*Evaluate tag resources info, get video Ids and video time*/
      var parsedTags = this.parseTagsAndResources(questionResult.tags);

      generalObject.tagsResources = parsedTags.resources;
      generalObject.tags = parsedTags.tags;
      generalObject.xpTag = questionResult.experience_points;
      return generalObject;
    },
    getVideoExplanation: function(questionResult){
      var deferred = $q.defer(), videoObject={};

      /* video validation*/
      if (questionResult.youtube_video_id !== null) {
        videoObject.showVideo = true;
        videoObject.videoId = questionResult.youtube_video_id;
        VideoService.setYouTubeTitle(videoObject.videoId).then(function (videoTime) {
          videoObject.videoText = 'Video Explanation (' + videoTime + ')';
          deferred.resolve(videoObject);
        });
      }
      else {
        deferred.resolve(videoObject);
      }


      return deferred.promise;
    },
    doNotKnowAnswer: function (questionResult) {
      var resultObject = {};
      /*Question Explanation*/
      resultObject.questionExplanation = questionResult.explanation;

      if (resultObject.questionExplanation != null)
        resultObject.showExplanation = true;

      /*Get answers from the previous request and Explain*/
      var answers = questionResult.answers,len=questionResult.answers.length,i,
          parsedTags = this.parseTagsAndResources(questionResult.tags);

      resultObject.tagsResources = parsedTags.resources;
      resultObject.tags = parsedTags.tags;

      resultObject.xpTag = questionResult.experience_points;

      /*   Work with the styles to shown result
       define is some answer is bad.*/
      angular.element('.choice button').removeClass('btn-primary');

      for (i = 0; i < len; i++) {
          var answer = answers[i], selectIdButton = '#' + answer.id;
        if (answer.correct) {
          angular.element(selectIdButton).addClass('btn-success');
        }
      };

      angular.element("#answercontent *").prop('disabled', true);
      return resultObject;
    },
    numericEntryConfirmChoice: function (options) {

      var userAnswer = 0, selectedAnswer = 0,answerStatus=true, answers = '',
        numerator = options.numerator,
        denominator = options.denominator, lastAnswerLoaded = options.lastAnswerLoaded,
        questionResult = options.questionResult, roundSessionAnswer = options.roundSessionAnswer;
      /*Get selected answers*/

      if (numerator || denominator) {


        if (numerator>0 && denominator>0) {

          userAnswer = numerator + '/' + denominator;
        }
        else {
          userAnswer = numerator;
        }

        answers = questionResult.answers;
        var len = answers.length,i,roundAnswer=(eval(userAnswer).toFixed(1));
        selectedAnswer = 0;

        for (i = 0; i < len; i++) {
          var answer= answers[i],

          /*evaluate just one time the equivalence between body and numerator*/
            answerEval = (answer.body === userAnswer || eval(answer.body).toFixed(1) === roundAnswer);

          if (answerEval)
            selectedAnswer = answer.answer_id;

          answerStatus = answerEval;
        };

        practiceRequests.roundSessions().updateAnswer(roundSessionAnswer.id, selectedAnswer);

        angular.element("#answercontent *").prop('disabled', true);
        return answerStatus;

      }
      else {
        Alerts.showAlert(Alerts.setErrorApiMsg(error), 'warning');

      }


    },
    getTimingInformation: function (trackId, groupId, questionId) {
      var url = environmentCons.timingData + groupId + '/' + trackId + '/' + questionId + '.json';
      return $resource(url).query({array: true});

    },
    setMailToInformation: function (questionId, titleQuest) {
      return 'Problem with ' + titleQuest + ' question #' + questionId;
    },
    usersRunOutQuestions: function (trackTitle, activeGroupId) {
      var options = {
        message: "You've answered all of the adaptive questions we have for you in " + trackTitle + ".  " +
          "That's a lot of practice.  Would you like to review questions you've answered or go back to the main dashboard? ",
        title: "Congratulations!",
        buttons: {
          review: {
            label: "Go to Review",
            className: "btn-info",
            callback: function () {
              Utilities.redirect('https://grockit.com/reviews');
            }
          },
          main: {
            label: "Go to Dashboard",
            className: "btn-primary",
            callback: function () {
              Utilities.redirect('#/' + activeGroupId + "/dashboard");
            }
          }


        }
      };

      Utilities.dialogService(options);

    }
  }
});


practiceGame.factory('Level', function () {
  var messages = {2: 'Lowest', 4: 'Low', 8: 'Medium', 16: 'High', 32: 'Highest'};
  return {
    getMessage: function (level) {
      return messages[level];
    }
  };
});

practiceGame.factory('SplashMessages', function (Utilities) {
  var loadingMessages = [
    'Spinning up the hamster...',
    'Shovelling coal into the server...',
    'Programming the flux capacitor',
    'Adjusting data for your IQ...',
    'Generating next funny line...',
    'Entertaining you while you wait...',
    'Improving your reading skills...',
    'Dividing eternity by zero, please be patient...',
    'Just stalling to simulate activity...',
    'Adding random changes to your data...',
    'Waiting for approval from Bill Gates...'
  ];
  return {
    getLoadingMessage: function () {
      return loadingMessages[Utilities.random(loadingMessages.length - 1)];
    }
  };
});

