//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Responsive presentation and behavior for HTML data panels
//>>label: Simple Panel
//>>group: Widgets
//>>css.structure: ../css/structure/jquery.mobile.simple-panel.css
//>>css.theme: ../css/themes/default/jquery.mobile.theme.css

(function( $, undefined ) {

$.widget( "mobile.simplepanel", {
	options: {
		"size": 280,
		"threshold": 100,
		"handle": true,
		"enhanced": false,
		"position": "left",
		"theme": "a",
		"scroll": false
	},
	_create: function(){
		if( !this.options.enhanced ) {
			this.enhance();
		}
		this._on( this.handle, {
			"mousedown": function( event ){
				this._on( this.window, {
					"scroll": function( event ){
						$( "body" )[0].scrollLeft = 0;
					}
				});
			},
			"mouseup": function( event ){
				this._off( this.window, "scroll" );
			},
			"touchstart": function( event ){
				event.preventDefault();
			}
		});
		this._refresh();
		this._on( this.window, {
			"orientationchange": "_refresh",
			"throttledresize": "_refresh"
		});
	},
	_refresh: function(){
		var axis = "x",
			windowWidth = this.window.width(),
			windowHeight = this.element.parent().css("position", "relative").outerHeight(),
			handleProps = {},
			cursor = {},
			cssProps = {
				width: this.options.size,
				height: windowHeight,
			},
			containment = [ 0, 0, 0, 0 ];

		switch ( this.options.position ) {
			case "left":
				containment[0] =  -( this.options.size );
				cssProps.left = -( this.options.size );
				cssProps.top = 0;
				handleProps.top = 0;
				handleProps.right = "-52px";
				this.openPosition = 0;
				this.closePosition = -( this.options.size );
				break;
			case "right":
				containment[0] = windowWidth - this.options.size;
				containment[2] =  windowWidth;
				cssProps.left = windowWidth;
				handleProps.top = 0;
				handleProps.left = "-52px";
				cssProps.top = 0;
				this.openPosition = windowWidth - this.options.size;
				this.closePosition = windowWidth;
				break;
			case "top":
				containment[1] = -( this.options.size );
				cssProps.left = 0;
				cssProps.top = -( this.options.size );
				cssProps.width = "100%";
				cssProps.height = this.options.size + "px";
				handleProps.bottom = "-52px";
				handleProps.left = "50%";
				handleProps[ "margin-left" ] = "-26px";
				this.openPosition = 0;
				this.closePosition = -( this.options.size );
				axis = "y";
				break;
		}
		this.element.css( cssProps );
		this.element.draggable({
			"axis": axis,
			"stop": this._dragStop,
			"cursorAt": cursor,
			"containment": containment,
			"handle": this.handle
		});
		this.handle.css( handleProps );
	},
	enhance: function(){
		this.element
			.addClass( "ui-simple-panel ui-panel-display-overlay ui-body-" + this.options.theme );
		if( this.options.scroll ) {
			this.element.css({
				"height": this.window.height(),
			}).addClass( "ui-simple-panel-scroll" );
		}
		this.handle = $( "<div>" )
			.addClass("ui-btn ui-icon-bars ui-btn-icon-notext ui-simple-panel-handle")
			.appendTo( this.element );
	},
	_setOptions: function( options ){
		return this._super( options );
	},
	_dragStop: function(){
		var props = {},
			widget = $( this ).data( "mobileSimplepanel" ),
			options = widget.options,
			direction = ( options.position === "left" || options.position === "right" ) ? "left" : "top",
			offset = $( this ).offset();
		if( offset[ direction ] !== widget.openPosition && offset[ direction ] !== widget.closePosition ) {
			if( ( ( options.position === "left" || options.position === "top" ) &&
				offset[ direction ] > ( widget.closePosition + ( options.size / 2 ) ) ) ||
				( ( options.position === "right" ) &&
				offset[ direction ] < ( widget.closePosition - ( options.size / 2 ) ) ) ||
				( ( options.position === "bottom" ) &&
				offset[ direction ] < ( widget.closePosition - ( options.size / 2 ) ) )
			){
				props[ direction ] = widget.openPosition;
				$( this ).animate( props,200);
			} else {
				props[ direction ] = widget.closePosition;
				$( this ).animate(props,200);
			}
		}
	},
	open: function(){
		this.element.animate({
			left: 0
		},500);
	},
	close: function(){
		this.element.animate({
			left: -( this.options.size )
		},500);
	}


});

})( jQuery );