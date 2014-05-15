/**
 * Created by Jose on 5/15/2014.
 */

app.factory('multipleAnswerOneChoice', function(){
    return {
        execute: function(){
            var content = $('#content');
            content.on( "click", ".choice", function(event) {
                var choice = $(event.target).closest('.choice');
                    choice.find('[name="choice"]').prop('checked', true).trigger('change');
                    choice.find(".expandable-section").slideToggle(200);

                //$(this).parent().siblings().children().next().slideUp();
               // choice.find(".expandable-section").slideToggle(200);
            });

            content.on( "change", ".choice input", function(event) {
                var input = $(event.target),
                    choice = $(this).closest('.choice');
                //$('.choice.active').find(".expandable-section").not(choice).slideUp(200);
                $('.choice.active').removeClass('active');
                choice.addClass('active');
            });
        }
    }
});

app.factory('multipleAnswerMultipleChoice', function(){
    return {
        execute: function(){
            var content = $('#content');
            content.on( "click", ".choice", function(event) {
                var choice = $(event.target).closest('.choice'),
                    input = choice.find('[type="checkbox"]');
                choice.find(".expandable-section").slideToggle(200);
                input.prop('checked', !input.is(':checked')).trigger('change');
            });
            content.on( "change", ".choice input", function(event) {
                var input = $(event.target),
                    choice = $(this).closest('.middle');

                if (input.is(':checked')) {
                    choice.addClass('active');
                }
                else {
                    choice.removeClass('active');
                }
            });
        }
    }
});

app.factory('multipleAnswerMultipleChoiceTwoCorrect', function(){
    return {
        execute: function(){
            var content = $('#content');
            content.on( "click", ".choice", function(event) {
                var choice = $(event.target).closest('.middle'),
                    input = choice.find('[type="checkbox"]');
                input.prop('checked', !input.is(':checked')).trigger('change');
            });
            content.on( "change", ".choice input", function(event) {
                var input = $(event.target),
                    choice = $(this).closest('.middle');

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
    }
});
