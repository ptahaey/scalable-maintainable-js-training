requirejs(['jquery', 'event_bus', 'vote_v4'], function ($, eventBus, votePlugin) {
    votePlugin({
        element: $('#questions'),
        questionsUrl : "questions.json",
        callbackMethod: 'results_v4',
        callbackOptions: {
            element: $('#results'),
            resultsUrl : "results.json"
        }
    });
    eventBus.bind('voteComplete', voteComplete, votePlugin);
});