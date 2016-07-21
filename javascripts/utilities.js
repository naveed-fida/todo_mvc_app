(function() {
  function _(element) {
    u = {
      first: function() {
        return element[0];
      },

      last: function() {
        return element[element.length -1]; 
      },

      without: function() {
        var args = Array.from(arguments);
        var newArray = [];

        element.forEach(function(elem) {
          if (!args.includes(elem)) newArray.push(elem);
        });
         return newArray;
      },

      lastIndexOf: function(elem) {
        return element.lastIndexOf(elem);
      },

      sample: function(qty) {
        var sampled = [];
        var elem_copy = element.slice();

        get = function() {
          var idx = Math.floor(Math.random() * elem_copy.length),
              el = elem_copy[idx];
          elem_copy.splice(idx, 1);
          return el;
        }
        if (!qty) { return get(); }
        while (qty) {
          sampled.push(get());
          qty--;
        }
        return sampled;
      },

      findWhere: function(query) {
        var match;
        element.some(function(obj) {
          var all_match = true;

          for (var prop in query) {
            if (!(prop in obj) || obj[prop] !== query[prop] ) {
              all_match = false;
            }
          }

          if (all_match) {
            match = obj;
            return true;
          }
        });
        return match;
      },

      where: function(query) {
        var query_keys = Object.keys(query);
        var return_arr = [];
        for (var i = 0; i < element.length; i++) {
          var obj = element[i];
          var all_match = query_keys.every(function(key) {
            return query[key] === obj[key];
          });
          if (all_match) { return_arr.push(obj); }
        }
        return return_arr;
      },

      pluck: function(prop) {
        var values = [];
        element.forEach(function(obj) {
          if(obj[prop]) { values.push(obj[prop]); }
        });
        return values;
      },

      keys: function() {
        return Object.keys(element);
      },

      values: function() {
        var arr_values = [];
        for (var prop in element) {
          arr_values.push(element[prop]);
        }
        return arr_values;
      },

      pick: function() {
        props = Array.from(arguments);
        newObj = {};

        props.forEach(function(prop) {
          if (element[prop]) { newObj[prop] = element[prop] };
        });
        return newObj;
      },

      omit: function() {
        props = Array.from(arguments);
        newObj = {};

        for (var prop in element) {
          if(props.indexOf(prop) == -1) { newObj[prop] = element[prop]; }
        }
        return newObj;
      },

      has: function(prop) {
        return {}.hasOwnProperty.call(element, prop);
      },
    };

    (["isElement", "isArray", "isObject", "isFunction", "isBoolean", "isString", "isNumber"]).forEach(function(method) {
      u[method] = function() { return _[method].call(u, element); };
    });

    return u;
  };
  _.range = function(low, high) {
    var range = [];
    if(high === undefined) {
      high = low;
      low = 0;
    }
    for (var i = low; i < high; i++) {
      range.push(i);
    }
    return range;
  };

  _.extend = function() {
    args = Array.from(arguments);
    old_obj = args.shift();

    args.forEach(function(obj) {
      for (prop in obj) {
        old_obj[prop] = obj[prop];
      }
    });
    return old_obj;
  };

  _.isElement = function(thing) {
    return thing instanceof HTMLElement;
  };

  _.isArray = Array.isArray || function(thing) {
    return thing instanceof Array;
  };

  _.isObject = function(thing) {
    return thing instanceof Object;
  };

  _.isFunction = function(thing) {
    return thing instanceof Function;
  };

  _.isBoolean = function(thing) {
    return (typeof thing) === "boolean" || thing instanceof Boolean;
  };

  _.isString = function(thing) {
    return (typeof thing) == "string" || thing instanceof String;
  };

  _.isNumber = function(thing) {
    return (typeof thing) == 'number' || thing instanceof Number;
  };

  window._ = _;
})();
