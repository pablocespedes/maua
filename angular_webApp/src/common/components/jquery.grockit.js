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
    footer();
    setActiveMenu();
    setSelect2Settings();
    setCookie('user_id','e1a2f2d0-c005-0130-2f70-1231390ef981');
});


function setActiveMenu(){
    var menuList = $('div#main-menu-inner ul.navigation li');
        var url = window.location.href.split('/'),
         actualLocation = url[(url.length - 1)] || 'home';

        menuList.removeClass('active');
        switch(actualLocation){
            case "home":
                $(menuList[0]).addClass('active'); //Dashboard
                break;
            case "math":
                $(menuList[1]).addClass('active'); //Practice
                break;
        }


};


function setSelect2Settings(){
    $('#topics select').select2({
        allowClear: true
    });

    $("#topics select").on("change", function(e) {
        if (e.added) {
            // You can add other filters here like
            // if e.val == option_x_of_interest or
            // if e.added.text == some_text_of_interest
            // Then add a custom CSS class my-custom-css to the <li> added
            $(e.added.element).css("background",'#f4b04f');
            //$('.select2-search-choice').css("background",'#f4b04f');
        }
    });
}


function setCookie(c_name,value,exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

//Returns a cookie
function getCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1) {
        c_value = null;
    } else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start,c_end));
    }
    return c_value;
}

//Deletes a cookie
function delCookie(c_name) {
    document.cookie = c_name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


function footer(){
    var url = location.hash;
    if(url=='#/home'){
        $('footer').addClass('hide-footer');
    }
    else{
        $('footer').removeClass('hide-footer');
    }
}