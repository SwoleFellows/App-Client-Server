'use strict';

var app = app || {};

(function (module) {
  const loginView = {};

  let __API_URL__ = "http://localhost:3000"

  loginView.loginForm = function() {
    $('#login-button').click(function() {
      $('.register').hide();
      $('.login').show();
    })
  };

  loginView.registerForm = function() {
    $('#register-button').click(function() {
      $('.login').hide();
      $('.register').show();
    })
  }

  loginView.registerUser = function() {
    $('.register_success').hide();
    $('#register-form').on('submit', function(event){
      event.preventDefault();
      let user = {
        username: $('#register-username').val(),
        password: $('#register-password').val()
      };
      console.log('user:', user);
      $.post(`${__API_URL__}/api/v1/users`, user)
      .then($('#register-form')[0].reset())
      .then($('.register_success').show())
      .then($('.register').fadeOut(2000))
      .then($('.login').fadeIn(3000))
      .catch(console.error);
    })
  }

  loginView.grabInfo = function() {
    $('#login-form').on('submit', function(event){
      console.log('verify is clicked')
      event.preventDefault();
      let username = $('#swolefellow-username').val()
      console.log('username:', username)
      let password = $('#swolefellow-password').val()
      console.log('password:', password)
      console.log(event)
      loginView.verifyUser(username, password);
    })
  }

  loginView.verifyUser = function(username, password) {
    $.get(`${__API_URL__}/api/v1/users/login/${username}`)
    .then(res => {
      console.log(res)
      console.log('res password', res[0].password)
      if (res[0].password === password) {
      localStorage.username = username;
      console.log('local storage username', localStorage.username)
      localStorage.user_id = res[0].user_id;
      console.log('local storage user id', localStorage.user_id)
      // $.get(`${__API_URL__}/api/v1/users/select`)
      window.location = '/search'
      } else {
      console.log('wrong password');
      }
    })
  }

  module.loginView=loginView;
})(app)

app.loginView.loginForm();
app.loginView.registerForm();
app.loginView.registerUser();
app.loginView.grabInfo();
