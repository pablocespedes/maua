(function() {
  angular
  .module('grockitApp.question')
  .controller('ReviewController', ReviewController);

  /*Manually injection will avoid any minification or injection problem*/
  ReviewController.$inject = ['$scope', 'practiceUtilities', 'currentProduct', 'practiceResource','ReviewAPI'];

  function ReviewController($scope, practiceUtilities, currentProduct, practiceResource,ReviewAPI) {
    /* jshint validthis: true */
    var vmPr = this,
    reviewObserver = null;

    vmPr.breadcrumbs = breadcrumbs;

    vmPr.explanationInfo = {};
    vmPr.videoInfo = {};
    vmPr.portalC = vmPr;
    vmPr.loading = true;
    vmPr.answerStatus = null;
    vmPr.explanationInfo.showExplanation = true;
    vmPr.videoInfo.showVideo = false;
    vmPr.answerHasExplanation = answerHasExplanation;

    /*Takes care to unregister the group once the user leaves the controller*/
    $scope.$on("$destroy", function() {
      currentProduct.unregisterGroup(reviewObserver);
    });

    init();


    function init() {
      reviewObserver = currentProduct.observeGroupId().register(function(groupId) {
        if (vmPr.activeGroupId !== groupId) {
          vmPr.activeGroupId = groupId;
          vmPr.questionAnalytics = (vmPr.activeGroupId === 'gmat' || vmPr.activeGroupId === 'act' || vmPr.activeGroupId === 'sat' || vmPr.activeGroupId === 'gre');

          var roundSessionId = utilities.getCurrentParam('rounSessionId');
          if (angular.isDefined(roundSessionId)) {
            Review.getRounSessionData(vmPr.activeGroupId,roundSessionId);
          }
        }

      });

    };

    function answerHasExplanation(index) {
      var answer = vmPr.questionData.answers[index];
      return !(answer.explanation == null || angular.isUndefined(answer.explanation) || answer.explanation == '');
    }

    var Review = {
      getRounSessionData: function(grouId,roundSessionId){
          ReviewAPI.getRoundSession(grouId,roundSessionId).then(function(response){
              var roundResponse = response.data.round_session;
              vmPr.answerStatus= roundResponse.outcome;
              Review.getQuestion(roundResponse.question_id);
          })
      },
      getQuestion: function(questionId) {
        practiceResource.getQuestionFromApi(questionId).then(function(questionResponse) {
          if (angular.isDefined(questionResponse)) {
            practiceResource.setQuestionData(questionResponse);
            Review.presentQuestion();
          }
        });
      },
      presentQuestion: function() {
        var questionData = practiceUtilities.presentQuestion(practiceResource.getQuestionData());

        if (angular.isDefined(questionData)) {

          vmPr.questionData = questionData;
          vmPr.answerType = practiceUtilities.getAnswerType(questionData.kind);

          vmPr.items = [];
          vmPr.items = questionData.items;
          vmPr.loading = false;

          if (vmPr.questionAnalytics) {
            Review.setTimingInformation(questionData.id, questionData.kind);
          }
          Review.displayExplanationInfo();
        }
      },
      displayExplanationInfo: function() {
        var generalInfo = practiceUtilities.displayGeneralConfirmInfo(vmPr.questionData);
        vmPr.explanationInfo = info;
        practiceUtilities.getVideoExplanation(vmPr.questionData)
        .then(function(videoInfo) {
          vmPr.videoInfo = videoInfo;
        });
      },
       setTimingInformation: function(questionId, correctAnswerId, kind) {
        practiceUtilities.getTimingInformation(vmPr.activeTrack.trackId, vmPr.activeGroupId, questionId)
        .$promise.then(function(result) {
          vmPr.showTiming = true;
          vmPr.timingData = result[0];

          var mergedList = _.map(vmPr.items, function(item) {
            return _.extend(item, _.findWhere(result[0].answers, {
              'answer_id': item.id
            }));
          });

          var percentAnswered = (timingData.total_answered_correctly / timingData.total_answered) * 100
          vmPr.percentAnswered = percentAnswered > 0 ? Math.round(percentAnswered.toFixed(2)) : 0;

        }).catch(function(e) {
          vmPr.showTiming = false;
        });
      },
    };
  }

})();
