$(function(){
    backToTop();
});




function backToTop(){
        var offset = 220;
        var duration = 500;
        $('#main-wrapper').scroll(function() {
            if ($(this).scrollTop() > offset) {
                $('.back-to-top').fadeIn(duration);
            } else {
                $('.back-to-top').fadeOut(duration);
            }
        });

        $('.back-to-top').click(function(event) {
            event.preventDefault();
            $('#main-wrapper').animate({scrollTop: 0}, duration);
            return false;
        })
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


