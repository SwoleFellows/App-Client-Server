'use strict';

var app = app || {};

$('#nav-routine').hide();

(function (module) {
  // let __API_URL__ = 'http://localhost:3000'
  let __API_URL__ = "https://swolefellows.herokuapp.com"

  const Exercise = function (rdo) {//rdo: rawDataObj
    Object.keys(rdo).forEach(key => {
      if (key !== 'routine_id' && key !== 'user_id') this[key] = rdo[key]
    });
  };

  Exercise.routine = function() {
    $('#saved_workouts').hide();
    let workoutObj = {};
    $.get(`${__API_URL__}/api/v1/routine/${localStorage.user_id}`)
      // let workout = ()
      .then(res => workoutObj = new Exercise(res[0]))
      .then(() => {

        Object.keys(workoutObj).forEach(key => {
          $('#saved_workouts').append(`<section id="${key}"></section>`)
          let day = `${key.slice(0, -1)} Exercise ${key.slice(-1)}`
          day = day.charAt(0).toUpperCase() + day.slice(1);
          console.log(day)
          if(workoutObj[key] == -1){
            Exercise.toHtml({name: 'NO EXERCISE SELECTED', description: '<p>If you wish to save an exercise do so from the search page under more details</p>', weekday: day}, `#${key}`)
          } else {
            let url = {list: `https://wger.de/api/v2/exercise/${workoutObj[key]}?language=2&status=2`};
            $.get(`${__API_URL__}/api/v1/exerciselist`, url)
              .then(obj => {
                let temp = JSON.parse(obj);
                temp.weekday = day;
                Exercise.toHtml(temp, `#${key}`)
              })
          }
        })

      })
      .then(() => $('#saved_workouts').delay(2500).fadeIn(1000))
  }


  Exercise.toHtml = function (obj, where) {
    let exerciseTemplate = Handlebars.compile($('#routine-template').text());
    $(`${where}`).append(exerciseTemplate(obj));
  };

  //
  // Exercise.loadAll = function (arr) {
  //     console.log(arr)
  //    Exercise.all = arr.map(obj => new Exercise(obj))
  //  }
  //
  // Exercise.fetchAll = (callback) => {
  //   $.get(`${__API_URL__}/api/v1/save`)
  //   .then(data => Exercise.loadAll(data))
  //   .then(callback)
  //   .catch(console.error);
  // }
  //
  // Exercise.all = [];
  //


  module.exercise = Exercise;

})(app)

app.exercise.routine();
