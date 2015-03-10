(function() {
  'use strict';
  angular
    .module("grockitApp.practice.services")
    .factory('practiceUtilities', practiceUtilities)
    .factory('Level', Level)
    .factory('SplashMessages', SplashMessages)

  practiceUtilities.$inject = ['$window', '$q', '$sce', 'utilities', 'practiceResource', 'alerts', 'YoutubeVideoApi', 'practiceConstants'];
  SplashMessages.$inject = ['utilities'];

  function practiceUtilities($window, $q, $sce, utilities, practiceResource, alerts, YoutubeVideoApi, practiceConstants) {

    /*Internal Service Functions*/
    var _internalFn = {
      setQuestionTypeMatrixGroups: function(items) {
        return _.forEach(items, function(answer, i) {
          answer["matrix_group"] = ((i - (i % 3)) / 3);
        });
      },
      removeBadImage: function() {
        /*This function was added to solve the problem with the img on LSAT, loaded from the content editor*/
        angular.element('img').error(function() {

          angular.element('img').attr('src', '');
        });
      },
      validateAnswer: function(questionType, correctAnswers, selectedAnswers) {
        var isValid = false;

        if (questionType === 'MultipleChoiceOneOrMoreCorrect')

          isValid = selectedAnswers.length > 0 ? true : false;
        else
          isValid = correctAnswers.length === selectedAnswers.length ? true : false;

        return isValid;
      },
      validateLayout: function(questionObj){
        return angular.isDefined(questionObj.questionInformation) && questionObj.questionInformation != null &&
          questionObj.questionInformation != '' ? true : false;
      }

    };

    var service = {
      presentQuestion: presentQuestion,
      confirmChoice: confirmChoice,
      resetLayout: resetLayout,
      parseTagsAndResources: parseTagsAndResources,
      displayGeneralConfirmInfo: displayGeneralConfirmInfo,
      getVideoExplanation: getVideoExplanation,
      doNotKnowAnswer: doNotKnowAnswer,
      numericEntryConfirmChoice: numericEntryConfirmChoice,
      setMailToInformation: setMailToInformation,
      usersRunOutQuestions: usersRunOutQuestions,
      getAnswerType: getAnswerType,
      setCurrentTrack: setCurrentTrack,
      showQuestionError: showQuestionError,
      setOneColumnLayout:setOneColumnLayout
    };
    return service;

    function setOneColumnLayout(questionData) {
      var w = angular.element($window),
        getWidth = function() {
          return w.width()
        },
        setWidth = function() {
          if (getWidth() <= 1360) {
            return questionData.setLayoutOneColumn = false;
          } else {
           return questionData.setLayoutOneColumn = _internalFn.validateLayout(questionData);
          }
        };
        setWidth();
        w.bind('resize', function() {
          setWidth();
        });

    }

    function presentQuestion(questionResponse) {
      try {
        var resultObject = {},
          setLayoutType = null;

        resultObject = questionResponse;

        resultObject.fixedWidth = resultObject.question_set.fixed_info_width;
        resultObject.questionInformation = $sce.trustAsHtml(resultObject.question_set.info);

        /*Find if there is a question info defined or retrieve it by the API*/
        resultObject.setLayoutOneColumn = _internalFn.validateLayout(resultObject);

        /*@Jose TODO This can be performed on a better way*/
        angular.element('.choice.active').removeClass('active');

        resultObject.items = [];
        resultObject.stimulus = $sce.trustAsHtml(questionResponse.stimulus);
        var optionList = practiceConstants.optionList,
          options = optionList.toUpperCase().split(""),
          answers = resultObject.answers,
          len = angular.isDefined(answers) ? answers.length : 0,
          i;

        for (i = 0; i < len; i++) {
          var value = answers[i];
          value.body = $sce.trustAsHtml(value.body);
          value["option"] = options[i];
          value["selected"] = false;
          //Default message for crossOut
          value['crossOutMsg']= 'Remove this option';
          value["hasExplanation"] = !(value.explanation === null || angular.isUndefined(value.explanation) || value.explanation === '');
          resultObject.items.push(value);
        }
        if (resultObject.kind === 'MultipleChoiceMatrixTwoByThree' || resultObject.kind === 'MultipleChoiceMatrixThreeByThree') {
          resultObject.items = _internalFn.setQuestionTypeMatrixGroups(resultObject.items);
        }

        _internalFn.removeBadImage();
        return resultObject;

      } catch (e) {

      }
    }

    function confirmChoice(questionResult, roundSessionAnswer, answers, questionType, groupId) {
      var answerStatus = true,
        selectAnswers = [],
        correctAnswers = _.filter(answers, {
          'correct': true
        }),
        selectedAnswers = _.filter(answers, {
          'selected': true
        }),
        isValid = _internalFn.validateAnswer(questionType, correctAnswers, selectedAnswers);

      if (isValid) {

        _.forEach(answers, function(result) {
          var selectIdButton = ('#' + result.id);
          if (result.correct) {
            if (result.selected) {
              selectAnswers.push(result.id);
            } else {
              answerStatus = false;
            }
          } else {
            if (result.selected) {
              selectAnswers.push(result.id);
              angular.element(selectIdButton).parents('#answer').addClass('incorrectAnswer');
              answerStatus = false;
            }
          }

        });

        if (angular.isDefined(roundSessionAnswer) && angular.isDefined(selectAnswers) && selectAnswers.length >= 1) {
          practiceResource.sendUserReponse(roundSessionAnswer.id, selectAnswers, groupId, answerStatus);
        }
        angular.element("#answercontent *").prop('disabled', true);

        return answerStatus;
      }
    }

    function resetLayout() {
      angular.element('#skipAction').addClass('hide');
      angular.element('#nextAction').removeClass('btn-primary');
      angular.element('.list-group *').addClass('no-hover');
    }

    function parseTagsAndResources(tags) {
      var parsedTags = [],
        parsedResources = [],
        tgR = {},
        tagsLen = tags.length,
        i, j;

      for (i = 0; i < tagsLen; i++) {
        var tagR = tags[i].tag_resources,
          tagRLen = tagR.length,
          currentTag = tags[i];

        if (!_.find(parsedTags, function(tag) {
            return tag.name === currentTag.name;
          })) {
          parsedTags.push(currentTag);
        }

        for (j = 0; j < tagRLen; j++) {
          var currentTagResource = tagR[j];
          tgR = {
            name: currentTag.name,
            resource_type: currentTagResource.resource_type,
            resource: currentTagResource.resource_type == 'youtube' ? utilities.getYoutubeVideosId(currentTagResource.resource) : currentTagResource.resource
          };
          parsedResources.push(tgR);
        }
      }
      return {
        tags: parsedTags,
        resources: parsedResources
      };
    }

    function displayGeneralConfirmInfo(questionResult) {
      var generalObject = {};
      generalObject.questionExplanation = $sce.trustAsHtml(questionResult.explanation);

      if (generalObject.questionExplanation != null)
        generalObject.showExplanation = true;

      /*Evaluate tag resources info, get video Ids and video time*/
      var parsedTags = this.parseTagsAndResources(questionResult.tags);

      generalObject.tagsResources = parsedTags.resources;
      generalObject.tags = parsedTags.tags;
      generalObject.xpTag = questionResult.experience_points;
      return generalObject;
    }

    function getVideoExplanation(questionResult) {
      var deferred = $q.defer(),
        videoObject = {};

      /* video validation*/
      if (questionResult.youtube_video_id !== null) {
        videoObject.showVideo = true;
        videoObject.videoId = questionResult.youtube_video_id;
        YoutubeVideoApi.setYouTubeTitle(videoObject.videoId).then(function(videoTime) {
          videoObject.videoText = 'Video Explanation (' + videoTime + ')';
          deferred.resolve(videoObject);
        });
      } else {
        deferred.resolve(videoObject);
      }


      return deferred.promise;
    }

    function doNotKnowAnswer(questionResult) {
      var resultObject = {};
      /*Question Explanation*/
      resultObject.questionExplanation = $sce.trustAsHtml(questionResult.explanation);

      if (resultObject.questionExplanation != null)
        resultObject.showExplanation = true;

      /*Get answers from the previous request and Explain*/
      var answers = questionResult.answers,
        len = questionResult.answers.length,
        i,
        parsedTags = this.parseTagsAndResources(questionResult.tags);

      resultObject.tagsResources = parsedTags.resources;
      resultObject.tags = parsedTags.tags;

      resultObject.xpTag = questionResult.experience_points;

      angular.element("#answercontent *").prop('disabled', true);
      return resultObject;
    }

    function numericEntryConfirmChoice(options) {

      var userAnswer = 0,
        selectedAnswer = 0,
        answerStatus = true,
        answers = '',
        numerator = options.numerator,
        denominator = options.denominator,
        lastAnswerLoaded = options.lastAnswerLoaded,
        questionResult = options.questionResult,
        groupId = options.groupId,
        roundSessionAnswer = options.roundSessionAnswer;
      /*Get selected answers*/

      if (numerator || denominator) {
        if (numerator > 0 && denominator > 0) {

          userAnswer = numerator + '/' + denominator;
        } else {
          userAnswer = numerator;
        }

        answers = questionResult.answers;
        var len = answers.length,
          answerFound = false,
          i, userAns = eval(userAnswer),
          selectedAnswer = [];

        for (i = 0; i < len; i++) {
          var answer = answers[i],
            correctAns = eval(answer.body.valueOf());
          var rang1 = (correctAns - 0.02 < 0) ? 0 : (correctAns - 0.02),
            rang2 = (correctAns + 0.02),
            answerEval = (answer.body.valueOf() === userAnswer || (userAns >= rang1 && userAns <= rang2));

          if (answerEval && !answerFound) {
            answerFound = true;
            var ansId = angular.isDefined(answer.answer_id) ? answer.answer_id : answer.id;
            selectedAnswer.push(ansId);
          }
          answerStatus = answerEval;
        };

        /*if loop couldn't find a possible answer then array wont have data, then user data will be push to it*/
        if (selectedAnswer.length < 1) {
          selectedAnswer.push(userAnswer);
          answerStatus = false;
        }

        if (angular.isDefined(roundSessionAnswer)) {
          practiceResource.sendUserReponse(roundSessionAnswer.id, selectedAnswer, groupId, answerStatus);
        }
        angular.element("#answercontent *").prop('disabled', true);
        return answerStatus;

      }
    }

    function setMailToInformation(questionId, titleQuest) {
      return 'Problem with ' + titleQuest + ' question #' + questionId;
    }

    function usersRunOutQuestions(trackTitle, activeGroupId) {
      var options = {
        message: "You've answered all of the adaptive questions we have for you in " + trackTitle + ".  " +
          "That's a lot of practice.  Would you like to review questions you've answered or go back to the main dashboard? ",
        title: "Congratulations!",
        buttons: {
          review: {
            label: "Go to Review",
            className: "btn-info",
            callback: function() {
              utilities.redirect('https://grockit.com/reviews');
            }
          },
          main: {
            label: "Go to Dashboard",
            className: "btn-primary",
            callback: function() {
              utilities.internalRedirect('/' + activeGroupId + "/dashboard");
            }
          }
        }
      };
      utilities.dialogService(options);
    }

    function getAnswerType(questionKind) {
      var template = '';

      switch (questionKind) {
        case 'MultipleChoiceOneCorrect':
          template = "_oneChoice.directive.html";
          break;
        case 'MultipleChoiceOneOrMoreCorrect':
          template = "_multipleChoice.directive.html";
          break;
        case 'MultipleChoiceMatrixTwoByThree':
          template = "_matrix2x3.directive.html";
          break;
        case 'MultipleChoiceMatrixThreeByThree':
          template = "_matrix3x3.directive.html";
          break;
        case 'NumericEntryFraction':
          template = "_fraction.directive.html";
          break;
        case 'SPR':
          template = "_provisionalSat.directive.html";
          break;
        case 'NumericEntry':
          template = "_numeric.directive.html";
          break;
        case 'sat':
          template = "_sat.directive.html";
          break;
        case 'MultipleChoiceTwoCorrect':
          template = "_twoChoice.directive.html";
          break;
      }

      return practiceConstants.questionTypesUrl + template;
    }

    function setCurrentTrack(groupId) {
      var deferred = $q.defer(),
        trackData = utilities.getActiveTrack();
      if (angular.isDefined(trackData.subject)) {
        deferred.resolve(trackData);
      } else {
        practiceResource.getRandomTrack(groupId)
          .then(function(response) {
            var tracks = response.data.dashboard.smart_practice.items,
              index = _.random(0, tracks.length - 1),
              currentTrack = tracks[index];
            utilities.setActiveTrack(currentTrack, currentTrack.id);
            deferred.resolve(utilities.getActiveTrack());
          });

      }

      return deferred.promise;
    }

    function showQuestionError(questionKind) {
      var message = '';

      switch (questionKind) {
        case 'MultipleChoiceOneCorrect':
        case 'MultipleChoiceOneOrMoreCorrect':
          message = 'Please select an option!';
          break;
        case 'MultipleChoiceMatrixTwoByThree':
        case 'MultipleChoiceMatrixThreeByThree':
          message = 'Please select at least one option of each section!';
          break;
        case 'MultipleChoiceTwoCorrect':
          message = 'Please select at least two options!';
          break;
        default:
          message = 'Required';
          break;
      }
      return message;
    }
  }

  function Level() {
    var messages = {
      2: 'Lowest',
      4: 'Low',
      8: 'Medium',
      16: 'High',
      32: 'Highest'
    }
    return {
      getMessage: function(level) {
        return messages[level];
      }
    }
  }

  function SplashMessages(utilities) {
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
      'Waiting for approval from Bill Gates...',
      'Adapting your practice questions...',
      'Supercharging your study...'
    ];
    return {
      getLoadingMessage: function() {
        return loadingMessages[utilities.random(loadingMessages.length - 1)];
      }
    };
  }

})();
