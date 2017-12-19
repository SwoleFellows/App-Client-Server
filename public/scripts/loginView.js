'use strict';

var app = app || {};

(function (module) {
  const loginView = {};

  let __API_URL__ = "http://localhost:3000"

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
      event.preventDefault();
      let user = {
        username: $('#register-username').val(),
        password: $('#register-password').val()
      };
      console.log(user);
      $.post(`${__API_URL__}/api/v1/users`, user)
      .then($.get('/search'))
      .catch(console.error);
    })
  }

  loginView.verifyUser = function() {
    $('#login-form').on('submit', function(event){
      event.preventDefault();
      let username = $('#swolefellow-username').val()
      let password = $('#swolefellow-password').val()
      $.get(`${__API_URL__}/api/v1/users/${username}`)
      .then(res => {
        if (res.password === password) {
        localStorage.username = username;
        localStorage.user_id = res.user_id;
        window.location = './search.html'
        } else {
        console.log('wrong password');
      }
    })
    })
  }

  module.loginView=loginView;
})(app)

app.loginView.loginForm();
app.loginView.registerForm();
app.loginView.registerUser();
