/**
 * Created by Jose on 5/9/14.
 */
//Set of functions  - Utils
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



//Still Working
var multipleMatrixTemplate = function(){
    var template ='<div >' +
        //'<div class="row" ng-repeat="item in items">'+
        '<ul class="answer-choice-steps">'+
        '<li class="choice" correct="{{item.correct[$index]}}"  ng-repeat="item in items">' +
        '<span class="answer-choice-step-number">{{item.option}}</span> ' +
        '<input id="{{item.position}}" type="checkbox" name="choice"  value="{{item.position}}"  />' +
        '<span class="answer-choice-step-caption">{{item.body}}</span>' +
        '</li>'+
        '</ul>' +
        // '</div>' +
        '</div>';
    return template;
};


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

app.directive('ngMultipleMatrix', function() {

    return {
        restrict: 'A',
        template :  multipleMatrixTemplate(),
        link: function() {
            multipleAnswerMultipleChoiceTwoCorrect();
        },
        scope: {
            items:'=items',
            rows:'=rows'
        }
    };
});

