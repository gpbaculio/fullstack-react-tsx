import { Request, Response } from 'express';
import User from '../models/User';
import Todo from '../models/Todo';
import { sendConfirmationEmail } from '../mailer';
import { CurrentUser } from '../middlewares/authenticate';

interface PaginateQuery {
  userId?: string;
  complete?: boolean;
  text?: {
    $regex: string;
    $options: string;
  };
}

export default class UserController {
  // add new contact
  public logIn = (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log('req.body ', req.body);
    User.findOne({ email }).then(user => {
      if (user && user.isValidPassword(password)) {
        res.status(200).json({ user: user.toAuthJSON() });
      } else {
        res.status(401).json({ error: 'Invalid Credentials' });
      }
    });
  };
  public signUp = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      res.status(409).json({ error: 'Email already used' });
    } else {
      const newUser = new User({ email });
      newUser.setPassword(password);
      newUser.setConfirmationToken();
      newUser.save().then(userRecord => {
        sendConfirmationEmail(userRecord);
        res.json({ user: userRecord.toAuthJSON() });
      });
    }
  };
  public getCurrentUser = (req: CurrentUser, res: Response) => {
    if (req.currentUser._id) {
      res.json({
        user: req.currentUser
      });
    } else {
      res.status(400).json({ error: 'failed to retrieve user' });
    }
  };
  public getTodos = (req: CurrentUser, res: Response) => {
    const { offset, limit, searchText, filter } = req.query;
    const query: PaginateQuery = { userId: req.currentUser._id };
    if (searchText) {
      query.text = { $regex: `${searchText}`, $options: 'i' };
    }
    if (filter === 'Active') {
      query.complete = false;
    } else if (filter === 'Completed') {
      query.complete = true;
    }
    Todo.paginate(
      query,
      {
        offset: parseFloat(offset),
        limit: parseFloat(limit),
        sort: { createdAt: -1 } // Sort by Date Added DESC
      },
      (error, { docs, total }) =>
        error
          ? res.status(400).json({ error })
          : res.status(200).json({ count: total, todos: docs })
    );
  };
  public confirmToken = (req: Request, res: Response) => {
    const { token } = req.body;
    User.findOneAndUpdate(
      { confirmationToken: token },
      { confirmationToken: '', confirmed: true },
      { new: true }
    ).then(
      user =>
        user
          ? res.json({ user: { email: user.email } })
          : res.status(400).json({ error: 'Invalid Token' }) // error response as for token must be invalid
    );
  };
}
