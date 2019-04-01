import TodoController from '../controllers/TodoController';

export default class TodoRoutes {
  public todoController: TodoController = new TodoController();
  public routes(app): void {
    app.route('/api/todo').post(this.todoController.addTodo);
    app.route('/api/todo/updateText').post(this.todoController.updateText);
    app.route('/api/todo/delete').post(this.todoController.deleteTodo);
    app.route('/api/todo/deleteMany').post(this.todoController.deleteTodos);
    app
      .route('/api/todo/toggleComplete')
      .post(this.todoController.toggleCompleteTodo);
    app
      .route('/api/todo/toggleCompleteMany')
      .post(this.todoController.toggleCompleteTodos);
  }
}
