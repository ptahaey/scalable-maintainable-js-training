require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ["/js/external/underscore/underscore", "/js/external/jquery/jquery"],
            exports: "Backbone"
        }
    }
});
require([
    '/js/external/jquery/jquery',
    '/js/internal/event_bus',
    '/js/internal/vote_v5',
    '/js/external/yepnope/yepnope',
    '/js/external/modernizr/modernizr',
    '/js/external/underscore/underscore',
    '/js/external/backbone/backbone'
], function ($, eventBus, votePlugin) {
    votePlugin({
        element: jQuery('#questions'),
        questionsUrl : "questions.json",
        callbackMethod: '/js/internal/results_v5',
        callbackOptions: {
            element: jQuery('#results'),
            resultsUrl : "results.json"
        }
    });

    eventBus.bind('voteComplete', voteComplete, votePlugin);
    yepnope({
        test : Modernizr.json,
        nope  : '/js/external/polyfill/dist/polyfill.js'
    });
});