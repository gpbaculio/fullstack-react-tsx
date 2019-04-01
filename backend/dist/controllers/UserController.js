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
const User_1 = require("../models/User");
const Todo_1 = require("../models/Todo");
const mailer_1 = require("../mailer");
class UserController {
    constructor() {
        // add new contact
        this.logIn = (req, res) => {
            const { email, password } = req.body;
            console.log('req.body ', req.body);
            User_1.default.findOne({ email }).then(user => {
                if (user && user.isValidPassword(password)) {
                    res.status(200).json({ user: user.toAuthJSON() });
                }
                else {
                    res.status(401).json({ error: 'Invalid Credentials' });
                }
            });
        };
        this.signUp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield User_1.default.findOne({ email: email.toLowerCase() });
            if (user) {
                res.status(409).json({ error: 'Email already used' });
            }
            else {
                const newUser = new User_1.default({ email });
                newUser.setPassword(password);
                newUser.setConfirmationToken();
                newUser.save().then(userRecord => {
                    mailer_1.sendConfirmationEmail(userRecord);
                    res.json({ user: userRecord.toAuthJSON() });
                });
            }
        });
        this.getCurrentUser = (req, res) => {
            if (req.currentUser._id) {
                res.json({
                    user: req.currentUser
                });
            }
            else {
                res.status(400).json({ error: 'failed to retrieve user' });
            }
        };
        this.getTodos = (req, res) => {
            const { offset, limit, searchText, filter } = req.query;
            const query = { userId: req.currentUser._id };
            if (searchText) {
                query.text = { $regex: `${searchText}`, $options: 'i' };
            }
            if (filter === 'Active') {
                query.complete = false;
            }
            else if (filter === 'Completed') {
                query.complete = true;
            }
            Todo_1.default.paginate(query, {
                offset: parseFloat(offset),
                limit: parseFloat(limit),
                sort: { createdAt: -1 } // Sort by Date Added DESC
            }, (error, { docs, total }) => error
                ? res.status(400).json({ error })
                : res.status(200).json({ count: total, todos: docs }));
        };
        this.confirmToken = (req, res) => {
            const { token } = req.body;
            User_1.default.findOneAndUpdate({ confirmationToken: token }, { confirmationToken: '', confirmed: true }, { new: true }).then(user => user
                ? res.json({ user: { email: user.email } })
                : res.status(400).json({ error: 'Invalid Token' }) // error response as for token must be invalid
            );
        };
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map