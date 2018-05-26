/**
 * Skript pro výlet do horní části stránky
 */
var up = {
	btnClass: "upBtn",
	init: function() {
		$("."+this.btnClass).click(function(event){
			event.preventDefault();
			up.move();
		});
		up.checkForVisibility();
	},
	move: function() {
		$('html, body').stop().animate({ 'scrollTop': 0 }, 1000);
	},
	checkForVisibility: function() {
		if($(document).height() > $(window).height()) {
			$("."+up.btnClass).show();
		} else {
			$("."+up.btnClass).hide();
		}
	}
}

$(document).ready(function(){
	up.init();
});
