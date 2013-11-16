(function ( $, window, document, undefined ) {

    var pluginName = "results",
        defaults = {
            propertyName: "value"
        };
    var that; // copy of this
    var resultsGrades; //grade

    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;
        that = this;
        this.init(options.answersResult);
    }

    /**
     * Init and draw summary
     */
    Plugin.prototype.init = function (answersResult) {
        $.getJSON('results.json',function(data){
            resultsGrades = data;
            that.drawSummary(answersResult);
        });
    };
    /**
     * Draw summary
     */
    Plugin.prototype.drawSummary = function(totalPoints) {
        var a = 1;
        for (var i = 0; i < resultsGrades.length; i++) {
            if(resultsGrades[i].to >= totalPoints) {
                $('#results').append($('<p/>', {'html':"You have "+totalPoints+" points"}))
                    .append($('<div/>', {'html':'Your status: '+resultsGrades[i].status})
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