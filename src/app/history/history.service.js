(function() {
  'use strict';
  var historyModule = angular.module("grockitApp.history");
  historyModule.service('history', history);
  historyModule.factory('collapseManager', collapseManager);

  history.$inject = ['$q', 'HistoryApi','dateUtils'];


  function history($q,HistoryApi,dateUtils) {
    var containerList = [],currentPage=1,
    historyFn = {
     getQuestions : function(groupId) {
      return HistoryApi.getQuestions(groupId, currentPage++)
      .then(getQuestionsComplete)

        function getQuestionsComplete(historyResponse) {
          containerList = _.union(containerList,historyResponse.data.round_sessions);

          return containerList;
        }

      },
      parseQuestionsData: function(roundSessions) {
        var questionsWithDay = _.map(roundSessions, function(question) {
          var date = new Date(question.created_at);
          question.day = dateUtils.getStandardDate(date);
          if (question.created_at && question.answered_at) {
            question.time_to_answer = dateUtils.secondsBetweenDates(question.created_at, question.answered_at);
          }
          return question;
        }),
        grouppedByDay = _.groupBy(questionsWithDay, 'day'),
        parsedQuestions = _.map(_.keys(grouppedByDay), function(key) {
          return {
            day: key,
            roundSessions: grouppedByDay[key]
          };
        });

       return parsedQuestions;
      }
    };

    this.loadQuestions = function(groupId){

       var deferred = $q.defer();

       historyFn.getQuestions(groupId).then(function(containerList){

        var parsedQuestions = historyFn.parseQuestionsData(containerList);



        deferred.resolve(parsedQuestions);

       });

       return deferred.promise;
    }
  }

  function collapseManager() {

    return {
      entries: [],
      put: function(id, isCollapsed) {
        var entry = this.get(id);
        if (entry) {
          entry.isCollapsed = isCollapsed;
        } else {
          this.entries.push({id: id, isCollapsed: isCollapsed});
        }
      },
      get: function(id) {
        return _.find(this.entries, {'id': id});
      },
      isCollapsed: function(id) {
        var entry = this.get(id);
        return entry ? entry.isCollapsed : false;
      },
      collapsedCount: function() {
        return _.filter(this.entries, {'isCollapsed': true}).length;
      },
      areAllCollapsed: function() {
        return this.collapseCount === this.entries.length;
      }
    }
  };


})();
