function resultFunction(){
    var default_options = {
        propertyName: 'value',
        resultsGrades: {}
    };
    var element = {};
    return {
	options : {},

        init: function( new_options) {
            this.options = $.extend( {}, default_options, new_options );
            var that = this;
            $.getJSON(this.options.resultsUrl, function(data){
                that.options.resultsGrades = data;
                that.drawSummary(that.options.answersResult);
            });
        },

        drawSummary: function(totalPoints) {
            for (var i = 0; i < this.options.resultsGrades.length; i++) {
                if(this.options.resultsGrades[i].to >= totalPoints) {
                    $(this.options.element).append($('<p/>', {'html':"You have "+totalPoints+" points"}))
                        .append($('<div/>', {'html':'Your status: '+this.options.resultsGrades[i].status})
                        );
                    return;
                }
            }
        }
    }
};