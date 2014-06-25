$(function(){
    //setActiveMenu();
    setSelect2Settings();
});


function setSelect2Settings(){
    var elm= $('#topics select');
    elm.select2({
        allowClear: true
    });

    elm.on("change", function(e) {
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

function setActiveMenu(){
    var menuList = $('div#main-menu-inner ul.navigation li');
    var url = window.location.href.split('/'),
        actualLocation = url[(url.length - 1)] || 'dashboard';

    menuList.removeClass('active');
    switch(actualLocation){
        case "dashboard":
            $(menuList[0]).addClass('active'); //Home Dashboard
            break;
        case "practice":
            $(menuList[0]).addClass('active'); //Home Dashboard
            break;
        case "dashboard-practice":
            $(menuList[1]).addClass('active'); //Game Dashboard
            break;
    }


}


