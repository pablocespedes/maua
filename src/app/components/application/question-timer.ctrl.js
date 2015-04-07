(function() {
  'use strict';
  angular
    .module('grockitApp.components')
    .controller('QuestionTimerController', QuestionTimerController);

QuestionTimerController.$inject = ['$scope','questionTimingService'];
  function QuestionTimerController($scope,questionTimingService) {
    /* jshint validthis: true */
    var vm = this;
    vm.ok = ok;
    vm.cancel = cancel;
    var minutes = 0;
    var time = questionTimingService.getTime();
    if (angular.isDefined(time)) {
      minutes = time.minutes;
    }

    console.log(time);
    vm.options = {
      id:'timingModal',
      value: minutes,
      snapBounds: 1,
      sliderTicks: [0, 5, 10, 15],
      tickLabels: ['0', '5', '10', '15']
    };

    $scope.$on("$destroy", function() {
      vm.options={};
      modalInstance=null;

     console.log('test');
    });


    var modalInstance = questionTimingService.getModalInstance();

    function ok() {
      var timerSetting = {
          minutes: vm.options.value
      };
      questionTimingService.saveTime(timerSetting);
       modalInstance.close();
    };

    function cancel() {
      modalInstance.dismiss('cancel');
    };

  }

})();
