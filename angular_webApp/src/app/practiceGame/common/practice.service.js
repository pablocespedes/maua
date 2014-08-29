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

practiceGame.factory('practiceSrv', function (Utilities, $q, practiceRequests, Alerts, $sce, VideoService, environmentCons,$resource) {

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
    loadQuestion: function (questionToRequest, gameId) {
      var deferred = $q.defer(),
        setLayoutType = false, resultObject = {},

      /*Get question and Create Round Session by Question*/
        getQuestion = practiceRequests.questions().getQuestionById(questionToRequest),
        questionPresentation = practiceRequests.roundSessions().createQuestionPresentation(gameId, questionToRequest);

      $q.all([getQuestion, questionPresentation]).then(function (result) {

        resultObject.questionResult = result[0].data.question;

        if (resultObject.lastAnswerLoaded == '' || resultObject.lastAnswerLoaded != resultObject.questionResult.kind) {
          resultObject.lastAnswerLoaded = resultObject.questionResult.kind;
        }
        resultObject.questionInformation = $sce.trustAsHtml(resultObject.questionResult.question_set.info);

        /*Find if there is a question info defined or retrieve it by the API*/
        setLayoutType = angular.isDefined(resultObject.questionInformation) && resultObject.questionInformation != null && resultObject.questionInformation != '' ? true : false;

        /*Set the layout based on the question info*/
        Practice.setLayoutBasedOnQuestionInfo(setLayoutType);

        resultObject.answerObject = result[1].data;
        resultObject.roundSessionAnswer = result[1].data.round_session;

        /*@Jose TODO This can be performed on a better way*/
        angular.element('.choice.active').removeClass('active');

        resultObject.items = [];
        resultObject.stimulus = "";

        resultObject.stimulus = $sce.trustAsHtml(resultObject.questionResult.stimulus);

        var options = optionList.toUpperCase().split(""),
          answers = resultObject.questionResult.answers;
        angular.forEach(answers, function (value, index) {

          value["option"] = options[index];
          value["selected"] = false;
          resultObject.items.push(value);
        });
        Practice.removeBadImage();
        deferred.resolve(resultObject);

      })
        .catch(function error(error) {
          deferred.reject(resultObject);
          Alerts.showAlert(Alerts.setErrorApiMsg(error), 'danger');
        });

      return deferred.promise;

    },
    confirmChoice: function (questionResult, roundSessionAnswer,answers) {
      var selectedPosition = '', selectedOptions = [], selectedOptionsCount, i = 0, answerStatus = true;

      /*Get selected answers*/

      angular.forEach(answers, function (answer) {
        if(answer.selected) {
          selectedPosition = angular.isDefined(answer.answer_id)? answer.answer_id : answer.id;
          selectedOptions.push(selectedPosition);
        }
      });

      selectedOptionsCount = selectedOptions.length;
      if (selectedOptionsCount > 0) {

        angular.element('.choice button').removeClass('btn-primary');

        angular.forEach(answers, function (value) {

          var selectIdButton = ('#' + value.id);

          /*set the correct class on the button*/
          if (value.correct) {
            if (Utilities.findInCollection(selectedOptions,value.id)) {
              /*Send answer response to server, important this line have to be inside this if
               * since just the users answers get into this evaluation
               * */

              practiceRequests.roundSessions().updateAnswer(roundSessionAnswer.id, value.id);
            }
            else {
              answerStatus = false;
            }
            angular.element(selectIdButton).addClass('btn-success');

          }
          else {
            if (Utilities.findInCollection(selectedOptions,function(val){ return val === value.id})) {
              /*Send answer response to server, important this line have to be inside this if
               * since just the users answers get into this evaluation
               * */
              practiceRequests.roundSessions().updateAnswer(roundSessionAnswer.id, value.id);
              angular.element(selectIdButton).addClass('btn-danger');
              angular.element(selectIdButton).parents('#answer').addClass('incorrectAnswer');
              answerStatus = false;
            }

          }

        });

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
    parseTagsAndResources: function(tags) {
      var parsedTags = [],
          parsedResources = [],
          tgR = {};
      angular.forEach(tags, function (value) {
        var tagR = value.tag_resources;
        if (!_.find(parsedTags, function(tag) { return tag.name === value.name; }))
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
      var deferred = $q.defer(), generalObject = {}, tags = [];
      /* Question Explanation*/
      generalObject.questionExplanation = questionResult.explanation;

      if (generalObject.questionExplanation != null)
        generalObject.showExplanation = true;

      /*Evaluate tag resources info, get video Ids and video time*/
      var parsedTags = this.parseTagsAndResources(questionResult.tags);

      generalObject.tagsResources = parsedTags.resources;
      generalObject.tags = parsedTags.tags;
      generalObject.xpTag = questionResult.experience_points;

      /* Work with the styles to shown result
       define is some answer is bad.*/
      /*
       answerStatus = true;*/

      /* video validation*/
      if (questionResult.youtube_video_id !== null) {
        generalObject.showVideo = true;
        generalObject.videoId = questionResult.youtube_video_id;
        VideoService.setYouTubeTitle(generalObject.videoId).then(function (videoTime) {
          generalObject.videoText = 'Video Explanation (' + videoTime + ')';
          deferred.resolve(generalObject);
        });
      }
      else {
        deferred.resolve(generalObject);
      }

      return deferred.promise;

    },
    doNotKnowAnswer: function (questionResult) {
      var deferred = $q.defer(), resultObject = {};
      /*Question Explanation*/
      resultObject.questionExplanation = questionResult.explanation;

      if (resultObject.questionExplanation != null)
        resultObject.showExplanation = true;


      /*Get answers from the previous request and Explain*/
      var answers = questionResult.answers;

      /*Evaluate tag resources info, get video Ids and video time*/
      var parsedTags = this.parseTagsAndResources(questionResult.tags);

      resultObject.tagsResources = parsedTags.resources;
      resultObject.tags = parsedTags.tags;

      resultObject.xpTag = questionResult.experience_points;


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

      /*video validation*/
      if (questionResult.youtube_video_id !== null) {
        resultObject.showVideo = true;
        resultObject.videoId = questionResult.youtube_video_id;
        VideoService.setYouTubeTitle(resultObject.videoId).then(function (videoTime) {
          resultObject.videoText = 'Video Explanation (' + videoTime + ')';
          deferred.resolve(resultObject);
        });
      }
      else {
        deferred.resolve(resultObject);
      }

      return deferred.promise;
    },
    numericEntryConfirmChoice: function (options) {

      var userAnswer = 0, resultObject = {}, selectedAnswer = 0, answers = '',
        numerator = options.numerator,
        denominator = options.denominator, lastAnswerLoaded = options.lastAnswerLoaded,
        questionResult = options.questionResult, roundSessionAnswer = options.roundSessionAnswer;
      /*Get selected answers*/

      if (numerator || denominator) {


        if (lastAnswerLoaded == 'NumericEntryFraction') {

          userAnswer = numerator + '/' + denominator;
        }
        else {
          userAnswer = numerator;
        }

        answers = questionResult.answers;
        selectedAnswer = 0;

        angular.forEach(answers, function (value) {
          /*evaluate just one time the quivalence between body and numerator*/
          var answerEval = (value.body == userAnswer);

          if (answerEval)
            selectedAnswer = value.answer_id;

          resultObject.answerStatus = answerEval;

        });
        practiceRequests.roundSessions().updateAnswer(roundSessionAnswer.id, selectedAnswer);


        angular.element("#answercontent *").prop('disabled', true);
        return resultObject.answerStatus;

      }
      else {
        Alerts.showAlert(Alerts.setErrorApiMsg(error), 'warning');

      }


    },
    getTimingInformation: function (trackId, groupId, questionId) {
       var url = environmentCons.timingData+ groupId+'/'+trackId+'/'+questionId+'.json';
      return $resource(url).query({array:true});

    },
    setMailToInformation: function (questionId, titleQuest) {
      return 'Problem with ' + titleQuest + ' question #' + questionId;
    },
    usersRunOutQuestions: function (trackTitle,activeGroupId) {
      var options = {
        message: "You've answered all of the adaptive questions we have for you in " + trackTitle + ".  " +
          "That's a lot of practice.  Would you like to work on a different track or go back to the main dashboard? ",
        title: "Congratulations!",
        buttons: {
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

practiceGame.factory('Level', function() {
  var messages = {2: 'Easy', 4: 'Easy/Medium', 8: 'Medium', 16: 'Medium/Hard', 32: 'Hard'};
  return {
    getMessage: function(level) {
      return messages[level];
    }
  };
});

practiceGame.factory('SplashMessages', function(Utilities) {
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

