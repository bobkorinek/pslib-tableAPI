cookiebar = {
	message: "Prohlížením tohoto webu souhlasíte s použitím souborů cookies. ",
	accept: "Rozumím",
	initScroll: 0,
	init: function() {
		if(typeof(Storage) !== "undefined" && localStorage.getItem("cookiebarBlocking") == 1) {
			return;
		}
		cookiebar.initScroll = $(window).scrollTop();
		
		if($("#cookiebar").length>0) {
			$("#cookiebar").remove();
		}
		$("<div>")
			.css({
				position: "fixed",
				top: "10px",
				right: "0px",
				"z-index": 999999,
				background: "rgba(0,0,0,0.7)",
				color: "#fff",
				padding: "10px",
				"border-radius": "3px 0 0 3px",
				"box-shadow": "0 0 5px #fff"
			})
			.attr("id", "cookiebar")
			.html(cookiebar.message)
			.appendTo("body")
			.append(
				$("<a>")
					.attr("href", "/")
					.html(cookiebar.accept)
					.addClass("cookiebar-button")
					.click(cookiebar.destroy)
					.css({
						"color": "#fff"
					})
			);
		$(window).scroll(function(){
			if(Math.abs($(window).scrollTop() - cookiebar.initScroll) > 200) {
				cookiebar.destroy();
			}
		});
	},
	destroy: function(event) {
		if(event) {
			event.preventDefault();
		}
		$('#cookiebar').fadeOut("fast", function(){
			$('#cookiebar').remove();
		});
		if(typeof(Storage) !== "undefined") {
			localStorage.setItem("cookiebarBlocking", 1);
		}		
	}
}
$(document).ready(cookiebar.init);