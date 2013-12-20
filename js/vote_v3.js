function voteFunction(){
    var default_options =  {
        propertyName: 'value',
        voteComplete: null
    };
    var questions = {};
    var result =  0;
    return {
	options : {},

        init: function( new_options) {

            this.options = $.extend({}, default_options, new_options);

            var that = this;

            $.getJSON(this.options.questionsUrl, function(data){
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
                        $(that.options.element).empty();
                        that.drawQuestion(parseInt($(this).attr('question-number'))+1);
                    });
                    answersList.append(singleAnswer);
                }
                $(that.options.element).append(questionHeader).append(answersList);
            }
            else
            {
                if(typeof this.options.voteComplete === "function"){
                    this.options.voteComplete({score: result, url: this.options.resultsUrl})
                }
            }
        }
    }
};
