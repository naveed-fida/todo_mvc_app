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

  bind: function() {
    this.$el.find('form').on('submit', this.newTodo.bind(this));
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
  template: templates.todo
});

App.init();
