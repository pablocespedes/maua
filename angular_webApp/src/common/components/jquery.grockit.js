/**
 * Created by Jose on 5/8/14.
 */

$(function(){

    $(window).load(function(){
//tooltip, by default, activated by hover event
        $('body').tooltip({
            selector: '[data-toggle=tooltip]',
            container: 'body'
        });

//popover, by default, activated with clicking {toggle}
        $('body').popover({
            selector: '[data-toggle=popover]',
            container: 'body'
        });
    });

});