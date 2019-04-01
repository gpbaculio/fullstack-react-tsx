"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const User_1 = require("../models/User");
exports.default = (req, res, next) => {
    const { authorization } = req.headers; // token wil be injected on header if found on localStorage
    let token;
    if (authorization) {
        [, token] = authorization.split(' ');
    }
    if (token) {
        jwt.verify(token, 'iLoveShelaJoyHuiso', (err, decoded) => {
            if (err) {
                res.status(401).json({ error: 'Invalid token' });
            }
            else {
                User_1.default.findOne({ email: decoded.email })
                    .select('email _id confirmed')
                    .then(user => {
                    req.currentUser = user;
                    next();
                });
            }
        });
    }
    else {
        res.status(401).json({ errors: { global: 'No token' } });
    }
};
//# sourceMappingURL=authenticate.js.map