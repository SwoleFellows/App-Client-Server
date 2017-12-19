'use strict';

var app = app || {};

(function (module) {
  const loginView = {};

  loginView.loginForm = function() {
    $('#login-button').click(function() {

      $('.register').hide();

      $('.login').show();
      console.log('why isnt this working')
    })
  };

  loginView.registerForm = function() {
    $('#register-button').click(function() {

      $('.login').hide();

      $('.register').show();
      console.log('please god work')
    })
  }

  module.loginView=loginView;
})(app)

app.loginView.loginForm();
app.loginView.registerForm();
