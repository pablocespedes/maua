$(function(){
    backToTop();
});

function backToTop() {
		var offset = 220;
		var duration = 500;
		$('#main-wrapper').scroll(function () {
				if ($(this).scrollTop() > offset) {
						$('.back-to-top').fadeIn(duration);
				} else {
						$('.back-to-top').fadeOut(duration);
				}
		});

		$('.back-to-top').click(function (event) {
				event.preventDefault();
				$('#main-wrapper').animate({scrollTop: 0}, duration);
				return false;
		})
}


