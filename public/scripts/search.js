'use strict';

var app = app || {}

(function (module) {

  const Search = function (rdo) { //rdo: rawDataObj
    Object.keys(rdo).forEach(key => this[key] = rdo[key]);
  }

  Search.all = [];

  Search.prototype.toHtml = function () {
    let template = Handlebars.compile($('#results-template').text());

    return template(this);
  };

  Search.loadAll = rd => {
    Search.all = rd.results.map(ex => new Search(ex)); //ex(exercise object)) instantiated for each rd(rawData) entry.
    if (rd.next) $('div[data-api_next]').data('api_next', rd.next);
    if (rd.prev) $('div[data-api_prev]').data('api_prev', rd.prev);
  };

  module.Search = Search;

})(app)
