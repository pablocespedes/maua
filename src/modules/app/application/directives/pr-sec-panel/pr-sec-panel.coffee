'use strict'
practiceSecPanel = ()->
  new class PracticeSecPanel
    constructor: () ->
    restrict: 'AE'
    templateUrl: 'app/application/directives/pr-sec-panel/pr-sec-panel.html'

module.exports = practiceSecPanel