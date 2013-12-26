$(function() {

    APP.votePlugin({
        element: $('#questions'),
        voteComplete: function(data){
            APP.resultPlugin({
                answersResult: data.score,
		        resultsUrl: data.url,
                element: $('#results')
            })
        },
        questionsUrl : "questions.json",
        resultsUrl : "results.json"

    });


    APP.votePlugin({
        element: $('#questions_2'),
        voteComplete: function(data){
            alert(data.score);
        },
        questionsUrl : "questions.json",
        resultsUrl : "results.json"

    });

});