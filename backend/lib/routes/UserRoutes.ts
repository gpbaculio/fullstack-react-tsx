import UserController from '../controllers/UserController';
import authenticate from '../middlewares/authenticate';

export default class UserRoutes {
  public userController: UserController = new UserController();
  public routes(app): void {
    //auth
    app.route('/api/auth').post(this.userController.logIn);

    app.route('/api/auth/confirm').post(this.userController.confirmToken);
    app.route('/api/user').post(this.userController.signUp);
    app
      .route('/api/user/current')
      .get(authenticate, this.userController.getCurrentUser);
    app
      .route('/api/user/todos')
      .get(authenticate, this.userController.getTodos);
  }
}
