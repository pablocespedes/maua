angular.module('grockitApp.directives', []).
directive('lineChart', function() {

    function createChart(el_id, options) {
        options.element = el_id;
        return new Morris.Line(options);
    }

    return {
        restrict: 'A',
        scope:  {
            options: '='
        },
        replace: true,
        template: '<div></div>',
        link: function(scope, element, attrs) {
            return createChart(attrs.id, scope.options)
        }
    }

});