define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    var MoviesResult = Backbone.Collection.extend({
        initialize: function(options){
            this.searchField = options.searchField;
            this.isGeneral = options.isGeneral;
            if(options.isGeneral){
                this.url = 'https://umovie.herokuapp.com/unsecure/search/movies?q=' + options.searchField;
            }
            else{
                this.url = 'https://umovie.herokuapp.com/unsecure/search/movies?q=' + options.searchField + '&limit=40';

            }
        },
        parse: function(response) {
            return response.results;
        },
        addGenre: function(genre) {
            this.url += '&genre=' + genre;
        },
        removeGenre: function(genre){
            this.url = this.url.replace('&genre=' + genre, "")
        }
    });
    return MoviesResult;
});