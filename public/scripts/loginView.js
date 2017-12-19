'use strict';

var app = app || {};

(function (module) {
  const loginView = {};

  loginView.loginForm = function() {
    $('#login-button').click(function() {
      $('.login').show();
      console.log('why isnt this working')
    })
  };

  loginView.registerForm = function() {
    $('#register-button').click(function() {
      $('.register').show();
      console.log('please god work')
    })
  }

  module.loginView=loginView;
})(app)
