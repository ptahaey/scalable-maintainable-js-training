var APP = APP || {};
APP.resultPlugin = (function(APP, $, undefined){
    var default_options = {
        propertyName: 'value',
        resultsGrades: {}
    };
    return function(inputOptions){
	var options = {};

        var init = function( new_options) {
            options = $.extend( {}, default_options, new_options );
            $.getJSON(options.resultsUrl, function(data){
                options.resultsGrades = data;
                drawSummary(options.answersResult);
            });
        };

        var drawSummary = function(totalPoints) {
            for (var i = 0; i < options.resultsGrades.length; i++) {
                if(options.resultsGrades[i].to >= totalPoints) {
                    $(options.element).append($('<p/>', {'html':"You have "+totalPoints+" points"}))
                        .append($('<div/>', {'html':'Your status: '+options.resultsGrades[i].status})
                     );
                    return;
                }
            }
        };
        init(inputOptions);
        return this;
    };
}(APP, jQuery));