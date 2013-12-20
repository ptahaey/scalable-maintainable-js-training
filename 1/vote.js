(function ( $, window, document, undefined ) {
 
    var pluginName = "vote",
        defaults = {
            propertyName: "value"
        };
 
    function Plugin( element, options ) {
        this.element = element;
        
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
        
        this.init();
    }
 
    Plugin.prototype.init = function () {
        $.getJSON('questions.json',function(data){
		
		$.each(data,function(k,v){
			var item = $("<div/>",{'class':'question_'+k});
			item.append(v.question);	
			$('#questions').append(
				item
			)
		});
	});
    };
 
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if ( !$.data(this, "plugin_" + pluginName )) {
                $.data( this, "plugin_" + pluginName, 
                new Plugin( this, options ));
            }
        });
    }
 
})( jQuery, window, document );