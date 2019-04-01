"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const UserRoutes_1 = require("./routes/UserRoutes");
const TodoRoutes_1 = require("./routes/TodoRoutes");
const mongoose = require("mongoose");
const path = require("path");
class App {
    constructor() {
        this.app = express();
        this.userRoutes = new UserRoutes_1.default();
        this.todoRoutes = new TodoRoutes_1.default();
        this.mongoUrl = 'mongodb://iloveshelajoy:abcd123@ds155213.mlab.com:55213/redux-saga';
        this.config();
        this.mongoSetup();
        this.userRoutes.routes(this.app);
        this.todoRoutes.routes(this.app);
    }
    config() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        // serving static files
        if (process.env.NODE_ENV === 'production') {
            // Serve any static files
            this.app.use(express.static(path.join(__dirname, '../../frontend/build'), { index: false }));
            // Handle React routing, return all requests to React app
            this.app.get('*', (req, res) => {
                res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
            });
        }
    }
    mongoSetup() {
        mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl, {
            useNewUrlParser: true,
            useCreateIndex: true
        });
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map