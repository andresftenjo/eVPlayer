define([
  'jquery',
  'underscore',
  'backbone',
  'helpers/storage',
  'views/login',
  'views/videos',
  'views/videoDetail',
  'services/login',
  'services/videos',
  'services/rating'
], function($, _, Backbone, s, LoginView, VideosView, VideoDetailView, loginService, videoService, ratingService){
  var AppRouter = Backbone.Router.extend({
    routes: {
        "": "goHome",
        "test": "goTest",
        "signout": "goOut",
        'video/:vidId': 'goVideoDetail'
    },

    validSession: function(){

      var authObj = s.get("auth", true);
      if(!authObj){
        var loginView = new LoginView();
        loginView.render();
        $(".navitem-signing").html("<a href='#'>Sign In</a>");
        $(".navitem-welcome span").text("");
        return false;
      } else {
        $(".navitem-signing").html("<a href='#signout'>Sign Out</a>");
        $(".navitem-welcome span").text("Hi " + authObj.username + " !");
        return true;
      }
    },

    goOut : function(){

      var loginView = new LoginView();
      
      if(loginView.doLogout()){
        console.log("going out");
        //var videosView = new VideosView();
        
      }
    },
    
    goHome : function(){

      var loginView = new LoginView();
      
      if(loginView.validSession()){
        var videosView = new VideosView();
      }
    },

    goTest : function(){
      
      var self = this;
      // We have no matching route, lets just log what the URL was
      console.log('in testing');
      
      var loginView = new LoginView();
      var hashedPass = loginView.doPassMD5("password");
      
      loginService.logIn({ username : "ali" , password : hashedPass }).done(function (token) {
          s.set('auth',JSON.stringify(token));
          checkLogin(token);
      });
        
      function checkLogOut(token) {
        
        loginService.logOut(token).done(function (token) {
            localStorage.removeItem("auth");
            describe("LogOut Service", function() {
          		it("Logout should be successful", function() {
          		  expect(token.status).to.be("success");
          		});
          		it("Auth storage value sould be removed", function() {
          		  expect(localStorage.auth).to.be(undefined);
          		});
          	});
          }).always(function() {
            self.finishTesting();
          });;
      }
      
      function checkRatings(token, vId){
        
        ratingService.setRating(token, { videoId : vId , rating : 1 }).done(function (video) {
            describe("Ratings Services", function() {
            	it("Rating sould be successful", function() {
            		expect(video.status).to.be("success");
            	});
            	it("Last rating added sould be 1", function() {
            		expect(video.data.ratings.slice(-1).pop()).to.be(1);
            	});
            });
            checkLogOut(token);
          });
      }
      
      function checkVideos(token){
        
        videoService.getVideos(token, 10, 0).done(function (videos) {
          describe("Getting Videos", function() {
        		it("Videos default length should be 10", function() {
        		  expect(videos.data.length).to.be(10);
        		});
        	});
        	
        	checkRatings(token, videos.data[0]._id);
        	
        });  
      }
      
      
       function checkLogin(token){
          describe("Login Services", function() {
      		  it("Session should be successful", function() {
      		    expect(token.status).to.be("success");
      		  });
      		});
        	checkVideos(token.sessionId);
        }
    },
    
    finishTesting : function (){
      mocha.checkLeaks();
      mocha.run();
    },
    
    goVideoDetail : function(vidId){

      var loginView = new LoginView();
      
      if(loginView.validSession()){
        var videoDetailView = new VideoDetailView(vidId);
      }
    },

  });

  var initialize = function(){
    var app_router = new AppRouter;

    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});
