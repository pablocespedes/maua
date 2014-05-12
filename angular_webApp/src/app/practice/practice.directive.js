/**
 * Created by Jose on 5/9/14.
 */
app.directive('ngAnswer', function($compile) {
/*    var template = '<div ng-repeat="col in cols">' +
        '<div class="panel-body no-padding-t col-md-4">'+
        '<div ng-repeat="item in items">' +
        '<p>' +
        '<label class="{{lblClass}}">' +
        '<input id="{{col.id}}'+"_"+'{{item.id}}"  type="{{inputType}}" name="styled-r1" class="px">' +
        '<span class="lbl">{{item.answer}}</span>' +
        '</label>' +
        '</p>' +
        '</div>' +
        '</div>' +
        '</div>';*/
    return {
        restrict: 'A',
        template : template,
        scope: {
            cols:'=cols',
            items:'=items',
            inputType:'@',
            lblClass:'@'
        }
    };
});

app.directive('ngOneChoice', function($compile) {
    var template ='<div>' +
        '<ul class="answer-choice-steps">'+
        '<li class="choice"  ng-repeat="item in items"  ng-click="choices($event)" >' +
        '<span class="answer-choice-step-number">{{item.option}}</span> ' +
        '<input id="{{item.id}}" type="checkbox" name="{{item.id}}"  value={{item.id}}"  />' +
        '<span class="answer-choice-step-caption">{{item.answer}}</span>' +
        '<div class="answer-content"></div>' +
        '</li>'+
        '</ul>' +
        '</div>';

        return {
        restrict: 'A',
       template : template,
       link: function (scope, elem, attrs) {
           scope.choices = function(event) {
               var choices = angular.element('.choice');
               var choice = angular.element(event.target).closest('.choice');
               var input = choice.find('[type="checkbox"]');

               input.prop('checked', !input.is(':checked'));

               choice.find('[name="choice"]')
                   .prop('checked', true);

               angular.element('.choice.active').removeClass('active');
               choice.addClass('active');
           };
        },
        scope: {
            cols:'=cols',
            items:'=items'
        }
    };
});

