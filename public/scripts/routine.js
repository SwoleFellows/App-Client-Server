'use strict';

var app = app || {};

$('#nav-routine').hide();

(function (module) {

  let __API_URL__ = 'http://localhost:3000';

  const exercise = function (rdo) { //rdo: rawDataObj
    Object.keys(rdo).forEach(key => this[key] = rdo[key]);
  };

  Exercise.all = [];

  function Exercise (routine) {
    this.routine_id = routine.routine_id;
  };

  Exercise.routinePage.toHtml = function (ctx) {
    let exercise Template = Handlebars.compile($('???????????').text());
    $('#saved_workouts').append(exerciseTemplate(ctx));
  };

  Exercise.loadAll = function (rows) {
    Exercise.all = rows.map(function(routine) {
      return new Exercise(routine);
    })
  };

  Exercise.fetchAll = (callback) => {
    $.get(`${__API_URL__}/api/v1/save`)
    .then(data => Exercise.loadAll(data))
    .then(callback)
    .catch(console.error);
  }

  Exercise.fetchOne = (ctx, callback) => {
    $.get(`${__API_URL__}/api/v1/save/${ctx.params.routine_id}`)
    .then(results => ctx.routine = results[0])
    .then(callback)
    .catch(console.error);
  }

  Book.truncateExercise = callback => {
    $.ajax({
      url: `${__API_URL__}/api/v1/save/${this.routine_id}`,
      method: 'DELETE',
    })
      .then(console.log)
      .then(callback);
  };


  module.exercise = Exercise;

})(app)
