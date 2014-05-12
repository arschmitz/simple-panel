//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Responsive presentation and behavior for HTML data panels
//>>label: Simple Panel
//>>group: Widgets
//>>css.structure: ../css/structure/jquery.mobile.simple-panel.css
//>>css.theme: ../css/themes/default/jquery.mobile.theme.css

(function( $, undefined ) {

$.widget( "mobile.simplepanel", {
	options: {
		"size": 220,
		"threshold": 100,
		"handle": null,
		"enhanced": false,
		"position": "left",
		"theme": "a",
		"scroll": false,
		"responsive": false,
		"mode": "overlay"
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
		this._on( this.handle, {
			"mousedown": "_setDraggable"
		});
	},
	_refresh: function(){
		this.axis = "x";
		this.windowWidth = this.window.width();
		this.handleProps = {};
		this.cssProps = {
				width: this.options.size,
				height: this.window.height(),
			};
		this.windowWidth = this.window.width();

		this.containment = [ 0, 0, 0, 0 ];

		this[ "_" + this.options.mode + this.options.position ]();
		this.element.css( this.cssProps );
		this._setDraggable();
		this.dragElement.data( "simplepanelref", this.element );
		if( !this.options.handle ) {
			this.handle.css( this.handleProps ).appendTo( this.dragElement );
		}
	},
	_setDraggable: function() {
		this.document.find( ":mobile-simplepanel" ).each( function(){
			if( $( this ).simplepanel( "option", "mode" ) === "reveal" ) {
				$( this ).css( "z-index", "-1" );
			}
		});
		this.dragElement.data( "simplepanelref", this.element );
		this.dragElement.draggable({
			"axis": this.axis,
			"stop": this._dragStop,
			"containment": this.containment,
			"handle": this.handle,
			"drag": this._drag
		});
		if ( this.options.mode === "reveal" ) {
			this.element.css({
				"z-index": "0"
			});
		}
	},
	_overlaytop: function(){
		this.dragElement = this.element;
		this.containment[1] = -( this.options.size );
		this.cssProps.left = 0;
		this.cssProps.top = -( this.options.size );
		this.cssProps.width = "100%";
		this.cssProps.height = this.options.size + "px";
		this.handleProps.bottom = "-52px";
		this.handleProps.left = "50%";
		this.handleProps[ "margin-left" ] = "-26px";
		this.openPosition = 0;
		this.closePosition = -( this.options.size );
		this.axis = "y";
	},
	_overlayleft: function(){
		this.dragElement = this.element;
		this.containment[0] =  -( this.options.size );
		this.cssProps.left = -( this.options.size );
		this.cssProps.top = 0;
		this.handleProps.top = 50;
		this.handleProps.right = "-52px";
		this.openPosition = 0;
		this.closePosition = -( this.options.size );
	},
	_overlayright: function(){
		this.dragElement = this.element;
		this.containment[0] = this.windowWidth - this.options.size;
		this.containment[2] =  this.windowWidth;
		this.cssProps.left = this.windowWidth;
		this.handleProps.top = 50;
		this.handleProps.left = "-52px";
		this.cssProps.top = 0;
		this.openPosition = this.windowWidth - this.options.size;
		this.closePosition = this.windowWidth;
	},
	_revealleft: function() {
		this.dragElement = $( ".ui-page-active" );
		this.containment[2] = this.options.size;
		this.cssProps.left = 0;
		this.cssProps.top = 0;
		this.cssProps[ "z-index" ] = 0;
		this.handleProps.left = 0;
		this.handleProps.top = 50;
		this.openPosition = this.options.size;
		this.closePosition = 0;
	},
	_revealright: function() {
		this.dragElement = $( ".ui-page-active" );
		this.containment[0] = -(this.options.size);
		this.cssProps.right = 0;
		this.cssProps.top = 0;
		this.cssProps[ "z-index" ] = 0;
		this.handleProps.right = 0;
		this.handleProps.top = 50;
		this.openPosition = -(this.options.size);
		this.closePosition = 0;
	},
	_revealtop: function() {
		this.dragElement = $( ".ui-page-active" );
		this.containment[3] = this.options.size;
		this.cssProps.left = 0;
		this.cssProps.top = 0;
		this.cssProps.width = "100%";
		this.cssProps.height = this.options.size + "px";
		this.cssProps[ "z-index" ] = 0;
		this.handleProps.top = "-8px";
		this.handleProps.left = "50%";
		this.handleProps[ "margin-left" ] = "-26px";
		this.openPosition = this.options.size;
		this.closePosition = 0;
		this.axis = "y";
	},
	enhance: function(){
		this.element
			.addClass( "ui-simple-panel ui-panel-display-overlay ui-body-" + this.options.theme );
		if( this.options.scroll ) {
			this.element.css({
				"height": this.window.height(),
			}).addClass( "ui-simple-panel-scroll" );
		}
		if ( !this.options.handle ) {
			this.handle = $( "<div>" )
			.addClass("ui-btn ui-icon-bars ui-btn-icon-notext ui-simple-panel-handle");
		} else {
			this.handle = $( this.options.handle );
		}
	},
	_drag: function( event, ui ){
		var widget = $( this ).data( "simplepanelref" ).data("mobileSimplepanel"),
			offset = $( this ).offset().left,
			right = widget.options.position === "right",
			top = widget.options.position === "top",
			width = widget.windowWidth;
		if ( widget.options.responsive &&  widget.options.mode == "reveal" ) {
			$( this ).css({
				"width": top ? "" : ( right ? width + offset : width - offset ),
				"padding-left": right ? Math.abs( offset ) : ""
			});
		}
	},
	_setOptions: function( options ){
		return this._super( options );
	},
	_dragStop: function(){
		var widget = $( this ).data( "simplepanelref" ).data("mobileSimplepanel"),
			options = widget.options,
			direction = ( options.position === "left" || options.position === "right" ) ?
				"left" : "top",
			offset = $( this ).offset();

		if( offset[ direction ] !== widget.openPosition && offset[ direction ] !== widget.closePosition ) {
			if( ( ( options.position === "left" || options.position === "top" ) &&
				offset[ direction ] > ( widget.closePosition + ( options.size / 2 ) ) ) ||
				( ( options.position === "right" ) &&
				offset[ direction ] < ( widget.closePosition - ( options.size / 2 ) ) )
			){
				widget._animate( "open", 200 );
			} else {
				widget._animate( "close", 200 );
			}
		}
		if( options.position == "top" && options.mode == "reveal" ){
			$( "body" )[ 0 ].scrollTop = 0;
		}
	},
	_animate: function( direction, duration ){
		var position = ( this.options.position === "left" || this.options.position === "right" ) ?
				"left" : "top",
			props = {};

		duration = duration || 500;

		this._setDraggable();
		props[ position ] = this[ direction + "Position" ];
		this.dragElement.animate( props, duration );
		if( this.options.responsive && this.options.position !== "top" &&
		this.options.mode === "reveal" ) {
			this.dragElement.animate({
				width: this.windowWidth - ( ( direction === "open" ) ? this.options.size : 0 ),
				"padding-left": ( this.options.position == "right" && direction === "open" ) ?
					this.options.size + "px": ""
			},{
				queue: false,
				duration: duration
			});
		}
	},
	open: function( duration ){
		this._animate( "open" );
	},
	close: function( duration ){
		this._animate( "close" );
	}


});

})( jQuery );