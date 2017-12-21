'use strict';

var app = app || {};

$('#nav-routine').hide();

(function (module) {

  let __API_URL__ = 'http://localhost:3000';

  const Exercise = function (rdo) {//rdo: rawDataObj
    Object.keys(rdo).forEach(key => {
      if (key !== 'routine_id' && key !== 'user_id') this[key] = rdo[key]
    });
  };

  Exercise.routine = function() {
    let workoutObj = {}, exercises = [];
    $.get(`${__API_URL__}/api/v1/routine/${localStorage.user_id}`)
      // let workout = ()
      .then(res => workoutObj = new Exercise(res[0]))
      .then(() => {
          Object.keys(workoutObj).forEach(key => {
            let day = `${key.slice(0, -1)} Workout ${key.slice(-1)}`
            day = day.charAt(0).toUpperCase() + day.slice(1);
            console.log(day)
            if(workoutObj[key] == -1){
              exercises.push({name: 'NO EXERCISE SELECTED', description: 'If you wish to save an exercise do so from the search page under more details', weekday: day})
            } else {
              let url = {list: `https://wger.de/api/v2/exercise/${workoutObj[key]}?language=2&status=2`};              $.get(`${__API_URL__}/api/v1/exerciselist`, url)
                .then(obj => {
                  let temp = JSON.parse(obj);
                  temp.weekday = day;
                  exercises.push(temp)
                  console.log(temp)
                })
            }
          })
          .then(return exercises)
          })
      .then((arr) => {
        $('#saved_workouts').empty();
        Exercise.loadAll(arr);
        Exercise.all.map(obj => obj.toHtml());
        console.log(Exercise.all)
      })
}


  Exercise.prototype.toHtml = function () {
    let exerciseTemplate = Handlebars.compile($('#routine-template').text());
    $('#saved_workouts').append(exerciseTemplate(this));
  };


Exercise.loadAll = function (arr) {
    console.log(arr)
   Exercise.all = arr.map(obj => new Exercise(obj))
 }

Exercise.fetchAll = (callback) => {
  $.get(`${__API_URL__}/api/v1/save`)
  .then(data => Exercise.loadAll(data))
  .then(callback)
  .catch(console.error);
}

  Exercise.all = [];



  module.exercise = Exercise;

})(app)
