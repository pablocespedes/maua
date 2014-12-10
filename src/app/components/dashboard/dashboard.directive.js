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

              var collection = [{name:'Absolute value', percent: '80%', perctCss:'percent_80'},
                  {name:'Algebra', percent: '30%', perctCss:'percent_30'},
                  {name:'Angles', percent: '10%', perctCss:'percent_10'},
                  {name:'Area', percent: '20%', perctCss:'percent_20'},
                  {name:'Arithmetic', percent: '45%', perctCss:'percent_40'},
                  {name:'Averages', percent: '52%', perctCss:'percent_50'},
                  {name:'Circles', percent: '14%', perctCss:'percent_10'},
                  {name:'Coordinate geometry', percent: '19%', perctCss:'percent_10'},
                  {name:'Data Sufficiency', percent: '35%', perctCss:'percent_30'},
                  {name:'Decimals', percent: '30%', perctCss:'percent_10'},
                  {name:'Distance problem', percent: '30%', perctCss:'percent_10'},
                  {name:'Estimation', percent: '30%', perctCss:'percent_10'},
                  {name:'Evaluating expressions', percent: '19%', perctCss:'percent_10'},
                  {name:'Exponents and Roots', percent: '25%', perctCss:'percent_20'},
                  {name:'Factors, Divisibility and Prime Numbers', percent: '5%', perctCss:'percent_0'},
                  {name:'Fractions', percent: '30%', perctCss:'percent_10'},
                  {name:'Functions', percent: '30%', perctCss:'percent_10'},
                  {name:'Geometry', percent: '30%', perctCss:'percent_10'},
                  {name:'Inequalities', percent: '30%', perctCss:'percent_10'},
                  {name:'Inscribed Figures', percent: '30%', perctCss:'percent_10'},
                  {name:'Interest', percent: '30%', perctCss:'percent_10'},
                  {name:'Interpretation of graphs and tables', percent: '30%', perctCss:'percent_10'},
                  {name:'Intersecting lines and angles', percent: '30%', perctCss:'percent_10'},
                  {name:'Linear Equations with 1 Variable', percent: '30%', perctCss:'percent_10'},
                  {name:'Lines', percent: '30%', perctCss:'percent_10'},
                  {name:'Number Properties', percent: '30%', perctCss:'percent_10'},
                  {name:'Parallel Lines', percent: '30%', perctCss:'percent_10'},
                  {name:'Percents', percent: '30%', perctCss:'percent_10'},
                  {name:'Perimeter', percent: '30%', perctCss:'percent_10'},
                  {name:'Probability: Combinations, Permutations and Counting', percent: '30%', perctCss:'percent_10'},
                  {name:'Problem Solving', percent: '30%', perctCss:'percent_10'},
                  {name:'Profit', percent: '30%', perctCss:'percent_10'},
                  {name:'Quadratic Equations', percent: '30%', perctCss:'percent_10'},
                  {name:'Quadrilaterals', percent: '30%', perctCss:'percent_10'},
                  {name:'Rates and Work', percent: '30%', perctCss:'percent_10'},
                  {name:'Ratios and proportions', percent: '30%', perctCss:'percent_10'},
                  {name:'Sequences', percent: '30%', perctCss:'percent_10'},
                  {name:'Sets', percent: '30%', perctCss:'percent_10'},
                  {name:'Simplifying algebraic expressions', percent: '30%', perctCss:'percent_10'},
                  {name:'Statistics', percent: '30%', perctCss:'percent_10'},
                  {name:'System of Linear Equations', percent: '30%', perctCss:'percent_10'},
                  {name:'Triangles'},{name:'Volume', percent: '30%', perctCss:'percent_10'},
                  {name:'Word Problems', percent: '30%', perctCss:'percent_10'}];

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
