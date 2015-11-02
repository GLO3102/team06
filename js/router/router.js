var app = app || {};

$(function(){

    var Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'tvshow/:id': 'homeTVShow',
            'actor/:id': 'homeActor'
        },

        setup: function () {
            app.menuView.render();
        },

        home: function(){
            this.setup();
            app.homeView.render();
        },

        homeTVShow: function(id){
            this.setup();
            app.tvShowMainView.render(id);
        },

        homeActor: function(id) {
            this.setup();
            app.actorMainView.render(id);
        }

    });

    app.router = new Router();
    Backbone.history.start();
});