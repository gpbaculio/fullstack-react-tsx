import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { UserDocument } from '../models/User';

export interface CurrentUser extends Request {
  currentUser?: UserDocument;
}

export default (req: CurrentUser, res: Response, next: NextFunction) => {
  const { authorization } = req.headers; // token wil be injected on header if found on localStorage

  let token;
  if (authorization) {
    [, token] = authorization.split(' ');
  }

  if (token) {
    jwt.verify(token, 'iLoveShelaJoyHuiso', (err, decoded) => {
      if (err) {
        res.status(401).json({ error: 'Invalid token' });
      } else {
        User.findOne({ email: decoded.email })
          .select('email _id confirmed')
          .then(user => {
            req.currentUser = user;
            next();
          });
      }
    });
  } else {
    res.status(401).json({ errors: { global: 'No token' } });
  }
};
