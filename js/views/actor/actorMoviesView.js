define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/actor/actorMoviesTemplate.html',
    'collections/movies',
    'models/youtube'
], function($, _, Backbone, actorMoviesTemplate, Movies, Youtube){

    var ActorMoviesView = Backbone.View.extend({
        template : _.template(actorMoviesTemplate),
        el: '.actor-movies',
        initialize: function(id){
            this.movies = new Movies({"actorId" : id});
        },

        render: function () {
            var that = this;
            this.movies.fetch({
                success: function(ret) {
                    that.movies = ret.toJSON();
                    var trailers = [];
                    that.movies.forEach(function(movie) {
                        var trailer = new Youtube({"movieTitle": movie.trackName});
                        trailer.fetch({
                            success: function(response){
                                movie.trailer = "http://www.youtube.com/v/" + response.toJSON().items[0].id.videoId;
                                that.$el.append(that.template({movie: movie}));
                            }
                        });
                    });
                }
            });
        }
    });
    return ActorMoviesView;
});