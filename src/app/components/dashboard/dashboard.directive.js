(function() {
  'use strict';
  angular
  .module("grockitApp.components")
  .directive('trackList', trackList)
  .directive('challengeDashboard', challengeDashboard)
  .directive('doNow', doNow);

  trackList.$inject = ['utilities'];
  challengeDashboard.$inject = ['utilities'];


  function trackList(utilities) {
    var directive = {
      link: link,
      templateUrl: 'app/components/dashboard/templates/track-list.tpl.html',
      restrict: 'A',
      scope: {
        tracks: '=',
        startPractice: '=',
        isVisible: '=',
        canPractice: '='
      }
    };
    return directive;

    function link(scope, element, attrs) {

              var collection = [{name:'Absolute value', percent: '80%', perctCss:'fmcircle_green'},
                  {name:'Algebra', percent: '0%', perctCss:'fmcircle_blue'},
                  {name:'Angles', percent: '10%', perctCss:'fmcircle_red'},
                  {name:'Area', percent: '20%', perctCss:'fmcircle_orange'},
                  {name:'Arithmetic', percent: '45%', perctCss:'percent_40'},
                  {name:'Averages', percent: '52%', perctCss:'percent_50'},
                  {name:'Circles', percent: '14%', perctCss:'fmcircle_red'},
                  {name:'Coordinate geometry', percent: '19%', perctCss:'fmcircle_red'},
                  {name:'Data Sufficiency', percent: '35%', perctCss:'percent_30'},
                  {name:'Decimals', percent: '30%', perctCss:'fmcircle_red'},
                  {name:'Distance problem', percent: '30%', perctCss:'fmcircle_red'},
                  {name:'Estimation', percent: '30%', perctCss:'fmcircle_red'},
                  {name:'Evaluating expressions', percent: '19%', perctCss:'fmcircle_red'},
                  {name:'Exponents and Roots', percent: '25%', perctCss:'fmcircle_orange'},
                  {name:'Factors, Divisibility and Prime Numbers', percent: '5%', perctCss:'percent_0'},
                  {name:'Fractions', percent: '30%', perctCss:'fmcircle_red'},
                  {name:'Functions', percent: '30%', perctCss:'fmcircle_red'},
                  {name:'Geometry', percent: '30%', perctCss:'fmcircle_red'},
                  {name:'Inequalities', percent: '30%', perctCss:'fmcircle_red'},
                  {name:'Inscribed Figures', percent: '30%', perctCss:'fmcircle_red'},
                  {name:'Interest', percent: '30%', perctCss:'fmcircle_red'},
                  {name:'Interpretation of graphs and tables', percent: '30%', perctCss:'fmcircle_red'},
                  {name:'Intersecting lines and angles', percent: '30%', perctCss:'fmcircle_red'},
            ];

      scope.trackTags= collection;


      var overlayTrack = null;
      scope.shouldShowOverlay = function(track) {
        if (track.hasScore) {
          return false;
        } else if (overlayTrack === null) {
          overlayTrack = track;
          return true;
        } else {
          return overlayTrack.id === track.id;
        }
      }
      scope.empty = function(track) {
        return angular.isDefined(track.items) && track.items.length > 0 ? true : false;
      }
      scope.getYourScorePredictionUrl = function(track) {
        var baseUrl = utilities.originalGrockit(false).url;
        utilities.redirect(baseUrl + '/assessment/for_track/' + track.id);
      }
    }
  }

  function challengeDashboard(utilities) {
    var directive = {
      link: link,
      templateUrl: 'app/components/dashboard/templates/dashboard-challenge.tpl.html',
      restrict: 'A',
      scope: {
        challenges: '='
      }
    };
    return directive;

    function link(scope, element, attrs) {
      scope.newChallenge = function(index) {
        var currentChallenge = scope.challenges[index],
        pieces = currentChallenge.url.split("/"),
        id = pieces[pieces.length - 1],
        baseUrl = utilities.originalGrockit().url;

        scope.challengeId = id;
        utilities.redirect(baseUrl + '/assessment/introcards/' + scope.challengeId);

      };
    }
  }

  function doNow() {
    var directive = {
      templateUrl: 'app/components/dashboard/templates/do-now.tpl.html',
      restrict: 'A',
      scope:false
    };
    return directive;
  }
})();
