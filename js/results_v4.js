define(['jquery','mustache'], function($, mustache){
    var default_options = {
        propertyName: 'value',
        resultsGrades: {}
    };
    return function(inputOptions){
        var options = {};
        var resultTemplate =
            '<p>You have {{totalPoints}} points.</p>'+
            '<div>Your status: {{status}}</div>';
        var init = function( new_options) {
            options = $.extend( {}, default_options, new_options );
            fetchData();
        };

        var fetchData = function()
        {
            $.getJSON(options.resultsUrl, function(data){
                options.resultsGrades = data;
                drawSummary(options.answersResult)
            });

        };
        var drawSummary = function(totalPoints) {
            for (var i = 0; i < options.resultsGrades.length; i++) {
                if(options.resultsGrades[i].to >= totalPoints) {
                    $(options.element).html(
                        mustache.to_html(resultTemplate, {
                            'totalPoints': totalPoints,
                            'status': options.resultsGrades[i].status
                        })
                    )
                    return;
                }
            }
        };
        init(inputOptions);
        return this;
    };
});