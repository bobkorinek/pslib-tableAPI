var myAdmin = {
		
	keyPressed: null,
	
	CKEconfig: {
		toolbarGroups: [
    		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
    		{ name: 'styles', groups: [ 'styles' ] },
    		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
    		{ name: 'paragraph', groups: [ 'align', 'list', 'indent', 'blocks', 'bidi', 'paragraph' ] },
    		'/',
    		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
    		{ name: 'links', groups: [ 'links' ] },
    		{ name: 'insert', groups: [ 'insert' ] },
    		{ name: 'forms', groups: [ 'forms' ] },
    		{ name: 'colors', groups: [ 'colors' ] },
    		{ name: 'tools', groups: [ 'tools' ] },
    		{ name: 'others', groups: [ 'others' ] },
    		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] }
    	],
    	removeButtons: ($(window).width()>700 ? 'PasteText,Scayt,About,Strike,Blockquote' : 'PasteText,Scayt,About,Strike,Blockquote,Indent,Outdent,Maximize,Subscript,Superscript,TextColor,BGColor,Underline'),
    	format_tags: 'p;h2;h3;h4;div;pre',
    	uiColor: "#cccccc",
    	defaultLanguage: 'cs',
    	baseFloatZIndex: 100001,
    	skin: 'office2013',
    	extraPlugins: 'button,toolbar,notification,notificationaggregator,uploadwidget,filetools,uploadimage,popup,filebrowser,justify,divarea,nbsp,showblocks,templates',
    	uploadUrl: '/ajax/_mod:node/_handler:nodeTools/_case:CKeditorFilesUpload',
    	filebrowserBrowseUrl: '/admin/dokumenty-ck-editor',
    	extraAllowedContent: 'a span dl dt dd;iframe[*]{*};video[*]{*};source[*]{*}; *(*)',
    	"height": "370px",
    	stylesSet: [
			{ name: 'Obrázek vlevo', element: 'img', attributes: { 'class': 'img_left' } },
			{ name: 'Obrázek vpravo', element: 'img', attributes: { 'class': 'img_right' } },
			{ name: 'Zvýrazněný', element: 'p', attributes: { 'class': 'p_highlight' } },
			{ name: 'Zvýrazněný 2', element: 'p', attributes: { 'class': 'p_highlight2' } }
		]
	},
	
	init: function(){

		myAdmin.datepickers.init();
		myAdmin.myTabs.init();
		myAdmin.colorbox.init();
		myAdmin.adminHeader.init();
		myAdmin.ro.init();
		myAdmin.bm.init();
		myAdmin.cb.init();
		myAdmin.ctxMenu.init();
		
		$(".ajax_href, .ajaxHref").unbind("click");
		$(".ajax_href, .ajaxHref").click(function(){ 
			myAdmin.commitAjax($(this).attr("href"));
			return false;
	    });

		$(".formAjax, .ajaxForm, .form_ajax, .ajax_form").unbind("submit");
		$(".formAjax, .ajaxForm, .form_ajax, .ajax_form").submit(function(){ 
			
			myAdmin.pw.replacePage();
			
			var formParent = $(this).parent();
			
			$(this).ajaxSubmit({ 
		        //target:        '#output2',   // target element(s) to be updated with server response 
		        //beforeSubmit:  function(formData, jqForm, options) { } ,  // pre-submit callback
				type:			'post',
				iframe:			true,
		        success:       function(responseText, statusText, xhr, $form){   // post-submit callback 
					try {
						var obj = jQuery.parseJSON(responseText);
						
						// je to JSON
						if(typeof(obj.error) != 'undefined') {
							myAdmin.pw.cleanPage();
							$.jGrowl(obj.error);
						} else {
							if (obj.ajaxType == "redir"){
								location = obj.redirUrl;
								return false;
							} else if (obj.ajaxType == "refresh"){
								location.reload(true);
								return false;
							} else if (obj.ajaxType == "closeBox"){
								myAdmin.pw.cleanPage();
								$.fn.colorbox.close();
								return false;
							} else {
								myAdmin.pw.cleanPage();
								$.jGrowl("AJAX return value in console");
								console.log(obj);
							}
						}
					} catch(e) {
						// neni to JSON
						myAdmin.pw.cleanPage();
						formParent.html(responseText);
						//$.jGrowl("AJAX executed");
						myAdmin.init();
					}
	         
	        	},
	        	error: function(jqXHR, textStatus, errorThrown) {
	        		$.jGrowl(errorThrown);
	        	}
		 
		    }); 
			return false;
	    });
		
		// CK editor textarea
		$("textarea.do_ckeditor:visible").each(function(){
			var CKEconfig = jQuery.extend({}, myAdmin.CKEconfig);
			if($(this).closest("#colorbox").length>0) {
				id = $(this).closest("#colorbox").find("input[name*='[id]']").val();
				if(id>0) {
					CKEconfig.uploadUrl = CKEconfig.uploadUrl+"/parent:"+id;
				}
			}
			$(this).ckeditor(function(textarea){
				//$(".cke_wysiwyg_div").perfectScrollbar();
				if($("#colorbox").is(":visible")) {
					$.colorbox.resize();
				}
			}, CKEconfig);
		});
		
		// CK editor inline
		$(".item.item_type_content .AB_edit").click(function(event){
			if($(this).closest(".item").children(".item_body").attr('contenteditable') == 'true') {
				return;
			}
			event.preventDefault();
			event.stopPropagation();
			var CKEconfig = jQuery.extend({}, myAdmin.CKEconfig);
			CKEconfig.uploadUrl = CKEconfig.uploadUrl+"/parent:"+$(this).closest(".item").attr("data-id");
			$(this).closest(".item").children(".item_body").attr("data-contenteditable-id", $(this).closest(".item").attr("id").match(/\d+/)).attr('contenteditable','true').ckeditor(function(element) {
			    var editor = $(element).ckeditor().editor;
				$(element).data("originalContent", editor.getData());
		    	editor.on('blur', function() {
			    	if(typeof $(editor.container).attr("data-contenteditable-id")!="undefined") {
				    	if($(".item_body[data-contenteditable-id='"+$(editor.container).attr("data-contenteditable-id")+"']").data("originalContent") == editor.getData()) {
							$(editor.container).attr('contenteditable','false');
							editor.destroy();
				    		return;
				    	}
				    	if(!confirm("Chcete změny uložit?")) {
				    		var body = $(".item_body[data-contenteditable-id='"+$(editor.container).attr("data-contenteditable-id")+"']");
				    		body.html(body.data("originalContent"));
							$(editor.container).attr('contenteditable','false');
							editor.destroy();
				    		return;
				    	}
						$.ajax({ 
					        //beforeSubmit:  function(formData, jqForm, options) { } ,  // pre-submit callback
							url: '/ajax/_mod:node/_handler:nodeTools/_case:update',
							type: 'post',
							data: {
								id: parseInt($(editor.container).attr("data-contenteditable-id")),
								file: editor.getData()
							},
					        success: function(responseText, statusText, xhr, $form){   // post-submit callback 
								try {
									var obj = jQuery.parseJSON(responseText);
									// je to JSON
									if(typeof(obj.error) != 'undefined') {
										$.jGrowl("Error: "+obj.error);
									} else {
										$.jGrowl("Saved");
										$(editor.container).attr('contenteditable','false');
										editor.destroy();
									}
								} catch(e) {
									$.jGrowl("Wrong server response");
									$.jGrowl(responseText);
								}
				        	}
					    });
			    	}
			    } );
				
			}, CKEconfig).focus();
		});
		
	},
	
	insiteAdminToggler: function() {
		$(".insiteAdminToggler").toggle();
		$(".insiteToolsSwitchBtn").toggleClass("insiteToolsSwitchBtnHidden");
	},
	
	commitAjax: function(url) {
		myAdmin.pw.replacePage();
		$.ajax({ 
			url: url,
			type: 'get',
			success: function(responseText, statusText, xhr){   // post-submit callback 
				try {
					var obj = jQuery.parseJSON(responseText);

					// je to JSON
					if(typeof(obj.error) != 'undefined') {
						myAdmin.pw.cleanPage();
						$.jGrowl(obj.error);
					} else {
						if(obj.ajaxType == "redir"){
							$.jGrowl("Loading");
							window.location = obj.redirUrl;
						} else if(obj.ajaxType == "none") {
							myAdmin.pw.cleanPage();
							$.jGrowl("Done");
						} else {
							$.jGrowl("Loading");
							window.location.reload(true);
						}							//alert("formAjax nepodporuje JSON pro navratove hodnoty");
						return true;
					}
				} catch(e) {
					// neni to JSON
					myAdmin.pw.cleanPage();
					$.jGrowl("Wrong server response");
					$.jGrowl(responseText);
				}

			},
			error: function(jqXHR, textStatus, errorThrown) {
				myAdmin.pw.cleanPage();
				$.jGrowl("Error: "+errorThrown);
			}
		});
		return false;
	},
	
	/**
	 * tlacitko formulare na onclick prida do formulare hidden se svym priznakem (kvuli ajaxFormu, on odesilal vse, tlacitka ktera se nestiskla)
	 */
	formAjax_click: function(el, event){
		var toappend = '<input type="hidden" name="formData[X_formEvents]['+event+']" value="1" class="formData_eventSelector" />';
		$(".formData_eventSelector").remove();
		$(el).parents("form").append(toappend);
		return true;
	},
	
	keyDown: function(e) {
	   var keyId = (window.event) ? event.keyCode : e.keyCode;
	   myAdmin.keyPressed = keyId;
	},
	
	keyUp: function(e) {
	   var keyId = (window.event) ? event.keyCode : e.keyCode;

	   myAdmin.keyPressed = null;
	   
	   //alert(KeyID);
	   if(keyId==113) {
		   myAdmin.insiteAdminToggler();
	   }
	   
	   //alert(keyId)
	   if(keyId==115) {
		   if($(".PA").hasClass("showArea")) {
			   $(".PA").removeClass("showArea");
		   } else {
			   $(".PA").addClass("showArea");
		   }
	   }
		   
	},
	
	/**
	 *	Funkce vrati 
	 */
	parseHashVars: function(){
	   var vars = window.location.hash;
	   var result = [];
	   if(vars.length > 0){
	      if(vars.charAt(0) == '#')
	         vars = vars.substr(1);
	      vars = vars.split('&');
	      var count = vars.length;
	      for(var i = 0; i < count; i++){
	         var v = vars[i];
	         if(v.indexOf('=') > 0){
	            var keyValue = v.split('=');
	            result[keyValue[0]] = keyValue[1];
	            //document.write(keyValue[0] + ': ' + keyValue[1] + '<br/>');
	         }
	      }
	   }
	   return result;
	},
	
	/**
	 * Context menu for Page Tools, responsive menu and varius context menus
	 */
	ctxMenu: {
			
		visible: false,
		animating: false,
		selector: "body > .ctxMenu",
		
		init: function(){
			if($(myAdmin.ctxMenu.selector).length>0) return;
			$("body").append('<div class="ctxMenu"></div>');
			$(myAdmin.ctxMenu.selector).css({
				"left":"-"+$(myAdmin.ctxMenu.selector).outerWidth()+"px"
			}).perfectScrollbar();
			$(window).resize(function(){
				$(myAdmin.ctxMenu.selector).css({
					"left":"-"+$(myAdmin.ctxMenu.selector).outerWidth()+"px"
				});
			});
			$('html').click(function(event) {
				if(!$(event.target).closest('.ctxMenu, #colorbox, #cboxOverlay').length) {
					myAdmin.ctxMenu.close();
				}
			});
			myAdmin.ctxMenu.close();
		},
		
		/**
		 * source muze byt:
		 * 			- jQuery objekt (selector obalu)
		 * 			- primo html kod
		 * 			- TODO: url s ajax obsahem
		 */
		open: function(source, cls) {
			myAdmin.ctxMenu.animating = true;
			if(typeof $(myAdmin.ctxMenu.selector).attr("data-addedClass") != "undefined") {
				$(myAdmin.ctxMenu.selector).removeClass($(myAdmin.ctxMenu.selector).attr("data-addedClass"));
			}
			if(typeof cls != "undefined") {
				$(myAdmin.ctxMenu.selector).addClass(cls).attr("data-addedClass", cls);
			} else {
				$(myAdmin.ctxMenu.selector).attr("data-addedClass", "");
			}
			$(myAdmin.ctxMenu.selector).children().not("[class^='ps-']").remove();
			if(source instanceof jQuery) { // jQuery selector
				source.children().clone(true).appendTo(myAdmin.ctxMenu.selector);
			} else {
				$(source).appendTo(myAdmin.ctxMenu.selector);
			}
			$("body").addClass("ctxMenu-opened");
			$(myAdmin.ctxMenu.selector).find("li > a[href='"+window.location.pathname+"']").addClass("focus");
			// eventy na obsah
			$(myAdmin.ctxMenu.selector).find('li a').click(function(e){
				if($(this).siblings("ul").length>0 && !$(this).parent().hasClass("active")) {
					event.preventDefault();
					$(this).parent().addClass("active");
					myAdmin.ctxMenu.closeOtherLis($(this));
				}
			});
			$(myAdmin.ctxMenu.selector).find('li .a').click(function(e){
				$(this).parent().toggleClass("active");
				myAdmin.ctxMenu.closeOtherLis($(this));
			});
			
			$(myAdmin.ctxMenu.selector).find('ul').each(function(){
				$(this).siblings("a, .a").append('<span class="ctxMenuArrow"></span>');
			});
			
			$(myAdmin.ctxMenu.selector).animate({"left":"0px"}, 50, function(){
				myAdmin.ctxMenu.animating = false;
			});
			myAdmin.ctxMenu.visible = true;
		},
		close: function() {
			if(!myAdmin.ctxMenu.visible || myAdmin.ctxMenu.animating) {
				return;
			}
			$("body").removeClass("ctxMenu-opened");
			myAdmin.ctxMenu.animating = true;
			$(myAdmin.ctxMenu.selector).animate({"left":"-"+$(myAdmin.ctxMenu.selector).outerWidth()+"px"}, 50, function(){
				$(myAdmin.ctxMenu.selector).html("");
				myAdmin.ctxMenu.animating = false;
			});
			myAdmin.ctxMenu.visible = false;
		},
		closeOtherLis: function(el) {
			$(myAdmin.ctxMenu.selector).find("li.active").not($(el).parents()).removeClass("active");
			$(myAdmin.ctxMenu.selector).find(".focus").removeClass("focus");
			$(el).addClass("focus");
		}
	},
	
	/**
	 * Bubble menu
	 */
	bm: {

		init: function(el){
			$(".BM").live("click",function(){ myAdmin.bm.revealBubble(this); });
			$(".BM_hover").live("mouseover",function(){ myAdmin.bm.revealBubble(this, true); });
		},
		revealBubble: function(btnElement, closeOnMouseOut) {
			
			myAdmin.bm.removeBubbles();
			
			var btnPosition = $(btnElement).offset();
			
			var element = $(btnElement).find(".BM_bubble").clone();
			
			// nastavim nove bubline specifickou tridu kvuli odstraneni
			element.addClass("BM_createdBubble");
			element.css({ "position":"absolute","z-index":"10000", "left": btnPosition.left+"px", "top": btnPosition.top+"px" });
			
			if($(btnElement).hasClass("BM_sameWidth")) {
				element.css("width", $(btnElement).outerWidth()+"px");
			}
			
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
			
			if(closeOnMouseOut==true) {
				// bublinu zavru klikem mimo nebo na tlacitko close
				$('html').mousemove(function(event) {
					if(!$(event.target).closest('.BM_createdBubble, .BM_hover').length) {
						myAdmin.bm.removeBubbles();
					}
				});
				$("#BM_overlay").bind("mouseover",function(event){
					myAdmin.bm.removeBubbles();
					return false;
				});
			} else {
				$('html').click(function(event) {
					if($(event.target).closest('.BM_close').length || !$(event.target).closest('.BM_createdBubble').length) {
						myAdmin.bm.removeBubbles($(event.target).closest('.BM, .BM_hover').length>0);
					}
				});
			}
			
			// pokud je v bubline nejaky ajax_href nebo formAjax, reinitnu admin
			if($(".BM_createdBubble .ajax_href, .BM_createdBubble .formAjax").length > 0) {
				myAdmin.init();
			} else {
				myAdmin.colorbox.init();
			}
			
			return false;
		},
		removeBubbles: function(allButLast) {
			var selector = (allButLast ? $(".BM_createdBubble").not(":last") : $(".BM_createdBubble"));
			if(!$.browser.msie) {
				$(selector).fadeOut("fast",function (){
					$(selector).remove();
				});
			} else {
				$(selector).remove();
			}
		}
	},
	
	/**
	 * CheckBoxes
	 */
	cb: {

		init: function(){
			var el = ".CB";
			$(el).unbind("click").bind("click",function (event) {
				var chbox = $(this).find("[type=checkbox]");
				
				if($(this).hasClass("CB_radiomode")) {
					// neni zmacknuty CTRL?
					if(myAdmin.keyPressed != 17) {
						// odznacim vsechny predem oznacene CB
						$(".CB input:checkbox").removeAttr("checked");
					}
				}
				
				if($(event.target).filter("input:checkbox").length > 0) {
					// kleplo se primo na checkbox a jeho funkci zajistil prohlizec -> neovlivnovat ho uz
					// nic nedelam, o reset trid se postara spesl funkce (resetClasses)
				} else {
					if($(chbox).attr("checked")) {
						// je zaskrtnuty
						$(chbox).removeAttr("checked");
					} else {
						$(chbox).attr("checked","checked");
					}
				}
				$(chbox).change();
				myAdmin.cb.resetClasses();
			});
			myAdmin.cb.resetClasses();
		},
		resetClasses: function() {
			var chbox;
			$(".CB").each(function(){
				chbox = $(this).find("input:checkbox");
				if($(chbox).attr("checked")) {
					$(this).addClass("CB_checked");
				} else {
					$(this).removeClass("CB_checked");
				}
			});
		},
		addSelectedToHref: function(link){
			var tail = "";
			var chbox;
			// najdu vsechny zaskrtle
			$(".CB").each(function(){
				chbox = $(this).find("input:checkbox");
				if($(chbox).attr("checked") && typeof($(this).attr("id"))!="undefined" && $(this).attr("id").match(/\d+/) != null) {
					if(tail!="") tail += ",";
					tail += $(this).attr("id").match(/\d+/);
				} else if($(chbox).attr("checked") && $(chbox).val().match(/\d+/) != null) {
					if(tail!="") tail += ",";
					tail += $(chbox).val().match(/\d+/);
				}
			});
			tail = "/ids:"+tail;
			$(link).attr("href", $(link).attr("href")+tail);
			//alert($(link).attr("href"));
		},
		deselectAll: function() {
			$(".CB input:checkbox").removeAttr("checked");
			myAdmin.cb.resetClasses();
		}
	},
	
	datepickers: {
		conf_date: {
			dateFormat: 'yy-mm-dd',
			showWeek: true,
			changeYear: true,
			yearRange: '1900:2030' 
		},
		conf_time: {
			timeFormat: 'hh:mm:ss',
			separator: ' ',
			hour: 12,
			stepMinute: 5,
			stepSecond: 10,
			showSecond: true,
			showWeek: true 
		},
		conf_datetime: {
			dateFormat: 'yy-mm-dd',
			timeFormat: 'hh:mm:ss',
			separator: ' ',
			hour: 12,
			stepMinute: 5,
			stepSecond: 10,
			showSecond: true,
			showWeek: true,
			changeYear: true,
			yearRange: '1900:2030' 
		},
		init: function() {
			if($(".datepicker").length>0) {
				$(".datepicker").datepicker("destroy");
				$(".datepicker").datepicker(myAdmin.datepickers.conf_date);
			}
			if($(".timepicker").length>0) {
				$(".timepicker").timepicker("destroy");
				$(".timepicker").timepicker(myAdmin.datepickers.conf_time);
			}
			if($(".datetimepicker").length>0) {
				$(".datetimepicker").datetimepicker("destroy");
				$(".datetimepicker").datetimepicker(myAdmin.datepickers.conf_datetime);
			}
			// upozorneni na nastaveni expirace
			$("input[name*='[expiration]']").change(function(){
				if($(this).val()!="") {
					$(this).closest("form")
						.unbind("submit", myAdmin.datepickers.expirationWarning)
						.bind("submit", myAdmin.datepickers.expirationWarning);
				}
			});
		},
		expirationWarning: function() {
			if(!confirm("Vyplnili jste expiraci. Opravdu chcete použít?")) {
				$("input[name*='[expiration]']").val("");
			}
		}
	},
	
	myTabs: {
		init: function() {
			if($(".tabbed .tabs a[href='"+window.location.hash+"']").length>0) {
				// v URL mame platnou hash zalozky, zobrazime ji tedy
				myAdmin.myTabs.activateTab(window.location.hash);
			} else {
				// chybi v URL hash zalozky, zobrazime prvni
				$(".tabbed").each(function(){ // tohle musime udelat, aby se zalozka zmenila v kazdem .tabbed na strance nezavisle (druhy parametr metody)
					if($(this).find("li.active").length == 0) {
						myAdmin.myTabs.activateTab($(this).find(".tabs li a").first().attr("href"), $(this));
					}
				});
			}
			// kdyz se zalozky nevejdou, pridaji se sipecky a overflow:hidden
			$(".tabs").css("overflow", "hidden");
			$(".tabs").each(function(){
				if(this.offsetHeight < this.scrollHeight || this.offsetWidth < this.scrollWidth) {
					if($(this).siblings(".tabScroll").length==0) {
						$(this).find("li").css({ "position": "relative", "left": "0px"});
						$(this).closest(".tabbed").css("position", "relative");
						$(this).parent().append('<div class="tabScroll l"></div><div class="tabScroll r"></div>')
							.find(".tabScroll").click(function(){
								var increment = 100;
								var maxOffset = $(this).siblings(".tabs")[0].scrollWidth - $(this).siblings(".tabs")[0].offsetWidth;
								if($(this).hasClass("r")) {
									increment = increment * -1;
								}
								var offset = parseInt($(this).parent().find(".tabs li:first").css("left")) + increment;
								if(offset<=0 && offset>=(-maxOffset-Math.abs(increment)-2*$(".tabScroll").width())) {
									$(this).parent().find(".tabs li").animate({"left": offset+"px"}, 100, "swing");
									//if(offset>=0) $(this).parent().children(".tabScroll.l").addClass("disabled"); else $(this).parent().children(".tabScroll.l").removeClass("disabled");
									//if(offset<=Math.floor((-maxOffset-Math.abs(increment))/increment)*increment) $(this).parent().children(".tabScroll.r").addClass("disabled"); else $(this).parent().children(".tabScroll.r").removeClass("disabled");
								}
							});
					}
				}
			});
			
			// events
			$(".tabbed").children(".tabs").find("a").click(function(){
				myAdmin.myTabs.activateTab($(this).attr("href"), $(this).parents(".tabbed").first());
				return false;
			});
		},
		/**
		 * selector je hodne dulezity pro vice formularu na strance, aby se mezi sebou nebili
		 */
		activateTab: function(id, selector) {
			if(selector == undefined) {
				selector = ".tabbed";
			}
			$(selector).children(".tabs").find("li").removeClass("active");
			$(selector).children(".tabs").find("a[href='"+id+"']").parents("li").first().addClass("active");
			$(selector).children(".tab").hide();
			$(selector).children(id).show();
			if($("#colorbox").is(":visible")) {
				if($("#colorbox .do_ckeditor:visible").length==0) {
					setTimeout("$.colorbox.resize();",100);
				}
			}
		}
	},
	
	colorbox: {
		init: function(){
			var imageSettings = {
				photo:true,
				fixed:true,
				reposition:true,
				trapFocus: false,
				maxWidth:"95%",
				maxHeight:"95%",
				speed:100,
				current:"{current} / {total}",
				previous:"Předchozí",
				next:"Další",
				close:"Zavřít",
				onLoad:function(){
					$("#colorbox, #cboxOverlay").removeClass("cboxVideo").addClass("cboxImage");
					if($(window).width()<1000) {
						$("#colorbox, #cboxOverlay").addClass("cboxResponsiveImage");
					}
				}
			};
			if($(window).width()<1000) {
				imageSettings.maxWidth = false;
				imageSettings.maxHeight = false;
				imageSettings.innerWidth = "100%";
				imageSettings.innerHeight = "100%";
			}
			var videoSettings = jQuery.extend({}, imageSettings);	// shallow copy, jinak je to reference
			videoSettings.iframe = true;
			videoSettings.onLoad = function(){
				$("#colorbox, #cboxOverlay").removeClass("cboxImage").addClass("cboxVideo");
				if($(window).width()<1000) {
					$("#colorbox, #cboxOverlay").addClass("cboxResponsiveImage");
				}
				$("#colorbox iframe").attr("allowfullscreen", "allowfullscreen");
			};
			
			var dialogSettings = {
				fixed:true,
				reposition:true,
				trapFocus: false,
				width:"800px",
				height:"600px",
				maxWidth:"98%",
				maxHeight:"98%",
				speed:100,
				onLoad:function(){
					$("#colorbox, #cboxOverlay").removeClass("cboxVideo cboxImage cboxResponsiveImage");
				},
				onComplete:function(){
					// je to json?
					var responseText = $("#cboxLoadedContent").html();
					try {
						var obj = jQuery.parseJSON(responseText);
						// je to JSON
						if(typeof(obj.error) != 'undefined') {
							$("#cboxLoadedContent").html('<div class="exception"><h2>Error</h2><p class="msg"></p><ol class="trace"></ol></div>');
							$("#cboxLoadedContent p.msg").html(obj.error);
							for(i in obj.trace) {
								txt = obj.trace[i]["class"]+obj.trace[i]["type"]+obj.trace[i]["function"]+' ('+obj.trace[i]["file"]+':'+obj.trace[i]["line"]+')';
								txt = txt.replace("undefined", "").replace("NaN", "");
								$("#cboxLoadedContent .trace").append('<li>'+txt+'</li>');
							}
							console.log(obj);
							$.colorbox.resize();
						}
					} catch(e) { }
					
					if($("#colorbox").find(".do_ckeditor").length>0) {
						// vypnu zavirani klikem na overlay
						$.colorbox.settings.escKey = false;
						$("#cboxOverlay, #cboxClose").unbind("click");
						$("#cboxOverlay, #cboxClose").bind("click", function(){
							if(confirm("Opravdu zavřít dialog?")) {
								$.colorbox.close();
							}
						});
					}
					myAdmin.init();
					myAdmin.colorbox.addMinimizeBtn();
				}
			};
			if($(window).width()<1000) {
				dialogSettings.width = "98%";
				dialogSettings.height = "98%";
			}
			
			// image colorbox
			$("a.cbox_image").not($(".cke .cbox_image")).colorbox(imageSettings);
			$("img.cbox_image").not($(".cke .cbox_image")).parent().colorbox(imageSettings);
			
			// video colorbox
			$("a.cbox_video").each(function(){
				videoSettings.innerWidth = Math.min((parseInt($(this).attr("data-w"))>0 ? parseInt($(this).attr("data-w")) : 5000), 800, $(window).width());
				videoSettings.innerHeight = Math.min((parseInt($(this).attr("data-h"))>0 ? parseInt($(this).attr("data-h")) : 5000), 600, $(window).height());
				$(this).colorbox(videoSettings)
			});
			
			// dialog colorbox, content colorbox
			$(".cbox_dialog, .cbox_content").click(function(e){
				e.preventDefault();
				$.colorbox($.extend(true, { }, dialogSettings, {
					href:$(this).attr("href")
				}));
			});
			$(".cbox_dialogMax, .cbox_contentMax").click(function(e){
				e.preventDefault();
				$.colorbox($.extend(true, { }, dialogSettings, {
					href:$(this).attr("href"),
					width: "95%",
					height: "90%"
				}));
			});
			$(".cbox_remove_dialog").click(function(e){
				e.preventDefault();
				$.colorbox($.extend(true, { }, dialogSettings, {
					href:$(this).attr("href"),
					width: "500px",
					height: "300px",
					onComplete: function(){
						$("#colorbox, #cboxOverlay").removeClass("cboxImage").removeClass("cboxResponsiveImage");
						setTimeout("$.colorbox.resize();",10);
						myAdmin.init();
						myAdmin.colorbox.addMinimizeBtn();
					}
				}));
			});

		},
		addMinimizeBtn: function() {
			$("#cboxMin").remove();
			$("#cboxContent").append('<div id="cboxMin">Minimize</div>');
			$("#cboxMin").unbind("click");
			$("#cboxMin").click(function(){
				$("#cboxOverlay").hide();
				$("#colorbox").hide();
				$("#cboxMin2").remove();
				$("body").append('<div id="cboxMin2"><span id="cboxMin2_text">Obnovit boxík <span id="cboxMin2_label"></span></span></div>');
				$("#cboxMin2_label").html($("#cboxTitle").html());
				$("#cboxMin2").unbind("click");
				$("#cboxMin2").click(function(){
					$("#cboxOverlay").show();
					$("#colorbox").show();
					$("#cboxMin2").remove();
				});
			});
		}
	},
	
	pa: {
		init: function(parent){
			if(typeof(parent) == 'undefined') {
				alert("PA: page id not set!");
				return;
			}
			parent = parseInt(parent);
			var backgroundTmp;
			$(".PA_handle").show();
			$(".PA").css("min-height", "50px"); // aby se do nich slo trefovat
			$(".PA").sortable( "destroy" );
			$(".PA").sortable({
				connectWith: ".PA",
				handle: '.PA_handle',
				cursor: 'move',
				opacity: 0.6,
				revert: 100,
				placeholder: 'PA_placeholder',
				forcePlaceholderSize: true,
				forceHelperSize: true,
				start: function(event, ui) {
					backgroundTmp = $(ui.helper).css("background-color");
					$(ui.helper).css("background-color", "white");
					$(".PA").each(function(){
						if($(this).css("min-height")=="0px") {
							$(".PA").css("min-height", "10px");
						}
					});
				},
				over: function(event, ui) {
					$(".PA").removeClass("PA_areaHover");
					$(this).addClass("PA_areaHover");
				},
				stop: function(event, ui) {
					$(".PA").removeClass("PA_areaHover");
					$(ui.item).css("background-color", backgroundTmp);
					var result = "parent="+parent;
					$(".PA").each(function(){
						result = result + "&" + $(this).sortable("serialize", {"key":"node["+$(this).attr("id").match(/\d+/)+"][]"});
					});
					// poslu ajaxem nove rozlozeni
					//$.jGrowl(result);
					$.ajax({ 
				        //beforeSubmit:  function(formData, jqForm, options) { } ,  // pre-submit callback
						url:			'/ajax/_mod:node/_handler:nodeTools/_case:saveOrder/?'+result,
						type:			'get',
				        success:		function(responseText, statusText, xhr, $form){   // post-submit callback 
						
											try {
												var obj = jQuery.parseJSON(responseText);
												
												// je to JSON
												if(typeof(obj.error) != 'undefined') {
													$.jGrowl("Error: "+obj.error);
												} else {
													$.jGrowl("Saved");
												}
											} catch(e) {
												$.jGrowl("Wrong server response");
												$.jGrowl(responseText);
											}
							         
							        	}
				    }); 				
				}
			});
			//$(".PA").disableSelection();
		}
	},
	
	is: {
		init: function(parent){
			if(typeof(parent) == 'undefined') {
				alert("IS: Chybí id stránky!");
				return;
			}
			$("#"+parent).sortable( "destroy" );
			$("#"+parent).sortable({
				handle: '.IS_handle',
				cursor: 'move',
				opacity: 0.6,
				revert: 100,
				placeholder: 'IS_placeholder',
				forcePlaceholderSize: true,
				forceHelperSize: true,
				stop: function(event, ui) {
					var result = "parent="+parent.match(/\d+/);
					$("#"+parent).each(function(){
						result = result + "&" + $(this).sortable("serialize", {"key":"node[0][]"});
					});
					// poslu ajaxem nove rozlozeni
					//$.jGrowl(result);
					//return;
					$.ajax({ 
				        //beforeSubmit:  function(formData, jqForm, options) { } ,  // pre-submit callback
						url:			'/ajax/_mod:node/_handler:nodeTools/_case:saveOrder/?'+result,
						type:			'get',
				        success:		function(responseText, statusText, xhr, $form){   // post-submit callback 
						
											try {
												var obj = jQuery.parseJSON(responseText);
												
												// je to JSON
												if(typeof(obj.error) != 'undefined') {
													$.jGrowl("Error: "+obj.error);
												} else {
													$.jGrowl("Saved");
												}
											} catch(e) {
												$.jGrowl("Wrong server response");
												$.jGrowl(responseText);
											}
							         
							        	}
				    }); 				
				}
			});
			//$(".PA").disableSelection();
		}
	},
	
	adminHeader: {
		init: function(){
			if($(".pageHeader").length > 0) {
				$(".pageHeader .container").append('<a href="" class="minimize">Minimalizovat</a><a href="" class="maximize">Maximalizovat</a>');
				$(".pageHeader .minimize").click(myAdmin.adminHeader.minimize);
				$(".pageHeader .maximize").click(myAdmin.adminHeader.maximize).addClass("active");
				if(typeof(Storage) !== "undefined" && localStorage.getItem("adminHeaderMinimized")=="true") {
						myAdmin.adminHeader.minimize(null);
				}
			}
		},
		minimize: function(event) {
			$(".pageHeader").addClass("minimized");
			$(".pageHeader .minimize, .pageHeader .maximize").toggleClass("active");
			if(typeof(Storage) !== "undefined") {
				localStorage.setItem("adminHeaderMinimized", "true");
			}
			if(event!=null && event!=undefined) {
				event.preventDefault();
				event.stopPropagation();
			}
		},
		maximize: function(event) {
			$(".pageHeader").removeClass("minimized");
			$(".pageHeader .minimize, .pageHeader .maximize").toggleClass("active");
			if(typeof(Storage) !== "undefined") {
				localStorage.setItem("adminHeaderMinimized", "false");
			}
			if(event!=null && event!=undefined) {
				event.preventDefault();
				event.stopPropagation();
			}
		}
	},
	
	ro: {
		init: function(){
			$(".RO_toggler").click(function(){
				myAdmin.ro.toggle($(this).attr("rel"));
				return false;
			});
		},
		toggle: function(selector){
			$(selector).toggle();
		}
	},
	
	pw: {
		replaceContent: function(element){
			$(element).html('<div class="pw"></div>');
		},
		replaceContentMini: function(element){
			$(element).html('<img src="/sites/default/images/pw/wait.gif" alt="Please wait" class="pw_mini" />');
		},
		replacePage: function(){
			$("body").append('<div id="pw_page"></div>');
			$("#pw_page").css({
				"position":		"fixed",
				"z-index":		"9999999",
				"top":			"0px",
				"left":			"0px",
				"width":		"100%",
				"height":		"100%",
				"background":	"#fff url('/sites/default/images/pw/wait.gif') center no-repeat",
				"opacity":		"0.5"
			});
		},
		cleanPage: function(){
			$("#pw_page").remove();
		}
	}
};

$(document).ready(function(){
	myAdmin.init();
	document.onkeyup = myAdmin.keyUp;
	document.onkeydown = myAdmin.keyDown;
	
	if($("body").hasClass("adminPage")) {
		myAdmin.insiteAdminToggler();
	}
});

