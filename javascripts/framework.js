function ModelConstructor(options) {
  var id_count = 0;
  options = options || {};

  function Model(attrs) {
    id_count++;
    var self = this;
    self.attributes = attrs || {};
    self.attributes.id = id_count;
    self.id = id_count;
    this.__events = [];

    if (options && options.change && _.isFunction(options.change)) {
      self.__events.push(options.change);
    }
  }

  Model.prototype = {
    __remove: function() {},

    set: function(key, value) {
      this.attributes[key] = value;
      this.triggerChange();
    },

    get: function(key) {
      return this.attributes[key];
    },

    remove: function(key) {
      delete this.attributes[key];
      this.triggerChange();
    },

    triggerChange: function() {
      var self = this; // not in vids
      self.__events.forEach(function(cb) {
        cb.call(self);
      });
    },

    addCallback: function(cb) {
      this.__events.push(cb);
    }
  };

  _.extend(Model.prototype, options);

  return Model;
}

function CollectionConstructor(options) {
  options = options || {};
  function Collection(model_constructor) {
    this.models = [];
    this.model = model_constructor;
  }

  Collection.prototype = {
    reset: function() {
      this.models = [];
    },

    add: function(model) {
      var old_m = _(this.models).findWhere({ id: model.id }),
          new_m;

      if (old_m) { return old_m; }

      new_m = new this.model(model);
      this.models.push(new_m);

      return new_m;
    },

    remove: function(idx) {
      idx = _.isObject(idx) ? idx.id : idx;
      var m = this.get(idx);

      if (!m) { return; }

      this.models = this.models.filter(function(curr_model) {
        return curr_model.id !== m.id;
      });
      m.__remove();
    },

    set: function(models) {
      this.reset(); // not in vids
      models = _(models).isArray() ? models : [models];
      models.forEach(this.add.bind(this)); 
    },

    get: function(idx) {
      return _(this.models).findWhere({id: idx});
    },
  }

  _.extend(Collection.prototype, options);
  return Collection;
}

function ViewConstructor(options) {
  options = options || {};
  function View(model) {
    this.model = model;
    this.model.view = this;
    this.model.addCallback(this.render.bind(this));
    this.model.__remove = this.remove.bind(this);
    this.attributes["data-id"] = this.model.id; // not in vids
    this.$el = $('<' + this.tag_name + ' />', this.attributes);
    this.render();
  }

  View.prototype = {
    tag_name: 'div',
    attributes: {},
    events: {},
    
    template: function() {},

    render: function() {
      this.unbindEvents();
      this.$el.html(this.template(this.model.attributes));
      this.bindEvents();
    },

    bindEvents: function() {
      var $el = this.$el,
          event, selector, parts;

      for (var prop in this.events) {
        parts = prop.split(' ');
        selector = parts.length > 1 ? parts.slice(1).join(' ') : undefined;
        event = parts[0];
        if (selector) {
          $el.on(event + '.view', selector, this.events[prop]); // bind(this) in the vid (wrong)
        } else {
          $el.on(event + '.view', this.events[prop]);
        }
      }
    },

    unbindEvents: function() {
      this.$el.off('.view');
    },

    remove: function() {
      this.unbindEvents();
      this.$el.remove();
    },
  };

  _.extend(View.prototype, options);
  return View;
}