// Generated by CoffeeScript 2.5.1
(function() {
  /*
  A module for DELPHI's Epidata API.

  https://github.com/cmu-delphi/delphi-epidata

  Notes:
   - If running in node.js (or using browserify), there are no external
     dependencies. Otherwise, a global jQuery object named `$` must be available.
  */
  var Epidata, https, querystring;

  // Use built-in node.js modules unless jQuery is available
  if ((typeof $ !== "undefined" && $ !== null ? $.getJSON : void 0) == null) {
    https = require('https');
    querystring = require('querystring');
  }

  Epidata = (function() {
    var BASE_URL, _list, _listitem, _request;

    // Because the API is stateless, the Epidata class only contains static methods
    class Epidata {
      // Build a `range` object (ex: dates/epiweeks)
      static range(from, to) {
        if (to <= from) {
          [from, to] = [to, from];
        }
        return {
          from: from,
          to: to
        };
      }

      // Fetch FluView data
      static fluview(callback, regions, epiweeks, issues, lag, auth) {
        var params;
        // Check parameters
        if (!((regions != null) && (epiweeks != null))) {
          throw {
            msg: '`regions` and `epiweeks` are both required'
          };
        }
        if ((issues != null) && (lag != null)) {
          throw {
            msg: '`issues` and `lag` are mutually exclusive'
          };
        }
        // Set up request
        params = {
          'source': 'fluview',
          'regions': _list(regions),
          'epiweeks': _list(epiweeks)
        };
        if (issues != null) {
          params.issues = _list(issues);
        }
        if (lag != null) {
          params.lag = lag;
        }
        if (auth != null) {
          params.auth = auth;
        }
        // Make the API call
        return _request(callback, params);
      }

      // Fetch FluView metadata
      static fluview_meta(callback) {
        var params;
        // Set up request
        params = {
          'source': 'fluview_meta'
        };
        // Make the API call
        return _request(callback, params);
      }

      // Fetch FluView clinical data
      static fluview_clinical(callback, regions, epiweeks, issues, lag) {
        var params;
        // Check parameters
        if (!((regions != null) && (epiweeks != null))) {
          throw {
            msg: '`regions` and `epiweeks` are both required'
          };
        }
        if ((issues != null) && (lag != null)) {
          throw {
            msg: '`issues` and `lag` are mutually exclusive'
          };
        }
        // Set up request
        params = {
          'source': 'fluview_clinical',
          'regions': _list(regions),
          'epiweeks': _list(epiweeks)
        };
        if (issues != null) {
          params.issues = _list(issues);
        }
        if (lag != null) {
          params.lag = lag;
        }
        // Make the API call
        return _request(callback, params);
      }

      // Fetch FluSurv data
      static flusurv(callback, locations, epiweeks, issues, lag) {
        var params;
        // Check parameters
        if (!((locations != null) && (epiweeks != null))) {
          throw {
            msg: '`locations` and `epiweeks` are both required'
          };
        }
        if ((issues != null) && (lag != null)) {
          throw {
            msg: '`issues` and `lag` are mutually exclusive'
          };
        }
        // Set up request
        params = {
          'source': 'flusurv',
          'locations': _list(locations),
          'epiweeks': _list(epiweeks)
        };
        if (issues != null) {
          params.issues = _list(issues);
        }
        if (lag != null) {
          params.lag = lag;
        }
        // Make the API call
        return _request(callback, params);
      }

      // Fetch Google Flu Trends data
      static gft(callback, locations, epiweeks) {
        var params;
        // Check parameters
        if (!((locations != null) && (epiweeks != null))) {
          throw {
            msg: '`locations` and `epiweeks` are both required'
          };
        }
        // Set up request
        params = {
          'source': 'gft',
          'locations': _list(locations),
          'epiweeks': _list(epiweeks)
        };
        // Make the API call
        return _request(callback, params);
      }

      // Fetch Google Health Trends data
      static ght(callback, auth, locations, epiweeks, query) {
        var params;
        // Check parameters
        if (!((auth != null) && (locations != null) && (epiweeks != null) && (query != null))) {
          throw {
            msg: '`auth`, `locations`, `epiweeks`, and `query` are all required'
          };
        }
        // Set up request
        params = {
          'source': 'ght',
          'auth': auth,
          'locations': _list(locations),
          'epiweeks': _list(epiweeks),
          'query': query
        };
        // Make the API call
        return _request(callback, params);
      }

      // Fetch HealthTweets data
      static twitter(callback, auth, locations, dates, epiweeks) {
        var params;
        // Check parameters
        if (!((auth != null) && (locations != null))) {
          throw {
            msg: '`auth` and `locations` are both required'
          };
        }
        if (!((dates != null) ^ (epiweeks != null))) {
          throw {
            msg: 'exactly one of `dates` and `epiweeks` is required'
          };
        }
        // Set up request
        params = {
          'source': 'twitter',
          'auth': auth,
          'locations': _list(locations)
        };
        if (dates != null) {
          params.dates = _list(dates);
        }
        if (epiweeks != null) {
          params.epiweeks = _list(epiweeks);
        }
        // Make the API call
        return _request(callback, params);
      }

      // Fetch Wikipedia access data
      static wiki(callback, articles, dates, epiweeks, hours) {
        var params;
        // Check parameters
        if (articles == null) {
          throw {
            msg: '`articles` is required'
          };
        }
        if (!((dates != null) ^ (epiweeks != null))) {
          throw {
            msg: 'exactly one of `dates` and `epiweeks` is required'
          };
        }
        // Set up request
        params = {
          'source': 'wiki',
          'articles': _list(articles)
        };
        if (dates != null) {
          params.dates = _list(dates);
        }
        if (epiweeks != null) {
          params.epiweeks = _list(epiweeks);
        }
        if (hours != null) {
          params.hours = _list(hours);
        }
        // Make the API call
        return _request(callback, params);
      }

      // Fetch CDC page hits
      static cdc(callback, auth, epiweeks, locations) {
        var params;
        // Check parameters
        if (!((auth != null) && (epiweeks != null) && (locations != null))) {
          throw {
            msg: '`auth`, `epiweeks`, and `locations` are all required'
          };
        }
        // Set up request
        params = {
          'source': 'cdc',
          'auth': auth,
          'epiweeks': _list(epiweeks),
          'locations': _list(locations)
        };
        // Make the API call
        return _request(callback, params);
      }

      // Fetch Quidel data
      static quidel(callback, auth, epiweeks, locations) {
        var params;
        // Check parameters
        if (!((auth != null) && (epiweeks != null) && (locations != null))) {
          throw {
            msg: '`auth`, `epiweeks`, and `locations` are all required'
          };
        }
        // Set up request
        params = {
          'source': 'quidel',
          'auth': auth,
          'epiweeks': _list(epiweeks),
          'locations': _list(locations)
        };
        // Make the API call
        return _request(callback, params);
      }

      // Fetch NoroSTAT data (point data, no min/max)
      static norostat(callback, auth, location, epiweeks) {
        var params;
        // Check parameters
        if (!((auth != null) && (location != null) && (epiweeks != null))) {
          throw {
            msg: '`auth`, `location`, and `epiweeks` are all required'
          };
        }
        // Set up request
        params = {
          'source': 'norostat',
          'auth': auth,
          'location': location,
          'epiweeks': _list(epiweeks)
        };
        // Make the API call
        return _request(callback, params);
      }

      // Fetch NoroSTAT metadata
      static meta_norostat(callback, auth) {
        var params;
        // Check parameters
        if (auth == null) {
          throw {
            msg: '`auth` is required'
          };
        }
        // Set up request
        params = {
          'source': 'meta_norostat',
          'auth': auth
        };
        // Make the API call
        return _request(callback, params);
      }

      // Fetch AFHSB data (point data, no min/max)
      static afhsb(callback, auth, locations, epiweeks, flu_types) {
        var params;
        // Check parameters
        if (!((auth != null) && (locations != null) && (epiweeks != null) && (flu_types != null))) {
          throw {
            msg: '`auth`, `locations`, `epiweeks` and `flu_types` are all required'
          };
        }
        // Set up request
        params = {
          'source': 'afhsb',
          'auth': auth,
          'locations': _list(locations),
          'epiweeks': _list(epiweeks),
          'flu_types': _list(flu_types)
        };
        // Make the API call
        return _request(callback, params);
      }

      // Fetch AFHSB metadata
      static meta_afhsb(callback, auth) {
        var params;
        // Check parameters
        if (auth == null) {
          throw {
            msg: '`auth` is required'
          };
        }
        // Set up request
        params = {
          'source': 'meta_afhsb',
          'auth': auth
        };
        // Make the API call
        return _request(callback, params);
      }

      // Fetch NIDSS flu data
      static nidss_flu(callback, regions, epiweeks, issues, lag) {
        var params;
        // Check parameters
        if (!((regions != null) && (epiweeks != null))) {
          throw {
            msg: '`regions` and `epiweeks` are both required'
          };
        }
        if ((issues != null) && (lag != null)) {
          throw {
            msg: '`issues` and `lag` are mutually exclusive'
          };
        }
        // Set up request
        params = {
          'source': 'nidss_flu',
          'regions': _list(regions),
          'epiweeks': _list(epiweeks)
        };
        if (issues != null) {
          params.issues = _list(issues);
        }
        if (lag != null) {
          params.lag = lag;
        }
        // Make the API call
        return _request(callback, params);
      }

      // Fetch NIDSS dengue data
      static nidss_dengue(callback, locations, epiweeks) {
        var params;
        // Check parameters
        if (!((locations != null) && (epiweeks != null))) {
          throw {
            msg: '`locations` and `epiweeks` are both required'
          };
        }
        // Set up request
        params = {
          'source': 'nidss_dengue',
          'locations': _list(locations),
          'epiweeks': _list(epiweeks)
        };
        // Make the API call
        return _request(callback, params);
      }

      // Fetch Delphi's forecast
      static delphi(callback, system, epiweek) {
        var params;
        // Check parameters
        if (!((system != null) && (epiweek != null))) {
          throw {
            msg: '`system` and `epiweek` are both required'
          };
        }
        // Set up request
        params = {
          'source': 'delphi',
          'system': system,
          'epiweek': epiweek
        };
        // Make the API call
        return _request(callback, params);
      }

      // Fetch Delphi's digital surveillance sensors
      static sensors(callback, auth, names, locations, epiweeks) {
        var params;
        // Check parameters
        if (!((auth != null) && (names != null) && (locations != null) && (epiweeks != null))) {
          throw {
            msg: '`auth`, `names`, `locations`, and `epiweeks` are all required'
          };
        }
        // Set up request
        params = {
          'source': 'sensors',
          'auth': auth,
          'names': _list(names),
          'locations': _list(locations),
          'epiweeks': _list(epiweeks)
        };
        // Make the API call
        return _request(callback, params);
      }

      // Fetch Delphi's wILI nowcast
      static nowcast(callback, locations, epiweeks) {
        var params;
        // Check parameters
        if (!((locations != null) && (epiweeks != null))) {
          throw {
            msg: '`locations` and `epiweeks` are both required'
          };
        }
        // Set up request
        params = {
          'source': 'nowcast',
          'locations': _list(locations),
          'epiweeks': _list(epiweeks)
        };
        // Make the API call
        return _request(callback, params);
      }

      // Fetch API metadata
      static meta(callback) {
        return _request(callback, {
          'source': 'meta'
        });
      }

      // Fetch Delphi's COVID-19 Surveillance Streams
      static covidcast(callback, data_source, signal, time_type, geo_type, time_values, geo_value, as_of, issues, lag) {
        var params;
        // Check parameters
        if (!((data_source != null) && (signal != null) && (time_type != null) && (geo_type != null) && (time_values != null) && (geo_value != null))) {
          throw {
            msg: '`data_source`, `signal`, `time_type`, `geo_type`, `time_values`, and `geo_value` are all required'
          };
        }
        if ((issues != null) && (lag != null)) {
          throw {
            msg: '`issues` and `lag` are mutually exclusive'
          };
        }
        // Set up request
        params = {
          'source': 'covidcast',
          'data_source': data_source,
          'signal': signal,
          'time_type': time_type,
          'geo_type': geo_type,
          'time_values': _list(time_values),
          'geo_value': geo_value
        };
        if (as_of != null) {
          params.as_of = as_of;
        }
        if (issues != null) {
          params.issues = _list(issues);
        }
        if (lag != null) {
          params.lag = lag;
        }
        // Make the API call
        return _request(callback, params);
      }

      // Fetch Delphi's COVID-19 Surveillance Streams metadata
      static covidcast_meta(callback) {
        return _request(callback, {
          'source': 'covidcast_meta'
        });
      }

    };

    // API base url
    BASE_URL = 'https://delphi.cmu.edu/epidata/api.php';

    // Helper function to cast values and/or ranges to strings
    _listitem = function(value) {
      if (value.hasOwnProperty('from') && value.hasOwnProperty('to')) {
        return `${value['from']}-${value['to']}`;
      } else {
        return `${value}`;
      }
    };

    // Helper function to build a list of values and/or ranges
    _list = function(values) {
      var value;
      if (!Array.isArray(values)) {
        values = [values];
      }
      return ((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = values.length; i < len; i++) {
          value = values[i];
          results.push(_listitem(value));
        }
        return results;
      })()).join(',');
    };

    // Helper function to request and parse epidata
    _request = function(callback, params) {
      var handler, reader;
      // Function to handle the API response
      handler = function(data) {
        if ((data != null ? data.result : void 0) != null) {
          return callback(data.result, data.message, data.epidata);
        } else {
          return callback(0, 'unknown error', null);
        }
      };
      // Request data from the server
      if ((typeof $ !== "undefined" && $ !== null ? $.getJSON : void 0) != null) {
        // API call with jQuery
        return $.getJSON(BASE_URL, params, handler);
      } else {
        // Function to handle the HTTP response
        reader = function(response) {
          var text;
          text = '';
          response.setEncoding('utf8');
          response.on('data', function(chunk) {
            return text += chunk;
          });
          response.on('error', function(e) {
            return error(e.message);
          });
          return response.on('end', function() {
            return handler(JSON.parse(text));
          });
        };
        // API call with Node
        return https.get(`${BASE_URL}?${querystring.stringify(params)}`, reader);
      }
    };

    return Epidata;

  }).call(this);

  // Export the API to the global environment
  (typeof exports !== "undefined" && exports !== null ? exports : window).Epidata = Epidata;

}).call(this);
