'use strict';

var app = app || {};

(function (module) {
  const loginView = {};

  loginView.resetView = function() {
    $('.container').hide();
  }

  loginView.loginForm = function() {
    $('#login-button').click(function(){
      event.preventDefault();
      loginView.resetView();
      $('.login').show();
    })
  };


  module.loginView=loginView;
})(app)
