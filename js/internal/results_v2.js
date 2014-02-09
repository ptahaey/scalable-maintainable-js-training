var resultObject = {
    options : {
        propertyName: 'value',
        resultsGrades: {}
    },
    init: function( options, element) {
        this.element = element;
        this.options = $.extend( {}, this.options, options );
        var that = this;
        $.getJSON(this.options.resultsUrl, function(data){
            that.resultsGrades = data;
            that.drawSummary(that.options.answersResult);
        });
    },
    drawSummary: function(totalPoints) {
        for (var i = 0; i < this.resultsGrades.length; i++) {
            if(this.resultsGrades[i].to >= totalPoints) {
                $('#results').append($('<p/>', {'html':"You have "+totalPoints+" points"}))
                    .append($('<div/>', {'html':'Your status: '+this.resultsGrades[i].status})
                    );
                return;
            }
        }
    }
}

if ( typeof Object.create !== 'function' ) {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

//create plugin using object vote
$.plugin = function( name, object ) {
    $.fn[name] = function( options ) {
        return this.each(function() {
            if ( ! $.data( this, name ) ) {
                $.data( this, name, Object.create(object).init(
                    options, this ) );
            }
        });
    };
};
$.plugin('resultPlugin', resultObject);