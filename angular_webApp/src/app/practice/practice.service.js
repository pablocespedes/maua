/**
 * Created by Jose on 5/15/2014.
 */
'use strict';

app.factory('multipleAnswerOneChoice', function(){
    return {
        execute: function(){
            var content = $('#parent');
            content.on('click', '.choice', function(event) {
                var choice = $(event.target).closest('.choice');
                    choice.find('[name="choice"]').prop('checked', true).trigger('change');
            });

            content.on('change', '.choice input', function() {
                var choice = $(this).closest('.choice'),
                    button =  choice.find(':button');
                $('.choice button').addClass('btn-primary');
                button.removeClass('btn-primary');
            });
        }
    };
});

app.factory('multipleAnswerMultipleChoice', function(){
    return {
        execute: function(){
            var content = $('#parent');
            content.on('click', '.choice', function(event) {
                var choice = $(event.target).closest('.choice'),
                    input = choice.find('[type="checkbox"]');

                    input.prop('checked', !input.is(':checked')).trigger('change');
            });
            content.on('change', '.choice input', function(event) {
                var input = $(event.target),
                    choice = $(this).closest('.middle'),
                    button =  choice.find(':button');


                if (input.is(':checked')) {
                    $('.choice button').removeClass('btn-primary');
                }
                else {
                    button.addClass('btn-primary');
                }
            });
        }
    };
});

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
