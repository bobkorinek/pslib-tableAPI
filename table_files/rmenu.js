var rmenu = {
	originalMenu: null,
	activePage: null,
	init: function(originalMenu, activePage) {
		rmenu.originalMenu = originalMenu;
		rmenu.activePage = activePage;
		$(window).resize(rmenu.redrawMenus);
		rmenu.redrawMenus();
	},
	redrawMenus: function(){
		if($(window).width() < 1020 && $(window).width() >= 1019) {
			// klikaci normalni menu
			$(rmenu.originalMenu).find("li ul").hide();
			$(rmenu.originalMenu).find("ul").siblings("a").click(function(e){
				if(!$(this).siblings("ul").is(":visible")) {
					$(rmenu.originalMenu).find("li ul").not($(this).parents()).hide();
					$(this).siblings("ul").show();
					e.preventDefault();
					return false;
				}
			});
		} else if($(window).width() < 1019) {
			$(rmenu.originalMenu).hide();
			if($(".responsive-menu").length == 0) {
				$(rmenu.originalMenu).after('<div class="responsive-menu"></div>');
			}
			$(".responsive-menu").show();
			if($(".responsive-menu").html() == "") {
				$(".responsive-menu").html($(rmenu.originalMenu).html());
				$(".responsive-menu").prepend('<a href="#" class="responsive-menu-btn"></a>');
				$(".responsive-menu ul").hide().each(function(){
					if($(this).parents("li").length > 0) {
						$(this).prepend('<li class="responsive-menu-back"><a href="#">Zpět</a></li>');
					}
				});
				var i = 0;
				$(".responsive-menu li").each(function(){
					$(this).attr("data-responsive-id", 'responsive-menu-'+i);
					if($(this).children("ul").length>0) {
						$(this).children("a").addClass("hasChildren");
						$(this).append('<a href="#" class="reveal"><span>(rozbalit)</span></a>');
					}
					i++;
				});
				$(".responsive-menu-btn").click(rmenu.drawMenu);
			}
			rmenu.setMenuBubblePosition();
		} else {
			rmenu.removeMenu();
			$(rmenu.originalMenu).show();
			$(".responsive-menu").hide();
			$(rmenu.originalMenu).find("a").unbind("click");
		}
	},
	drawMenu: function(event) {
			
		rmenu.removeMenu();
		
		// vlozim do dokumentu overlay (trigger pro zavreni)
		$("body").append('<div id="responsive-menu-overlay"></div>');
		$("#responsive-menu-overlay").css({ "background-image":"url(/sites/default/images/nic.gif)", "position":"absolute","z-index":"1000","top":"0px","left":"0px","width":"100%","height":"100%" });
		$("#responsive-menu-overlay").bind("click",rmenu.removeMenu);
		
		// vlozim do dokumentu
		$("body").append('<div class="responsive-menu-bubble"></div>');
		$(".responsive-menu-bubble").hide();
		if($(this).hasClass("responsive-menu-btn")) {	// klikl jsem na inicializacni tlacitko
			// vykreslim hlavni menu
			event.preventDefault();
			$(this).parent().find("ul").first().clone().appendTo(".responsive-menu-bubble");
		} else if($(this).parent("li").hasClass("responsive-menu-back")) {	// klikl jsem na zpetne tlacitko
			// vykreslim nadmenu
			event.preventDefault();
			var id = $(this).parent("li").attr("data-responsive-id");
			$(".responsive-menu li[data-responsive-id='"+id+"']").parent().parent().parent().clone().appendTo(".responsive-menu-bubble");
		} else if($(this).hasClass("reveal")) {	// klikl jsem na tlacitko, ktere ma podmenu
			// vykreslim nadmenu
			event.preventDefault();
			$(this).parent().children("ul").clone().appendTo(".responsive-menu-bubble");
		} else {
			// nedelam nic, prejdu na stranku
			return;
		}

		rmenu.setMenuBubblePosition();
		$(".responsive-menu-bubble ul").hide().first().show();
		
		// zobrazeni
		if ( !$.browser.msie ){
			$(".responsive-menu-bubble").show();
		}else{
			$(".responsive-menu-bubble").show();
		}
		// klik na podmenu
		$(".responsive-menu-bubble a").unbind("click");
		$(".responsive-menu-bubble a").click(rmenu.drawMenu);
		
	},
	removeMenu: function() {
		$("#responsive-menu-overlay, .responsive-menu-bubble").remove();
		return false;
	},
	setMenuBubblePosition: function(){
		if($(".responsive-menu-bubble").length>0) {
			$(".responsive-menu-bubble").css({ 
				"position":"absolute",
				"z-index":"1000", 
				"left": ($(".responsive-menu-btn").offset().left-$(".responsive-menu-bubble").outerWidth()+$(".responsive-menu-btn").outerWidth())+"px", 
				"top": ($(".responsive-menu-btn").offset().top+$(".responsive-menu-btn").outerHeight())+"px"
			});
		}
	}
};
