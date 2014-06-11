app.directive('select2',function(){
    var linker = function(scope, element,attr){
        scope.$watch('names',function(){
            setTimeout(function(){
                element.trigger("change");
                element.select2();
            }, 50);
        });
    };
    return{
        restrict:'A',
        link: linker
    };
});
