( function ( $, window, document, undefined ) {

    var pluginName = "results",
        defaults = {
            propertyName: "value"
        };
    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;
        this.resultsGrades; //grade

        this.init(options.answersResult);
    }

    /**
     * Init and draw summary
     */
    Plugin.prototype.init = function () {
        var that = this;
        $.getJSON(that.options.resultsUrl, function(data){
            that.resultsGrades = data;
            that.drawSummary(that.options.answersResult);
        });
    };
    /**
     * Draw summary
     */
    Plugin.prototype.drawSummary = function(totalPoints) {
        for (var i = 0; i < this.resultsGrades.length; i++) {
            if(this.resultsGrades[i].to >= totalPoints) {
                $('#results').append($('<p/>', {'html':"You have "+totalPoints+" points"}))
                    .append($('<div/>', {'html':'Your status: '+this.resultsGrades[i].status})
                );
                return;
            }
        }
    }


    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if ( !$.data(this, "plugin_" + pluginName )) {
                $.data( this, "plugin_" + pluginName,
                    new Plugin( this, options ));
            }
        });
    }

})( jQuery, window, document );