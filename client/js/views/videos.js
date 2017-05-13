define([
  'jquery',
  'underscore',
  'backbone',
  'helpers/storage',
  'services/videos',
  'services/rating',
  'text!/templates/videosList.html'
], function($, _, Backbone, s, videoService, ratingService,videosTemplate){
  var videosView = Backbone.View.extend({
    el: $(".main"),
    
    initialize : function () {
    
      this.token = s.get('auth',true).sessionId;
      this.limit = 0;
      this.skip = 10;
      
      var self = this;
      
      String.prototype.trunc = String.prototype.trunc ||
        function(n){
          return (this.length > n) ? this.substr(0,n-1)+'&hellip;' : this;
      };
      
      //lazy loading 
      $(window).scroll(function(){
          if  ($(window).scrollTop() == $(document).height() - $(window).height()){
             if($('.container-fixed .video-element').length >= 10){
                self.skip = self.skip + 10;
                self.lazyRequest = true;
                self.videosRequest(self.token, self.skip, self.limit);
             }
          }
      });
        
      this.videosRequest(self.token, self.skip, self.limit);
    },
    
    videosRequest: function (token, skip, limit){
      
      var self = this;
      
      $('.container-fixed').append('<span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>');
      
      videoService.getVideos(token, skip, limit).done(function (videos) {
        if(videos.status === "error") {
          $(".error-messages").html(videos.error);
        } else if(videos.status === "success") {
          self.render(videos.data);
        }
      }).fail(function (err) {
          console.log(err);
      }).always(function(){
        $('.container-fixed span.glyphicon').remove();
      });
    },
    
    pauseOtherVideos: function() {
      
      var allvideos = document.getElementsByTagName("video");
      
      _.each(allvideos, function(video) { 
        video.onplay = function(video) {
          _.each(allvideos, function(video_) { 
            //pause all other videos 
            if(video.target.id !== video_.id){
              video_.pause();
            } 
          });      
        }; 
      });
    },
    
    doRating: function(vId, ratingN){
    
      var self = this;
      
      if(vId && ratingN){
        ratingService.setRating(self.token, { videoId : vId , rating : parseInt(ratingN) }).done(function (data) {
            if(data.status === "error") {
              $(".error-messages").html(data.error);
            } else if(data.status === "success") {
              $(".error-messages").html("");
            }
            
          }).fail(function (err) {

              console.log(err);
          });    
      }
    },
    
    render: function(videos){
      
      var self = this;
      var compiledTemplate = _.template(videosTemplate);
      
      _.each(videos, function(video) { 
        var totalRatings = 0;  
        _.each(video.ratings, function(rating) { 
          totalRatings += rating;
        });
        video.totalRatings = (totalRatings / video.ratings.length).toFixed(0);
      });
      
      s.set("videos", JSON.stringify(videos));
      
      if(self.lazyRequest){
        this.$el.append( compiledTemplate({"videos": videos }) );  
      } else {
        this.$el.html( compiledTemplate({"videos": videos }) );  
      }
      
      this.pauseOtherVideos();
      
      $('.input-rating').on('change', function(){
          self.doRating($(this).data("vidid"), $(this).val());
      });
      
    }
  });
  return videosView;
});
