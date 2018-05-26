/**
 * BUBBLE MENU
 */
myAdmin.bm = {

	init: function(el){
		$(".BM").live("click",function(){ myAdmin.bm.revealBubble(this); });
		$(".BM_hover").live("mouseover",function(){ myAdmin.bm.revealBubble(this, true); });
	},
	revealBubble: function(btnElement, closeOnMouseOut) {
		var btnPosition = $(btnElement).offset();
		
		var element = $(btnElement).find(".BM_bubble").clone();
		
		// nastavim nove bubline specifickou tridu kvuli odstraneni
		element.addClass("BM_createdBubble");
		element.css({ "position":"absolute","z-index":"10000", "left": btnPosition.left+"px", "top": btnPosition.top+"px" })
		
		if($(btnElement).hasClass("BM_sameWidth")) {
			element.css("width", $(btnElement).outerWidth()+"px");
		}
		
		// vlozim do dokumentu overlay (trigger pro zavreni)
		$("body").append('<div id="BM_overlay"></div>');
		$("#BM_overlay").css({"background-image":"url(/sites/default/images/nic.gif)", "position":"absolute","z-index":"10000","top":"0px","left":"0px","width":"100%","height":"100%"});
		
		// vlozim do dokumentu
		element.appendTo("body");
		
		// zobrazeni
		if ( !$.browser.msie ){
			element.fadeIn("fast");				 
		}else{
			element.show();
		}
		
		// kontrola preteceni viewportu
		var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
		var korekce = element.offset().left+element.outerWidth()+20 - x;
		if(korekce > 0) {
			element.css("left", (element.position().left-korekce)+"px");
			if(element.find(".BM_tail").length>0) {
				element.find(".BM_tail").css("left", (element.find(".BM_tail").position().left+korekce)+"px");
			}
		}
		
		myAdmin.colorbox.init();
	
		if(closeOnMouseOut==true) {
			// bublinu zavru klikem mimo nebo na tlacitko close
			$("#BM_overlay").bind("mouseover",function(event){
				myAdmin.bm.removeBubbles();
				return false;
			});
		} else {
			// bublinu zavru klikem mimo nebo na tlacitko close
			$("#BM_overlay, .BM_close").bind("click",function(event){
				myAdmin.bm.removeBubbles();
				return false;
			});
		}
		
		// pokud je v bubline nejaky ajax_href nebo formAjax, reinitnu admin
		if($(".BM_createdBubble .ajax_href, .BM_createdBubble .formAjax").length > 0) {
			myAdmin.init();
		}
		
		return false;
	},
	removeBubbles: function() {
		if(!$.browser.msie) {
			$(".BM_createdBubble").fadeOut("fast",function (){
				$("#BM_overlay").remove();
				$(".BM_createdBubble").remove();
			});
		} else {
			$("#BM_overlay").remove();
			$(".BM_createdBubble").remove();
		}
	}
};


$(document).ready(function(){
	myAdmin.bm.init();
});
