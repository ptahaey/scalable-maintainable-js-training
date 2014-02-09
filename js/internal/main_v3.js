$(function() {

    APP.votePlugin({
        element: $('#questions'),
        questionsUrl : "questions.json",
        callbackMethod: APP.resultPlugin,
        callbackOptions: {
            element: $('#results'),
            resultsUrl : "results.json"
        }
    });

    APP.votePlugin({
        element: $('#questions_2'),
        questionsUrl : "questions.json",
        callbackMethod: APP.resultPlugin,
        callbackOptions: {
            element: $('#results_2'),
            resultsUrl : "results.json"
        }
    });

    APP.EventBus.bind('voteComplete', APP.voteComplete, APP.votePlugin);
});