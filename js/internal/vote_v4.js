define([
    '/js/external/jquery/jquery',
    '/js/internal/event_bus',
    '/js/external/mustache/mustache'
], function($, eventBus, mustache){

    var default_options =  {
        propertyName: 'value',
        voteComplete: null
    };

    return function(inputOptions){
        var questions = {};
        var result =  0;
	    var options = {};
        var html = "";
        var questionHeaderTemplate =
            '<div class="questions">' +
                '<p>{{questionNumber}} of {{questionsTotal}}</p>'+
                '<p>{{currentQuestion}}</p>'
            '</div>';
        var singleAnswerTemplate =
            '<li answer-point="{{point}}" question-number="{{questionNumber}}">{{answerBody}}</li>';

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
            options = jQuery.extend({}, default_options, new_options);
            fetchData();
        };

        var fetchData = function() {
            jQuery.getJSON(options.questionsUrl, function(data){
                questions = data;
                drawQuestion(0);
            });

        }

        var drawQuestion = function(questionNumber) {
            if(questionNumber < questions.length) {
                var currentQuestion = questions[questionNumber];
                html = mustache.to_html(questionHeaderTemplate, {
                    questionNumber: parseInt(questionNumber)+1,
                    questionsTotal: questions.length,
                    currentQuestion: currentQuestion.question
                });

                var answersList = "<ul>";
                for (var i = 0; i < currentQuestion.answers.length; i++){
                    answersList += drawSingleAnswerLi(currentQuestion, i, questionNumber);
                }
                answersList += "</ul>";
                html += answersList;
                jQuery(options.element).html(html);

                eventBind(options, drawQuestion);
            }
            else
            {
                var callbackOpt = jQuery.extend(
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
            return mustache.to_html(singleAnswerTemplate,{
                point: currQuestion.points[i],
                questionNumber: questionNumber,
                answerBody: currQuestion.answers[i]
            })
        };

        var eventBind = function (options, callback) {
            jQuery(options.element).find('li').each(function(){
                jQuery(this).bind('click',function() {
                    result += parseInt(jQuery(this).attr('answer-point'));
                    jQuery(options.element).empty();
                    if(typeof callback === 'function') {
                        callback(parseInt(jQuery(this).attr('question-number'))+1);
                    }
                });
            });
        };

        init(inputOptions);
        return this;
    }
});
