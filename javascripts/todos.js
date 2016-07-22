var App = {
  $el: $('main'),
  $todos: $('#todos'),

  newTodo: function(e) {
    e.preventDefault();
    var name = $(e.target).find('[name="todo_name"]').val(),
        model, view;

    if (!name) { return; }

    model = this.Todos.add({
      name: name,
      complete: false
    });
    view = new this.TodoView(model);
    this.$todos.append(view.$el);

    e.target.reset();
  },

  editTodo: function(e) {
    e.preventDefault();
    var idx = +$(e.target).attr('data-id'),
        model = this.Todos.get(idx),
        $edit_form = $(templates.todo_edit(model.attributes));

    model.view.$el.after($edit_form);
    model.view.$el.remove();
    $edit_form.on('blur', 'input', this.hideEdit.bind(this));
  },

  clearComplete: function(e) {
    e.preventDefault();
    var completed = this.Todos.models.filter(function(m) {
      return m.get('complete');
    });

    completed.forEach(this.Todos.remove.bind(this.Todos));
  },

  toggleComplete: function(e) {
    var $li = $(e.delegateTarget),
        idx = +$li.attr('data-id'),
        model = this.Todos.get(idx);
    model.set('complete', !model.get('complete'));
    $li.toggleClass('complete', model.get('complete'));
    return false;
  },

  hideEdit: function(e) {
    var $input = $(e.target),
        $li = $input.closest('li'),
        name = $input.val(),
        idx = +$li.attr('data-id');
        model = this.Todos.get(idx);
    model.set('name', name);
    $li.after(model.view.$el);
    $li.remove();
    $input.off(e);
  },

  bind: function() {
    this.$el.find('form').on('submit', this.newTodo.bind(this));
    this.$el.find('#clear').on('click', this.clearComplete.bind(this));
  },

  init: function() {
    this.bind();
  }
}

var templates = {};

$('[type="text/x-handlebars"]').each(function() {
  $t = $(this);
  templates[$t.attr('id')] = Handlebars.compile($t.html());
});

// Todo Model constructor; will be passed to Collection Constructor
App.TodoConstructor = new ModelConstructor();

// A collection constructor, Used to 
App.TodosConstructor = new CollectionConstructor();

// the todo collection
App.Todos = new App.TodosConstructor(App.TodoConstructor);

// the todo view constructor; used to create view for each model
App.TodoView = new ViewConstructor({
  tag_name: 'li',
  template: templates.todo,
  events: {
    'click a.toggle': App.toggleComplete.bind(App),
    'click': App.editTodo.bind(App),
  }
});

App.init();
