define(['jquery', 'event_bus'], function($, eventBus){

    var default_options =  {
        propertyName: 'value',
        voteComplete: null
    };

    return function(inputOptions){
        var questions = {};
        var result =  0;
	    var options = {};

        this.voteComplete = function(voteOptions)
        {
            require([voteOptions.callbackMethod], function(resultsPlugin) {
                if(typeof  resultsPlugin === "function")
                {
                    resultsPlugin(voteOptions.callbackOptions);
                }
            });

        };

        var init =  function( new_options) {
            options = $.extend({}, default_options, new_options);
            fetchData();
        };

        var fetchData = function() {
            $.getJSON(options.questionsUrl, function(data){
                questions = data;
                drawQuestion(0);
            });

        }

        var drawQuestion = function(questionNumber) {
            if(questionNumber < questions.length) {
                var currentQuestion = questions[questionNumber];
                var questionHeader = $('<div/>',{'class': 'questions'});
                questionHeader.append($('<p/>',{'html': parseInt(questionNumber)+1+' of '+ questions.length}));
                questionHeader.append($('<p/>',{'html':currentQuestion.question}));

                var answersList = $('<ul/>');
                for (var i = 0; i < currentQuestion.answers.length; i++){
                    var singleAnswer = drawSingleAnswerLi(currentQuestion, i, questionNumber);
                    eventBind(singleAnswer, options, drawQuestion);
                    answersList.append(singleAnswer);
                }
                $(options.element).append(questionHeader).append(answersList);
            }
            else
            {
                var callbackOpt = $.extend(
                    {},
                    {
                        answersResult: result
                    },
                    options.callbackOptions
                )
                eventBus.trigger('voteComplete',
                    {
                        callbackOptions: callbackOpt,
                        callbackMethod: options.callbackMethod
                    }
                );
            }
        };

        var drawSingleAnswerLi = function(currQuestion, i, questionNumber) {
            return $('<li/>',
                {'answer-point':currQuestion.points[i],
                    'html':currQuestion.answers[i],
                    'question-number': questionNumber
                }
            );
        };

        var eventBind = function (element, options, callback) {
            element.bind('click',function() {
                result += parseInt($(this).attr('answer-point'));
                $(options.element).empty();
                if(typeof callback === 'function') {
                    callback(parseInt($(this).attr('question-number'))+1);
                }
            });
        };

        init(inputOptions);
        return this;
    }
});
