define([
  'jquery',
  'underscore',
  'backbone',
  'helpers/storage',
  'services/videos',
  'services/rating',
  'text!/templates/videoDetail.html'
], function($, _, Backbone, s, videoService, ratingService,videoDetailTemplate){
  var videoDetailView = Backbone.View.extend({
    el: $(".main"),
    
    initialize : function (vidId) {
    
      this.token = s.get('auth',true).sessionId;
      
      this.videoRequest(this.token, vidId);
    },
    
    videoRequest: function (token, vidId){
      
      var self = this;
      
      videoService.getVideo(token, vidId).done(function (video) {
        if(video.status === "error") {
          $(".error-messages").html(video.error);
        } else if(video.status === "success") {
          self.render(video.data);
        }
      }).fail(function (err) {
          console.log(err);
      }).always(function(){
        $('.container-fixed span.glyphicon').remove();
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
    
    render: function(video){
      
      var self = this;
      var compiledTemplate = _.template(videoDetailTemplate);
      
      var landingVideos = s.get("videos", true);
      landingVideos = landingVideos.length > 0 ? _.filter(landingVideos, function(vid){ return vid._id !== video._id; }).slice(0, 2) : null;
       
      var totalRatings = 0;  
      _.each(video.ratings, function(rating) { 
        totalRatings += rating;
      });
      video.totalRatings = (totalRatings / video.ratings.length).toFixed(0);
      
      this.$el.html(compiledTemplate({"video": video, "landingVids" : landingVideos }));
      
      $('.input-rating').on('change', function(){
          self.doRating($(this).data("vidid"), $(this).val());
      });
      
      this.pauseOtherVideos();
    }
  });
  return videoDetailView;
});
