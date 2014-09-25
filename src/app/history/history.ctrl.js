(function(app) {
  'use strict';
  angular
  .module('grockitApp.history')
  .controller('HistoryController', HistoryController);

  /*Manually injection will avoid any minification or injection problem*/
  HistoryController.$inject = ['HistoryApi', 'Observable'];

  function HistoryController(HistoryApi, Observable) {
    // dummy data for pagination
    var self = this;
    HistoryApi.query({ groupId: 'gmat' }).$promise.then(function(data) {
      console.log(data);
      self.questionsPerDay = data;
    });
    this.currentPage = 1;
    this.pageChanged = function() {
    };

    var observable = Observable.create('test'),
        gottenObservable = Observable.get('test'),
        observer2 = gottenObservable.register(function(data) {
          console.log('2: ' + data);
        }),
        observer1 = gottenObservable.register(function(data) {
          console.log('1: ' + data);
        });

    this.testClick = function(title) {
      observable.notify(title);
    };

  }
})();
