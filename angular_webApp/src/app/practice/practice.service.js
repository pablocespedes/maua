/**
 * Created by Jose on 5/15/2014.
 */
'use strict';

app.factory('oneChoiceFactory', function(){
    return {
        execute: function(){
            var content = $('#parent');
            content.on('click', '#oneChoice .middle', function(event) {
                var choice = $(this).closest('.choice'),
                    input = choice.find('[type="checkbox"]'),
                    button =  choice.find(':button');

                $('#nextAction').removeClass('hide');
                $('#skipAction').addClass('hide');

                $('.choice').find('[type="checkbox"]').removeAttr('checked');
                $('.choice button').removeClass('btn-primary');

                input.attr('checked', true);
                button.addClass('btn-primary');

            });


        }
    };
});

app.factory('multipleChoiceFactory', function(){
    return {
        execute: function(){
                var content = $('#parent');

                content.on('click', '#multipleChoice .middle', function(event) {
                    $('#nextAction').removeClass('hide');
                    $('#skipAction').addClass('hide');
                    var choice = $(event.target).closest('.choice'),
                        input = choice.find('[type="checkbox"]'),
                        choiceB = choice.find('.middle'),
                        button= choiceB.find('.letter');

                    if (!input.is(':checked')&& !button.hasClass('btn-primary')) {
                        button.addClass('btn-primary');
                        input.attr('checked', true);
                    }
                    else {
                        input.removeAttr('checked');
                        button.removeClass('btn-primary');
                    }

            });

        }
    };
});

app.factory('matrix2x3ChoiceFactory', function(){
    return {
        execute: function(){
            var content = $('#parent');

            content.on('click', '#matrix2x3 .middle', function(event) {
                $('#nextAction').removeClass('hide');
                $('#skipAction').addClass('hide');
                var choice = $(event.target).closest('.choice'),
                    input = choice.find('[type="checkbox"]'),
                    choiceB = choice.find('.middle'),
                    button= choiceB.find('.letter');


                if (!input.is(':checked')&& !button.hasClass('btn-primary')) {
                    button.addClass('btn-primary');
                    input.attr('checked', true);
                }
                else {
                    input.removeAttr('checked');
                    button.removeClass('btn-primary');
                }

            });

        }
    };
});

app.factory('matrix3x3ChoiceFactory', function(){
    return {
        execute: function(){
            var content = $('#parent');
            content.on('click', '#matrix3x3 .middle', function(event) {
                $('#nextAction').removeClass('hide');
                $('#skipAction').addClass('hide');
                var choice = $(event.target).closest('.choice'),
                    input = choice.find('[type="checkbox"]'),
                    choiceB = choice.find('.middle'),
                    button= choiceB.find('.letter');

                if (!input.is(':checked') && !button.hasClass('btn-primary')) {
                    button.addClass('btn-primary');
                    input.attr('checked', true);
                }
                else {
                    input.removeAttr('checked');
                    button.removeClass('btn-primary');
                }

            });

        }
    };
});



/*

app.factory('multipleAnswerMultipleChoiceTwoCorrect', function(){
    return {
        execute: function(){
            var content = $('#parent');
            content.on('click', '.choice', function(event) {
                var choice = $(event.target).closest('.middle'),
                    input = choice.find('[type="checkbox"]');
                input.prop('checked', !input.is(':checked')).trigger('change');
            });

            content.on('change', '.choice input', function(event) {
                var input = $(event.target),
                    choice = $(this).closest(':button');

                if (input.is(':checked')) {
                    choice.addClass('active');
                }
                else {
                    choice.removeClass('active');
                }

                var findActive = $('#content').find('.active').length;
                if(findActive===1){
                    $('#content').attr('firstSelect',input.val());
                }
                else if(findActive>2){
                    var value= $('#content').attr('firstSelect');

                    $('#'+value).parent('li').removeClass('active');
                }

            });
        }
    };
});
*/
