require.config({
  paths: {
    jquery: 'lib/jquery.min',
    underscore: 'lib/underscore-min',
    backbone: 'lib/backbone-min',
    bootstrap: 'bootstrap-min'
  },
  shim: {
    'backbone': {
        deps: ['jquery','underscore'],
        exports: 'Backbone'
    },
    'bootstrap': 'bootstrap-min'
  }  

});

require([
  'app',
], function(App){
  App.initialize();
});