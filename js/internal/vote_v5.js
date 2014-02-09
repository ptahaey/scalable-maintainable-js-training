define([
    '/js/internal/event_bus',
    '/js/external/jquery/jquery',
    '/js/external/mustache/mustache'
], function(eventBus, $, mustache){

    var default_options =  {
        propertyName: 'value',
        voteComplete: null
    };

    return function(inputOptions){
        var result =  0;
	    var options = {};
        var listView = {};

        /**
         * Question Model
         * @type Backbone.Model
         */
        var questionModel = Backbone.Model.extend({
            defaults: {
                question: 'Question body',
                answers: [],
                points: []
            },
            initialize: function (attributes, options){
                this.set(attributes);
            },

            parse: function (response, options){
                return response;
            }
        });

        /**
         * Question Collection
         * @type Backbone.Collection
         */
        var questionCollection = Backbone.Collection.extend({
            model: questionModel
        });

        /**
         * Question View
         * @type Backbone.VIew
         */
        var questionListView = Backbone.View.extend({
            singleAnswerTemplate :
                '<li answer-point="{{point}}" question-number="{{questionNumber}}">{{answerBody}}</li>',

            questionHeaderTemplate :
                '<div class="questions">' +
                    '<p>{{questionNumber}} of {{questionsTotal}}</p>'+
                    '<p>{{currentQuestion}}</p>'+
                '</div>',

            initialize: function() {
                this.collection = new questionCollection();
                this.collection.url = options.questionsUrl;
                var that = this;
                this.collection.fetch().complete(function(){
                    that.render(0);
                });
            },

            render: function(questionNumber) {
                if(parseInt(questionNumber) < this.collection.length) {
                    var currentQuestion = this.collection.at(questionNumber);
                    var html = this.renderHeader(
                        questionNumber, this.collection.length, currentQuestion.get('question')
                    );

                    var answersList = "<ul>";
                    for (var i = 0; i < currentQuestion.get('answers').length; i++){
                        answersList += this.renderSingleAnswerLi(currentQuestion, i, questionNumber);
                    }
                    answersList += "</ul>";
                    html += answersList;
                    jQuery(options.element).html(html);

                    this.eventBind(options);
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
            },

            renderHeader: function(questionNumber, total, question) {
                return mustache.to_html(this.questionHeaderTemplate, {
                    questionNumber: parseInt(questionNumber)+1,
                    questionsTotal: total,
                    currentQuestion: question
                });
            },

            renderSingleAnswerLi :function(currQuestion, i, questionNumber) {
                return mustache.to_html(this.singleAnswerTemplate,{
                    point: currQuestion.get('points')[i],
                    questionNumber: questionNumber,
                    answerBody: currQuestion.get('answers')[i]
                })
            },

            eventBind: function (options) {
                var that = this;
                jQuery(options.element).find('li').each(function(){
                    jQuery(this).bind('click',function() {
                        result += parseInt(jQuery(this).attr('answer-point'));
                        jQuery(options.element).empty();
                        that.render(parseInt(jQuery(this).attr('question-number'))+1);
                    });
                });
            }

        });


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
            listView = new questionListView(options);
        };

        init(inputOptions);
        return this;
    }
});
