"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Todo_1 = require("../models/Todo");
class TodoController {
    constructor() {
        this.addTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { text, userId } = req.body;
            const todo = yield new Todo_1.default({ text, userId });
            todo
                .save()
                .then(newTodo => {
                res.json({ todo: newTodo });
            })
                .catch(error => res.status(400).json({ error }));
        });
        this.updateText = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { todoId, userId, text } = req.body;
            yield Todo_1.default.findOneAndUpdate({ _id: todoId, userId }, { $set: { text } }, { new: true }, (error, todo) => {
                if (error) {
                    res.status(400).json({ error });
                }
                else {
                    res.json({ todo });
                }
            });
        });
        this.deleteTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { todoId, userId } = req.body;
            yield Todo_1.default.findOneAndRemove({ _id: todoId, userId }, error => {
                if (error) {
                    res.status(400).json({ error });
                }
                else {
                    res.json({ todoId });
                }
            });
        });
        this.deleteTodos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { todoIds, userId } = req.body;
            yield Todo_1.default.deleteMany({ userId, _id: { $in: todoIds } }, error => {
                if (error) {
                    res.status(400).json({ error });
                }
                else {
                    res.json({ todoIds });
                }
            });
        });
        this.toggleCompleteTodo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { todoId, complete, userId } = req.body;
            yield Todo_1.default.findOneAndUpdate({ _id: todoId, userId }, { $set: { complete } }, { new: true }, (error, todo) => {
                if (error) {
                    res.status(400).json({ error });
                }
                res.json({ todo });
            });
        });
        this.toggleCompleteTodos = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { todoIds, userId, complete } = req.body;
            try {
                yield Todo_1.default.updateMany({ _id: { $in: todoIds }, userId }, { $set: { complete } }, () => __awaiter(this, void 0, void 0, function* () {
                    const todos = yield Todo_1.default.find({
                        _id: { $in: todoIds },
                        userId
                    }).populate('userId', '_id');
                    res.json({ todos });
                }));
            }
            catch (error) {
                res.status(400).json({ error });
            }
        });
    }
}
exports.default = TodoController;
//# sourceMappingURL=TodoController.js.map