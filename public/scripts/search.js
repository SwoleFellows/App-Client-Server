'use strict';

var app = app || {};


(function (module) {

  let __API_URL__ = 'http://localhost:3000'

  const Search = function (rdo) { //rdo: rawDataObj
    Object.keys(rdo).forEach(key => this[key] = rdo[key]);
  }

  Search.all = [];

  Search.prototype.toHtml = function () {
    let exerciseTemplate = Handlebars.compile($('#results-template').text());

    return exerciseTemplate(this);
  };

  Search.loadAll = rd => {
    Search.all = rd.results.map(ex => new Search(ex)); //ex(exercise object)) instantiated for each rd(rawData) entry.
    if (rd.next) {
      $('div[data-api_next]').data('api_next', rd.next);
      $('div[data-api_next]').on('click', changePage($('div[data-api_next]').data('api_next')));
    }
    if (rd.prev) {
      $('div[data-api_prev]').data('api_prev', rd.prev);
      $('div[data-api_prev]').on('click', changePage($('div[data-api_prev]').data('api_prev')));
    }
  };

  Search.populateFilter = rdo => {
    let filterTemplate = Handlebars.compile($('#filter-template').text());
    $('#equipment').empty().append(filterTemplate({value: '', name: 'Choose equipment type...'}));
    $('#musclegroup').empty().append(filterTemplate({value: '', name: 'Choose muscle group...'}));
    $.get(`${__API_URL__}/api/v1/filters/equipment`)
      .then(res => res.results.map((val) => {
        $('#equipment').append(filterTemplate(val));
      }
    ));
    $.get(`${__API_URL__}/api/v1/filters/musclegroup`)
      .then(res => res.results.map((val) => {
        $('#musclegroup').append(filterTemplate(val));
      }
    ));
  }

  Search.changePage = url => {
    let data = {
      url: url || 'https://wger.de/api/v2/exercise?language=2&status=2'
    }
    $.get(`${__API_URL__}/api/v1/exerciselist`, data)
      .then(res => {
        Search.loadAll(res);
        $('#search-results').empty();
        Search.all.map(v => $('#search-results').append(v.toHtml()));
      })
  }

  module.search = Search;

})(app)


// Book.searchOne = (isbn, call) => {
//   console.log('searching', isbn)
//   $.get(`${__API_URL__}/api/v1/books/find/${isbn}`)
//     .then(res => new Book(res))
//     .then(call)
//     .catch(console.error)
// }
