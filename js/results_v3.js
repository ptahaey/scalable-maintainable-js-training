var resultFunction = function(){
    var options = {
        propertyName: 'value',
        resultsGrades: {}
    };
    var element = {};
    return {
        init: function( new_options, new_element) {
            element = new_element;
            options = $.extend( {}, options, new_options );
            var that = this;
            $.getJSON(options.resultsUrl, function(data){
                options.resultsGrades = data;
                that.drawSummary(options.answersResult);
            });
        },

        drawSummary: function(totalPoints) {
            for (var i = 0; i < options.resultsGrades.length; i++) {
                if(options.resultsGrades[i].to >= totalPoints) {
                    $('#results').append($('<p/>', {'html':"You have "+totalPoints+" points"}))
                        .append($('<div/>', {'html':'Your status: '+options.resultsGrades[i].status})
                        );
                    return;
                }
            }
        }
    }
}();