'use strict';
/*Services to manage diretives logic*/
practiceGame.factory('oneChoiceFactory', function () {
    return {
        execute: function () {
            var content = $('#parent');

            content.on('click', '#oneChoice .middle', function (e) {
                if(e.handled !== true) // This will prevent event triggering more then once
                {
                    var choice = $(e.target).closest('.choice'),
                        input = choice.find('[type="checkbox"]'),
                        button = choice.find(':button'),
                        isChecked = input.is(':checked'),
                        hasPrimary = button.hasClass('btn-primary'),
                        nexAction = $('#nextAction'),
                        seeAnswer = $('#skipAction');


                    $('.choice').find('[type="checkbox"]').prop('value', false);
                    $('.choice button').removeClass('btn-primary btn-danger');


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
                }
                e.handled = true;


            });


        }
    };
});

practiceGame.factory('multipleChoiceFactory', function () {
    return {
        execute: function () {
            var content = $('#parent');

            content.on('click', '#multipleChoice .middle', function (e) {
                if(e.handled !== true) // This will prevent event triggering more then once
                {
                    var choice = $(e.target).closest('.choice'),
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
                    e.handled = true;
                }

            });

        }
    };
});

practiceGame.factory('matrix2x3ChoiceFactory', function () {
    return {
        execute: function () {
            var content = $('#parent');
            content.on('click', '#matrix2x3 .middle', function (e) {

                if(e.handled !== true) // This will prevent event triggering more then once
                {
                    var choice = $(e.target).closest('.choice'),
                        general = $('.choice .middle button'),
                        input = choice.find('[type="radio"]'),
                        choiceB = choice.find('.middle'),
                        button = choiceB.find('.letter'),
                        isChecked = input.is(':checked'),
                        hasPrimary = button.hasClass('btn-primary'),
                        nexAction = $('#nextAction'),
                        seeAnswer = $('#skipAction'),
                        limitSelection = choice.parent().find('[data-group=' + choiceB.data('group') + ']');

                    if (limitSelection.find('button').hasClass('btn-primary')) {
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
                        if (!general.hasClass('btn-primary')) {
                            nexAction.removeClass('btn-primary');
                            seeAnswer.removeClass('hide');
                        }
                    }
                }
                e.handled=true;
            });

        }
    };
});

practiceGame.factory('matrix3x3ChoiceFactory', function () {
    return {
        execute: function () {
            var content = $('#parent');
            content.on('click', '#matrix3x3 .middle', function (e) {

                if(e.handled !== true) // This will prevent event triggering more then once
                {
                    var choice = $(e.target).closest('.choice'),
                        input = choice.find('[type="radio"]'),
                        general = $('.choice .middle button'),
                        choiceB = choice.find('.middle'),
                        button = choiceB.find('.letter'),
                        isChecked = input.is(':checked'),
                        hasPrimary = button.hasClass('btn-primary'),
                        nexAction = $('#nextAction'),
                        seeAnswer = $('#skipAction'),
                        limitSelection = choice.parent().find('[data-group=' + choiceB.data('group') + ']');

                    if (limitSelection.find('button').hasClass('btn-primary')) {
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
                        if (!general.hasClass('btn-primary')) {
                            nexAction.removeClass('btn-primary');
                            seeAnswer.removeClass('hide');
                        }
                    }
                }
                e.handled=true;

            });
        }
    };
});

practiceGame.factory('multipleChoiceTwoCorrect', function () {

    var removeItem = function (options,idInput) {
        return $.grep(options, function (value) {
            return value != idInput;
        });
    };

    return {
        execute: function () {
            var content = $('#parent'),
                options = [];
            content.on('click', '#twoChoice .middle', function (e) {
                if(e.handled !== true) // This will prevent event triggering more then once
                {
                    var choice = $(e.target).closest('.choice'),
                        input = choice.find('[type="checkbox"]'),
                        idInput = input.attr('id'),
                        choiceB = choice.find('.middle'),
                        button = choiceB.find('.letter'),
                        isChecked = input.is(':checked'),
                        hasPrimary = button.hasClass('btn-primary'),
                        nexAction = $('#nextAction'),
                        seeAnswer = $('#skipAction');


                    // normal flow, this just identify when check or uncheck
                    if (!isChecked && !hasPrimary) {

                        // validation which takes care to keep just 2 options selected
                        if (options.length >= 2) {
                            var itemToRemove = options[0];
                            options = removeItem(options, itemToRemove);
                            var removedButton = $('button#' + itemToRemove), removeInput = removedButton.parent().find('input');
                            removeInput.prop('value', false);
                            removedButton.removeClass('btn-primary');
                            event.preventDefault();
                        }

                        options.push(idInput);
                        input.prop('value', true);
                        button.addClass('btn-primary');
                        nexAction.addClass('btn-primary');
                        seeAnswer.addClass('hide');
                    } else {
                        options = removeItem(options, idInput);

                        nexAction.removeClass('btn-primary');
                        seeAnswer.removeClass('hide');
                        input.prop('value', false);
                        button.removeClass('btn-primary');
                    }
                }
                e.handled=true;

            });

        }
    };
});

practiceGame.factory('satFactory', function () {

    return {
        execute: function () {
            var content = $('#parent');

            content.on('click', '#sat .column-matrix', function (e) {
                if(e.handled !== true) // This will prevent event triggering more then once
                {
                    var choice = $(e.target),
                        choiceVal = choice.text(),
                        selectedGroup = $(e.target).parents('td').data('group'),
                        groups = $(e.target).parents('.choice').find('[data-group=' + selectedGroup + ']'),
                        hasPrimary = choice.hasClass('btn-primary'),
                        nexAction = $('#nextAction'),
                        seeAnswer = $('#skipAction');

                    groups.find('[type=button]').removeClass('btn-primary');
                    groups.find('[type=button]').addClass('btn-outline');
                    if (!hasPrimary) {
                        choice.removeClass('btn-outline');
                        choice.addClass('btn-primary');
                        $('#input' + selectedGroup).text(choiceVal);
                        nexAction.addClass('btn-primary');
                        seeAnswer.addClass('hide');
                    } else {
                        $('#input' + selectedGroup).text('');
                        choice.removeClass('btn-primary');
                        choice.addClass('btn-outline');
                    }
                }
                e.handled=true;


            });


        }
    };
});

practiceGame.factory('numericEntry', function () {
    return {
        execute: function (scope,attrs) {

            var nexAction = $('#nextAction'),
                seeAnswer = $('#skipAction');

            scope.$watch('portal.numerator', function (newVal, oldVal) {

                if(angular.isDefined(newVal) && newVal!=null) {
                    nexAction.addClass('btn-primary');
                    seeAnswer.addClass('hide');
                }
                else{
                    nexAction.removeClass('btn-primary');
                    seeAnswer.removeClass('hide');
                }

            });

        }
    };
});

practiceGame.factory('fractionEntry', function () {
    return {
        execute: function (scope) {

            var nexAction = $('#nextAction'),
                seeAnswer = $('#skipAction');
            scope.$watch('portal.numerator', function (newVal, oldVal) {
                if(angular.isDefined(newVal) && newVal!=null) {
                    nexAction.addClass('btn-primary');
                    seeAnswer.addClass('hide');
                }
                else{
                    nexAction.removeClass('btn-primary');
                    seeAnswer.removeClass('hide');
                }

            });

        }
    };
});

