(function ( $, window, document, undefined ) {
 
    var pluginName = "vote",
        defaults = {
            propertyName: "value"
        };
    var questions = {}; //question array
    var result = 0; //total sum of points
    var that; // copy of this
    function Plugin( element, options ) {
        this.element = element;
        
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
        that = this;
        this.init();
    }

    /**
     * Init and draw first question
     */
    Plugin.prototype.init = function () {
        $.getJSON('questions.json',function(data){
            questions = data;
            that.drawQuestion(0);
	    });
    };
    /**
     * Draw single question
     * @param questionNumber
     */
    Plugin.prototype.drawQuestion = function(questionNumber) {
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
                singleAnswer.bind('click',Plugin.prototype.clickAnswer);
                answersList.append(singleAnswer);
            }
            $('#questions').append(questionHeader).append(answersList);
        }
        else
        {
            $('html').results({'answersResult':result});
        }
    }

    /**
     * bind click event
     */
    Plugin.prototype.clickAnswer = function() {
        result += parseInt($(this).attr('answer-point'));
        $('#questions').empty();
        that.drawQuestion(parseInt($(this).attr('question-number'))+1);
    }

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if ( !$.data(this, "plugin_" + pluginName )) {
                $.data( this, "plugin_" + pluginName, 
                new Plugin( this, options ));
            }
        });
    }
 
})( jQuery, window, document );