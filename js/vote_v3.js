var APP = APP || {};

APP.votePlugin = (function (APP, $, undefined ){

    var default_options =  {
        propertyName: 'value',
        voteComplete: null
    };
    var questions = {};
    var result =  0;
    return function(inputOptions){
	    var options = {};

        var init =  function( new_options) {

            options = $.extend({}, default_options, new_options);

            $.getJSON(options.questionsUrl, function(data){
                questions = data;
                drawQuestion(0);
            });

        };
        var drawQuestion = function(questionNumber) {
            if(questionNumber < questions.length) {
                var currentQuestion = questions[questionNumber];
                var questionHeader = $('<div/>',{'class': 'questions'});
                questionHeader.append($('<p/>',{'html': parseInt(questionNumber)+1+' of '+ questions.length}));
                questionHeader.append($('<p/>',{'html':currentQuestion.question}));

                var answersList = $('<ul/>');
                for (var i = 0; i < currentQuestion.answers.length; i++){
                    var singleAnswer = $('<li/>',
                        {'answer-point':currentQuestion.points[i],
                            'html':currentQuestion.answers[i],
                            'question-number': questionNumber
                        }
                    );
                    singleAnswer.bind('click',function() {
                        result += parseInt($(this).attr('answer-point'));
                        $(options.element).empty();
                        drawQuestion(parseInt($(this).attr('question-number'))+1);
                    });
                    answersList.append(singleAnswer);
                }
                $(options.element).append(questionHeader).append(answersList);
            }
            else
            {
                if(typeof options.voteComplete === "function"){
                    options.voteComplete({score: result, url: options.resultsUrl})
                }
            }
        };
        init(inputOptions);
        return this;
    }
}(APP, jQuery));
