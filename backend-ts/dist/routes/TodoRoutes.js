"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TodoController_1 = require("../controllers/TodoController");
class TodoRoutes {
    constructor() {
        this.todoController = new TodoController_1.default();
    }
    routes(app) {
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
exports.default = TodoRoutes;
//# sourceMappingURL=TodoRoutes.js.map