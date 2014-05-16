/**
 * Created by Jose on 5/9/14.
 */

// Start Directives

app.directive('ngOneChoice', function(multipleAnswerOneChoice) {
        return {
        restrict: 'A',
        templateUrl : 'app/practice/practiceDirectivesTemplates/multipleChoice.tpl.html',
        link: function() {
           multipleAnswerOneChoice.execute();
        },
        scope: {
            items:'=items'
        }
    };
})

.directive('ngMultipleChoice', function(multipleAnswerMultipleChoice) {
    return {
        restrict: 'A',
        templateUrl : 'app/practice/practiceDirectivesTemplates/multipleChoice.tpl.html',
        link: function() {
            multipleAnswerMultipleChoice.execute();
        },
        scope: {
            items:'=items'
        }
    };
})

.directive('ngMultipleMatrix2x3', function(multipleAnswerMultipleChoice) {
    return {
        restrict: 'A',
        templateUrl : 'app/practice/practiceDirectivesTemplates/matrix2x3.tpl.html',
        link: function() {
            multipleAnswerMultipleChoice.execute();
        },
        scope: {
            items:'=items'
        }
    };
})

.directive('ngMultipleMatrix3x3', function(multipleAnswerMultipleChoice) {
    return {
        restrict: 'A',
        templateUrl : 'app/practice/practiceDirectivesTemplates/matrix3x3.tpl.html',
        link: function() {
            multipleAnswerMultipleChoice.execute();
        },
        scope: {
            items:'=items'
        }
    };
})

.directive('ngNumericEntry', function() {
        return {
            restrict: 'A',
            templateUrl : 'app/practice/practiceDirectivesTemplates/numericEntry.tpl.html',
            link: function() {

            },
            scope: {
                items:'=items'
            }
        };
    })

// Ending Directives


//Still Working

.directive('ngGmatIR', function() {

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
})

.directive('ngGmatRadios', function() {
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
})


//testing
.directive('ngMultipleChoiceTwo', function() {

    return {
        restrict: 'A',
        template :  multipleChoiceTemplate(),
        link: function() {
            multipleAnswerMultipleChoiceTwoCorrect();
        },
        scope: {
            items:'=items'
        }
    };
});

