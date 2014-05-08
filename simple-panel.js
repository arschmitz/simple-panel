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
		"handle": null,
		"enhanced": false,
		"position": "left",
		"theme": "a",
		"scroll": false,
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
		this.dragElement.draggable({
			"axis": this.axis,
			"stop": this._dragStop,
			"containment": this.containment,
			"handle": this.handle
		}).data( "simplepanelref", this.element );
		this.handle.css( this.handleProps ).appendTo( this.dragElement );
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
		this.handleProps.top = 0;
		this.handleProps.right = "-52px";
		this.openPosition = 0;
		this.closePosition = -( this.options.size );
	},
	_overlayright: function(){
		this.dragElement = this.element;
		this.containment[0] = this.windowWidth - this.options.size;
		this.containment[2] =  this.windowWidth;
		this.cssProps.left = this.windowWidth;
		this.handleProps.top = 0;
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
		this.handleProps.top = 0;
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
		this.handleProps.top = 0;
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
	_setOptions: function( options ){
		return this._super( options );
	},
	_dragStop: function(){
		var props = {},
			widget = $( this ).data( "simplepanelref" ).data("mobileSimplepanel"),
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
				$( this ).animate( props,200 );
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