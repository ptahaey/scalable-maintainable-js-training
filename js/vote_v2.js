var voteObject = {
    options : {
        propertyName: 'value',
        voteComplete: null
    },
    questions : {},
    result: 0,
    init: function( options, element) {
        this.element = element;
        this.options = $.extend( {}, this.options, options );
        var that = this;
        $.getJSON(this.options.questionsUrl, function(data){
            that.questions = data;
            that.drawQuestion(0);
        });
    },
    drawQuestion: function(questionNumber) {
        var that = this;
        if(questionNumber < this.questions.length) {
            var currentQuestion = this.questions[questionNumber];
            var questionHeader = $('<div/>',{'class': 'questions'});
            questionHeader.append($('<p/>',{'html': parseInt(questionNumber)+1+' of '+ this.questions.length}));
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
                    that.result += parseInt($(this).attr('answer-point'));
                    $(that.element).empty();
                    that.drawQuestion(parseInt($(this).attr('question-number'))+1);
                });
                answersList.append(singleAnswer);
            }
            $(this.element).append(questionHeader).append(answersList);
        }
        else
        {
            if(typeof this.options.voteComplete === "function"){
                this.options.voteComplete({score: this.result, url: this.options.resultsUrl})
            }
        }
    }
}

if ( typeof Object.create !== 'function' ) {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

//create plugin using object vote
$.plugin = function( name, object ) {
    $.fn[name] = function( options ) {
        return this.each(function() {
            if ( ! $.data( this, name ) ) {
                $.data( this, name, Object.create(object).init(
                    options, this ) );
            }
        });
    };
};
$.plugin('votePlugin', voteObject);