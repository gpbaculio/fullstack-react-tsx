"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserController_1 = require("../controllers/UserController");
const authenticate_1 = require("../middlewares/authenticate");
class UserRoutes {
    constructor() {
        this.userController = new UserController_1.default();
    }
    routes(app) {
        //auth
        app.route('/api/auth').post(this.userController.logIn);
        app.route('/api/auth/confirm').post(this.userController.confirmToken);
        app.route('/api/user').post(this.userController.signUp);
        app
            .route('/api/user/current')
            .get(authenticate_1.default, this.userController.getCurrentUser);
        app
            .route('/api/user/todos')
            .get(authenticate_1.default, this.userController.getTodos);
    }
}
exports.default = UserRoutes;
//# sourceMappingURL=UserRoutes.js.map