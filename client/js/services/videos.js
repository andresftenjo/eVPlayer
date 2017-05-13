define([
  'jquery',
  'underscore',
  'backbone',
  'helpers/storage',
  'services/rest',
], function($, _, Backbone, s, restService){
  var videoService = {

    getVideos: function(token, skip, limit){
      return $.ajax(restService.getFrom('videos' + '?sessionId=' + token + '&skip=' + skip + '&limit=' + limit));
    }, 
    
    getVideo: function(token, videoId){
      return $.ajax(restService.getFrom('video' + '?sessionId=' + token + '&videoId=' + videoId));
    }
  };

  return videoService;
});
