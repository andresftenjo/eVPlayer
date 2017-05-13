define([
  'jquery',
  'underscore',
  'backbone',
  'helpers/storage',
  'services/rest',
], function($, _, Backbone, s, restService){
  var ratingService = {

    setRating: function(token, obj){
      return $.ajax(restService.getFrom('video/ratings' + '?sessionId=' + token, 'POST', obj));
    }
  };

  return ratingService;
});
