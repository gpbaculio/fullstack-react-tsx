import * as express from 'express';
import * as bodyParser from 'body-parser';
import UserRoutes from './routes/UserRoutes';
import TodoRoutes from './routes/TodoRoutes';
import * as mongoose from 'mongoose';
import * as path from 'path';

class App {
  public app: express.Application = express();
  public userRoutes: UserRoutes = new UserRoutes();
  public todoRoutes: TodoRoutes = new TodoRoutes();
  public mongoUrl: string =
    'mongodb://iloveshelajoy:abcd123@ds155213.mlab.com:55213/redux-saga';
  constructor() {
    this.mongoSetup();
    this.userRoutes.routes(this.app);
    this.todoRoutes.routes(this.app);
    this.config();
  }

  private config(): void {
    this.app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    this.app.use(bodyParser.json());
    // serving static files
    if (process.env.NODE_ENV === 'production') {
      // Serve any static files
      this.app.use(
        express.static(path.join(__dirname, '../../frontend/build'))
      );
      // Handle React routing, return all requests to React app
      this.app.get('*', (req, res) => {
        res.sendFile(
          path.join(__dirname, '../../frontend/build', 'index.html')
        );
      });
    }
  }

  private mongoSetup(): void {
    (<any>mongoose).Promise = global.Promise;
    mongoose.connect(this.mongoUrl, {
      useNewUrlParser: true,
      useCreateIndex: true
    });
  }
}

export default new App().app;
