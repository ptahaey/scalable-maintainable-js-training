define([
    '/js/external/jquery/jquery',
    '/js/external/mustache/mustache'
], function($, mustache){
    var default_options = {
        propertyName: 'value',
        resultsGrades: {}
    };
    return function(inputOptions){
        var options = {};
        var result = {};
        var resultModel = Backbone.Model.extend({
            defaults: {
                to: 0,
                status: 'status text'
            },
            initialize: function (attributes, options){
                this.set(attributes);
            },

            parse: function (response, options){
                return response;
            }
        });

        var resultCollection = Backbone.Collection.extend({
            model: resultModel
        });

        var resultView = Backbone.View.extend({
            resultTemplate: '<p>You have {{totalPoints}} points.</p>'+
                '<div>Your status: {{status}}</div>',

            initialize: function() {
                this.collection = new resultCollection();
                this.collection.url = options.resultsUrl;
                var that = this;
                this.collection.fetch().complete(function(){
                    that.render(options.answersResult);
                });
            },

            render: function(totalPoints) {
                for (var i = 0; i < this.collection.length; i++) {
                    if(this.collection.at(i).get('to') >= totalPoints) {
                        jQuery(options.element).html(
                            this.renderStatus(totalPoints, i)
                        )
                        return;
                    }
                }
            },

            renderStatus: function(totalPoints, i){
                return mustache.to_html(this.resultTemplate, {
                    totalPoints: totalPoints,
                    status: this.collection.at(i).get('status')
                });
            }
        });


        var init = function( new_options) {
            options = jQuery.extend( {}, default_options, new_options );
            result = new resultView();
        };

        init(inputOptions);
        return this;
    };
});