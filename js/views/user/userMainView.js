define([
    'jquery',
    'underscore',
    'backbone',
    'md5',
    'models/user',
    'models/follow',
    'models/tokenInfo',
    'models/unfollow',
    'views/user/userWatchlistView',
    'text!templates/user/userMainTemplate.html'
], function($, _, Backbone, md5, User, Follow,TokenInfo,Unfollow, UserWatchlistView, UserMainTemplate){
    var UserMainView = Backbone.View.extend({
        initialize: function(options){
            this.user = new User(options);
            this.following = new Follow();
            this.unfollowing = new Unfollow(options);
            this.tokenInfo = new TokenInfo();
        },
        template : _.template(UserMainTemplate),
        el: '.content',

        getGravatar: function(email, size) {
            var emailHash = $.md5(email);
            var gravatarUrl = "http://www.gravatar.com/avatar/"+emailHash+"?s="+size+"&d=http%3A%2F%2Fs21.postimg.org%2F68t2nogqv%2Flogo_Whitebg.jpg"
            return gravatarUrl;
        },

        render: function(){
            var that = this;
            this.user.fetch({
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', $.cookie('token'));
                },
                success: function(response){
                    var user = response.toJSON();
                    that.tokenInfo.fetch({
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization', $.cookie('token'));
                        },
                        success: function (response) {
                            var isFollowing = false;
                            var loggedUser = response.toJSON();
                            loggedUser.following.forEach(function(follower){
                                if(user.name == follower.name && user.email == follower.email){
                                    isFollowing = true;
                                }
                            });
                            if(loggedUser.id == user.id){
                                isFollowing = null;
                            }

                            that.$el.html(that.template({user: user, isFollowing : isFollowing}));

                            var avatar = that.getGravatar(user.email, 200);
                            $(".avatar-img").css("background", "url("+ avatar+") center center no-repeat");

                            user.following.forEach( function(follower){
                                var avatarFollower = that.getGravatar(follower.email, 100);
                                $("#follower"+follower._id).find(".avatar-img-follower").css("background", "url("+ avatarFollower+") no-repeat");
                            });


                            var view = new UserWatchlistView(user.id);
                            that.$el.append(view.render());
                        }
                    });

                }
            });
        },
        addFollower: function(){
            var that = this;
            var follow = {id :this.user.id };

            this.following.save(follow,{
                type: "POST",
                contentType: "application/json",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', $.cookie('token'));
                },
                success: function(response){
                    document.location.replace("index.html");
                }
            });
        },
        deleteFollower: function(){
            this.unfollowing.destroy({
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', $.cookie('token'));
                },
                success: function(response){
                    document.location.replace("index.html");
                }
            });
        }
    });

    return UserMainView;
});