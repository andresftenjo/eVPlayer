define([
  'jquery',
  'underscore',
  'backbone',
  'helpers/storage',
  'services/rest',
], function($, _, Backbone, s, restService){
  var loginService = {

    logIn: function(obj){
      return $.ajax(restService.getFrom('user/auth', 'POST', obj));
    },
    logOut: function(token){
      return $.ajax(restService.getFrom('user/logout' + '?sessionId=' +token));
    }

  };

  return loginService;
});
