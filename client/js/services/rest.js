define([
  'jquery',
  'underscore',
  'backbone',
  'helpers/storage',
], function($, _, Backbone, s){
  var restService = {
    
    getFrom: function (uri, reqType, jsonData) {
      return this.getFromBase(uri, reqType, jsonData, 'application/json');
    },
    getFromBase: function (uri, reqType, data, contentType) {
      return {
        type: reqType || 'GET',
        url: s.beUrl + uri,
        xhrFields: { withCredentials: true },
        headers: { "Content-Type": contentType, Authorization: "Bearer " + s.get('auth', false) },
        data: JSON.stringify(data)
      };
    },
    
    getById: function (uri, id) {
      var promise = $.ajax(this.getFrom(uri + id));

      return {
        done: function (callback, context) {
          promise.done(function (data, result) {
            callback.call(context, data);
          });

          return promise;
        },
        fail: function (jqXHR, textStatus, errorThrown) {
          promise.fail(function (jqXHR, textStatus, errorThrown) {
                //callback.call(context, data);
                console.log("Error getting by request Id : " + textStatus + errorThrown);
          });
          return promise;
        }
      };
    },

    getAll: function (uri) {
      var promise = $.ajax(this.getFrom(uri));

      return {
        done: function (callback, context) {
          promise.done(function (data, result) {
            callback.call(context, data);
          });

          return promise;
        },
        fail: function (callback, context) {
          promise.fail(function (jqXHR, textStatus, errorThrown) {
            //callback.call(context, data);
            console.log("Error getting all items : " + textStatus + errorThrown);
          });
          return promise;
        }
      };
    },
    
    saveCustom: function (url, obj) {

      var promise = $.ajax(this.getFromBase(
        url,
        obj.type ? obj.type : 'POST',
        obj.params,
        'application/x-www-form-urlencoded; charset=UTF-8'
      ));

      promise.fail(function (jqXHR, textStatus, errorThrown) {
          console.log("Error saving data : " + textStatus + errorThrown);
      });

      return promise;
    },
    
    delete: function (uri, id) {
      var promise = $.ajax(this.getFrom(uri + id, 'DELETE'));

      promise.fail(function (jqXHR, textStatus, errorThrown) {
          console.log("Error deleting data : " + textStatus + errorThrown);
      });

      return promise;
    }
    
  };

  return restService;
});