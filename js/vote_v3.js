var voteFunction = function(){
    var options =  {
        propertyName: 'value',
        voteComplete: null
    };
    var element = {};
    var questions = {};
    var result =  0;
    return {
        init: function( new_options, new_element) {

            element = new_element;
            options = $.extend( {}, options, new_options);
            var that = this;
            $.getJSON(options.questionsUrl, function(data){
                questions = data;
                that.drawQuestion(0);
            });
        },
        drawQuestion: function(questionNumber) {
            var that = this;
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
                        $(element).empty();
                        that.drawQuestion(parseInt($(this).attr('question-number'))+1);
                    });
                    answersList.append(singleAnswer);
                }
                $(element).append(questionHeader).append(answersList);
            }
            else
            {
                if(typeof options.voteComplete === "function"){
                    options.voteComplete({score: result, url: options.resultsUrl})
                }
            }
        }
    }
}();
