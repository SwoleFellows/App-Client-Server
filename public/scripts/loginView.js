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

  loginView.registerUser = function() {
    $('#register-form').on('submit', function(event){
      let user = {
        username: $('#register-username').val(),
        password: $('#register-password').val()
      };
    })
  }

  loginView.verifyUser = function() {
    $('#login-form').on('submit', function(event){
      username = $('#swolefellow-username').val()
      password = $('#swolefellow-password').val()
      if (user[username] && user[password]) {
        window.location = './search.html'
      }
      else {
        
      }
    })
  }

  module.loginView=loginView;
})(app)

app.loginView.loginForm();
app.loginView.registerForm();
