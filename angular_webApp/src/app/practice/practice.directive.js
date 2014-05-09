/**
 * Created by Jose on 5/9/14.
 */
app.directive('ngAnswer', function($compile) {
    var template = '<div ng-repeat="col in cols">' +
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
        '</div>';
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