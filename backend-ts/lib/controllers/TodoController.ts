import { Request, Response } from 'express';
import Todo from '../models/Todo';

export default class TodoController {
  public addTodo = async (req: Request, res: Response) => {
    const { text, userId } = req.body;
    const todo = await new Todo({ text, userId });
    todo
      .save()
      .then(newTodo => {
        res.json({ todo: newTodo });
      })
      .catch(error => res.status(400).json({ error }));
  };
  public updateText = async (req: Request, res: Response) => {
    const { todoId, userId, text } = req.body;
    await Todo.findOneAndUpdate(
      { _id: todoId, userId },
      { $set: { text } },
      { new: true },
      (error, todo) => {
        if (error) {
          res.status(400).json({ error });
        } else {
          res.json({ todo });
        }
      }
    );
  };
  public deleteTodo = async (req: Request, res: Response) => {
    const { todoId, userId } = req.body;
    await Todo.findOneAndRemove({ _id: todoId, userId }, error => {
      if (error) {
        res.status(400).json({ error });
      } else {
        res.json({ todoId });
      }
    });
  };
  public deleteTodos = async (req: Request, res: Response) => {
    const { todoIds, userId } = req.body;
    await Todo.deleteMany({ userId, _id: { $in: todoIds } }, error => {
      if (error) {
        res.status(400).json({ error });
      } else {
        res.json({ todoIds });
      }
    });
  };
  public toggleCompleteTodo = async (req: Request, res: Response) => {
    const { todoId, complete, userId } = req.body;
    await Todo.findOneAndUpdate(
      { _id: todoId, userId },
      { $set: { complete } },
      { new: true },
      (error, todo) => {
        if (error) {
          res.status(400).json({ error });
        }
        res.json({ todo });
      }
    );
  };
  public toggleCompleteTodos = async (req: Request, res: Response) => {
    const { todoIds, userId, complete } = req.body;
    try {
      await Todo.updateMany(
        { _id: { $in: todoIds }, userId },
        { $set: { complete } },
        async () => {
          const todos = await Todo.find({
            _id: { $in: todoIds },
            userId
          }).populate('userId', '_id');
          res.json({ todos });
        }
      );
    } catch (error) {
      res.status(400).json({ error });
    }
  };
}
