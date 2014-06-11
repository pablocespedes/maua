'use strict';

app.factory('oneChoiceFactory', function () {
    return {
        execute: function () {
            var content = $('#parent');
            content.on('click', '#oneChoice .middle', function (event) {
                var choice = $(event.target).closest('.choice'),
                    input = choice.find('[type="checkbox"]'),
                    button = choice.find(':button'),
                    isChecked = input.is(':checked'),
                    hasPrimary = button.hasClass('btn-primary'),
                    nexAction = $('#nextAction'),
                    seeAnswer = $('#skipAction');


                $('.choice').find('[type="checkbox"]').prop('value', false);
                $('.choice button').removeClass('btn-primary');


                if (!isChecked && !hasPrimary) {
                    input.prop('value', true);
                    button.addClass('btn-primary');
                    nexAction.addClass('btn-primary');
                    seeAnswer.addClass('hide');
                } else {
                    nexAction.removeClass('btn-primary');
                    seeAnswer.removeClass('hide');
                    input.prop('value', false);
                    button.removeClass('btn-primary');
                }

            });


        }
    };
});

app.factory('multipleChoiceFactory', function () {
    return {
        execute: function () {
            var content = $('#parent');

            content.on('click', '#multipleChoice .middle', function (event) {

                var choice = $(event.target).closest('.choice'),
                    general= $('.choice .middle button'),
                    input = choice.find('[type="checkbox"]'),
                    choiceB = choice.find('.middle'),
                    button = choiceB.find('.letter'),
                    isChecked = input.is(':checked'),
                    hasPrimary = button.hasClass('btn-primary'),
                    nexAction = $('#nextAction'),
                    seeAnswer = $('#skipAction');

                if (!isChecked && !hasPrimary) {
                    input.prop('value', true);
                    button.addClass('btn-primary');
                    nexAction.addClass('btn-primary');
                    seeAnswer.addClass('hide');
                } else {
                    input.prop('value', false);
                    button.removeClass('btn-primary');
                    if(!general.hasClass('btn-primary')){
                        nexAction.removeClass('btn-primary');
                        seeAnswer.removeClass('hide');
                    }

                }

            });

        }
    };
});

app.factory('matrix2x3ChoiceFactory', function () {
    return {
        execute: function () {
            var content = $('#parent');

            content.on('click', '#matrix2x3 .middle', function (event) {

                var choice = $(event.target).closest('.choice'),
                    general= $('.choice .middle button'),
                    input = choice.find('[type="radio"]'),
                    choiceB = choice.find('.middle'),
                    button = choiceB.find('.letter'),
                    isChecked = input.is(':checked'),
                    hasPrimary = button.hasClass('btn-primary'),
                    nexAction = $('#nextAction'),
                    seeAnswer = $('#skipAction'),
                    limitSelection = choice.parent().find('[data-group='+choiceB.data('group')+']');

                if(limitSelection.find('button').hasClass('btn-primary')){
                    limitSelection.find('button').removeClass('btn-primary');
                    limitSelection.find('input').prop('value', false);
                }

                if (!isChecked && !hasPrimary) {
                    input.prop('value', true);
                    button.addClass('btn-primary');
                    nexAction.addClass('btn-primary');
                    seeAnswer.addClass('hide');
                } else {
                    input.prop('value', false);
                    button.removeClass('btn-primary');
                    if(!general.hasClass('btn-primary')){
                        nexAction.removeClass('btn-primary');
                        seeAnswer.removeClass('hide');
                    }
                }

            });

        }
    };
});

app.factory('matrix3x3ChoiceFactory', function () {
    return {
        execute: function () {
            var content = $('#parent');
            content.on('click', '#matrix3x3 .middle', function (event) {

                var choice = $(event.target).closest('.choice'),
                    input = choice.find('[type="radio"]'),
                    general= $('.choice .middle button'),
                    choiceB = choice.find('.middle'),
                    button = choiceB.find('.letter'),
                    isChecked = input.is(':checked'),
                    hasPrimary = button.hasClass('btn-primary'),
                    nexAction = $('#nextAction'),
                    seeAnswer = $('#skipAction'),
                    limitSelection = choice.parent().find('[data-group='+choiceB.data('group')+']');

                if(limitSelection.find('button').hasClass('btn-primary')){
                    limitSelection.find('button').removeClass('btn-primary');
                    limitSelection.find('input').prop('value', false);
                }
                if (!isChecked && !hasPrimary) {
                    input.prop('value', true);
                    button.addClass('btn-primary');
                    nexAction.addClass('btn-primary');
                    seeAnswer.addClass('hide');
                } else {
                    input.prop('value', false);
                    button.removeClass('btn-primary');
                    if(!general.hasClass('btn-primary')){
                        nexAction.removeClass('btn-primary');
                        seeAnswer.removeClass('hide');
                    }
                }

            });

        }
    };
});

app.factory('multipleChoiceTwoCorrect', function () {

    var removeItem = function (options,idInput) {
        return $.grep(options, function (value) {
            return value != idInput;
        });
    };

    return {
        execute: function () {
            var content = $('#parent'),
                options = [];
            content.on('click', '#twoChoice .middle', function (event) {

                var choice = $(event.target).closest('.choice'),
                    input = choice.find('[type="checkbox"]'),
                    idInput = input.attr('id'),
                    choiceB = choice.find('.middle'),
                    button = choiceB.find('.letter'),
                    isChecked = input.is(':checked'),
                    hasPrimary = button.hasClass('btn-primary'),
                    nexAction = $('#nextAction'),
                    seeAnswer = $('#skipAction');

                // validation whic takes care to keep just 2 options selected
                if (options.length >= 2) {
                    var itemToRemove = options[0];
                    options = removeItem(options,itemToRemove);
                    var removedButton=$('button#' + itemToRemove), removeInput= removedButton.parent().find('input');
                    removeInput.prop('value', false);
                    removedButton.removeClass('btn-primary');
                    event.preventDefault();
                }
                // normal flow, this just identify when check or uncheck
                if (!isChecked && !hasPrimary) {
                    options.push(idInput);
                    input.prop('value', true);
                    button.addClass('btn-primary');
                    nexAction.addClass('btn-primary');
                    seeAnswer.addClass('hide');
                } else {
                    options = removeItem(idInput);

                    nexAction.removeClass('btn-primary');
                    seeAnswer.removeClass('hide');
                    input.prop('value', false);
                    button.removeClass('btn-primary');
                }

            });

        }
    };
});