/**
 * Created by Jose on 5/9/14.
 */
//Set of functions  - Utils

// Start Directives Templates
var multipleChoiceTemplate = function(){
    var template ='<div >' +
        '<ul class="answer-choice-steps">'+
        '<li class="choice" correct="{{item.correct}}"  ng-repeat="item in items">' +
        '<span class="answer-choice-step-number">{{item.option}}</span> ' +
        '<input id="{{item.position}}" type="checkbox" name="choice"  value="{{item.position}}"  />' +
        '<span class="answer-choice-step-caption">{{item.body}}</span>' +
      /*  '<div class="answer-content"></div>' answer-choice-step-caption+*/
        '</li>'+
        '</ul>' +
        '</div>';
    return template;
};

var matrixTemplate2x3 = function(){
    var template ='<div >' +
        '<ul class="answer-choice-steps">'+
        '<li class="choice" correct="{{item.correct}}"  ng-repeat="item in items">' +
        '<div class="divisor" ng-if="($index % 2) ==0">'+
        '<div >Blank {{$index+1}}</div>'+
        '<hr>'+
        '</div>'+
        '<span class="answer-choice-step-number">{{item.option}}</span> ' +
        '<input id="{{item.position}}" type="checkbox" name="choice"  value="{{item.position}}"  />' +
        '<span class="answer-choice-step-caption" ng-bind-html="item.body"></span>' +
        '</li>'+
        '</ul>' +
        '</div>';

    return template;
};

var matrixTemplate3x3 = function(){
    var template ='<div >' +
        '<ul class="answer-choice-steps">'+
        '<li class="choice" correct="{{item.correct}}"  ng-repeat="item in items">' +
        '<div class="divisor" ng-if="($index % 3) ==0">'+
        '<div >Blank {{$index+1}}</div>'+
        '<hr>'+
        '</div>'+
        '<span class="answer-choice-step-number">{{item.option}}</span> ' +
        '<input id="{{item.position}}" type="checkbox" name="choice"  value="{{item.position}}"  />' +
        '<span class="answer-choice-step-caption" ng-bind-html="item.body"></span>' +
        '</li>'+
        '</ul>' +
        '</div>';

    return template;
};


// Ending directives Templates////

// Start Directives logic// right now is the same but this could change along the project.

function multipleAnswerOneChoice(){

    $( "#content" ).on( "click", ".choice", function(event) {
        var choice = $(event.target).closest('.choice');
        choice
            .find('[name="choice"]')
            .prop('checked', true)
            .trigger('change');
    });

    $( "#content" ).on( "change", ".choice input", function(event) {
        var input = $(event.target);
        var choice = $(this).closest('.choice');
        $('.choice.active').removeClass('active');

        choice.addClass('active');
    });

}

function multipleAnswerMultipleChoice(){

    $( "#content" ).on( "click", ".choice", function(event) {
        var choice = $(event.target).closest('.choice');
        var input = choice.find('[type="checkbox"]');
        input
            .prop('checked', !input.is(':checked'))
            .trigger('change');
    });

    $( "#content" ).on( "change", ".choice input", function(event) {
        var input = $(event.target);
        var choice = $(this).closest('.choice');

        if (input.is(':checked')) {
            choice.addClass('active');
        }
        else {
            choice.removeClass('active');
        }
    });

}

function multipleAnswerMultipleChoiceTwoCorrect(){

    $( "#content" ).on( "click", ".choice", function(event) {
        var choice = $(event.target).closest('.choice');
        var input = choice.find('[type="checkbox"]');
        input
            .prop('checked', !input.is(':checked'))
            .trigger('change');
    });

    $( "#content" ).on( "change", ".choice input", function(event) {
        var input = $(event.target),
            choice = $(this).closest('.choice');

        if (input.is(':checked')) {
            choice.addClass('active');
        }
        else {
            choice.removeClass('active');
        }

        var findActive = $( "#content").find('.active').length;
        if(findActive==1){
            $( "#content").attr('firstSelect',input.val());
        }
        else if(findActive>2){
            var value= $( "#content").attr('firstSelect');

            $('#'+value).parent('li').removeClass('active');
        }

    });

}

// Ending Directives logic

// Start Directives

app.directive('ngOneChoice', function() {
        return {
        restrict: 'A',
       template : multipleChoiceTemplate(),
       link: function() {
           multipleAnswerOneChoice();
       },
        scope: {
            items:'=items'
        }
    };
});

app.directive('ngMultipleChoice', function() {

    return {
        restrict: 'A',
        template :  multipleChoiceTemplate(),
        link: function() {
            multipleAnswerMultipleChoice();
        },
        scope: {
            items:'=items'
        }
    };
});

app.directive('ngMultipleMatrix2x3', function() {
    return {
        restrict: 'A',
        template :  matrixTemplate2x3(),
        link: function() {
            multipleAnswerMultipleChoice();
        },
        scope: {
            items:'=items'
        }
    };
});

app.directive('ngMultipleMatrix3x3', function() {
    return {
        restrict: 'A',
        template :  matrixTemplate3x3(),
        link: function() {
            multipleAnswerMultipleChoice();
        },
        scope: {
            items:'=items'
        }
    };
});

// Ending Directives


//Still Working

app.directive('ngGmatIR', function() {

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

app.directive('ngGmatRadios', function() {
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


//testing
app.directive('ngMultipleChoiceTwo', function() {

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

