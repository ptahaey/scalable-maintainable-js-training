requirejs(['jquery', 'event_bus', 'vote_v4', 'yepnope', 'modernizr'], function ($, eventBus, votePlugin) {
    votePlugin({
        element: $('#questions'),
        questionsUrl : "questions.json",
        callbackMethod: 'results_v4',
        callbackOptions: {
            element: $('#results'),
            resultsUrl : "results.json"
        }
    });

//    votePlugin({
//        element: $('#questions_2'),
//        questionsUrl : "questions.json",
//        callbackMethod: 'results_v4',
//        callbackOptions: {
//            element: $('#results_2'),
//            resultsUrl : "results.json"
//        }
//    });
    eventBus.bind('voteComplete', voteComplete, votePlugin);
    yepnope({
        test : Modernizr.json,
        nope  : 'js/polyfill.js'
    });
});