'use strict';

var app = app || {};

$('#nav-search').hide();

(function (module) {

  let __API_URL__ = 'https://swolefellows.herokuapp.com'

  const Search = function (rdo) { //rdo: rawDataObj
    Object.keys(rdo).forEach(key => this[key] = rdo[key]);
  }

  Search.all = [];

  Search.prototype.toHtml = function (temp) {
    let template = temp || '#results-template';
    console.log('toHtml run', template)
    let exerciseTemplate = Handlebars.compile($(template).text());

    return exerciseTemplate(this);
  };

  Search.loadAll = (rd, single) => {
    if (!single) {
      Search.all = rd.results.map(ex => new Search(ex)); //ex(exercise object)) instantiated for each rd(rawData) entry.
      console.log(rd)
      if (rd.next) {
        $('.api_next').val(rd.next);
        $('.api_next').one('click', Search.changePage);
      }
      if (rd.previous) {
        $('.api_prev').val(rd.previous);
        $('.api_prev').one('click', Search.changePage);
      }
    } else {
      Search.all = [new Search(rd)]
      // Search.all = [];
      // Search.all.push(new Search(rd.results));
    }
  };

  Search.toggleVis = (dir, single) => {
    if (!dir) {
      $('main > *').hide();
    } else {
      if (!single) {
        // $('main > select').fadeIn(1000)
        $('main > section').fadeIn(1000)
      }
      $('#search-results').fadeIn(1000)
    }
  }

  Search.populateFilter = () => {
    let filterTemplate = Handlebars.compile($('#filter-template').text());
    $('#equipment').empty().append(filterTemplate({value: null, name: 'Choose equipment type...'}));
    $('#category').empty().append(filterTemplate({value: null, name: 'Choose muscle group...'}));
    $.get(`${__API_URL__}/api/v1/filters/equipment`)
      .then(res => JSON.parse(res))
      .then(res => res.results.map((val) => {
        $('#equipment').append(filterTemplate(val));
      }
      ));
    $.get(`${__API_URL__}/api/v1/filters/category`)
      .then(res => JSON.parse(res))
      .then(res => res.results.map((val) => {
        $('#category').append(filterTemplate(val));
      }
      ));
    $('select').on('change', function (e) {
      e.target.id === 'equipment'? $('#category').val('') : $('#equipment').val('')
      if (!e.target.value) Search.changePage()
      else {
        console.log(e.target.id, e.target.value)
        Search.changePage({target: {value:`https://wger.de/api/v2/exercise?language=2&status=2&${e.target.id}=${e.target.value}`}})
      }
    })
  }

  Search.changePage = (url, single) => { //Single is an optional flag for whether it is one exercise or many
    Search.toggleVis()
    let data = {};
    url? data = {list: url.target.value} : data = {list: 'https://wger.de/api/v2/exercise?language=2&status=2'}
    console.log(data)
    $.get(`${__API_URL__}/api/v1/exerciselist`, data)
      .then(res => {
        Search.loadAll(JSON.parse(res), single);
        $('#search-results').empty();
        if (!single) {
          Search.all.map(v => $('#search-results').append(v.toHtml()));
          $('.more-button').one('click', function (e) {
            e.preventDefault();
            Search.changePage({target: {value:`https://wger.de/api/v2/exercise/${e.target.value}?language=2&status=2`}}, true)
          })
          Search.toggleVis(true)
        } else {
          Search.all.map(v => $('#search-results').append(v.toHtml('#save-template')));
          $('#back').one('click', function () {
            Search.changePage()
          });
          $('#save-form').one('submit', function (e) {
            e.preventDefault();
            let time = ''
            e.target[1].checked? time = e.target[1].value: time = e.target[2].value;
            let routine = {
              id: e.target.parentElement.dataset.exerciseid,
              column: `${e.target[0].value}${time}`,
              user_id: parseInt(localStorage.user_id)
            }
            $.ajax({
              url: `${__API_URL__}/api/v1/save`,
              method: 'PUT',
              data: routine
            })
              .then(() => Search.changePage())
          })
          Search.toggleVis(true, true)
        }
      })
  }

  module.search = Search;

})(app)

app.search.populateFilter();
app.search.changePage();
