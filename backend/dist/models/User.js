"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    confirmationToken: {
        type: String,
        default: ''
    }
}, { timestamps: false, versionKey: false });
UserSchema.methods.isValidPassword = function isValidPassword(password) {
    return bcrypt.compareSync(password, this.password);
};
UserSchema.methods.setPassword = function setPassword(password) {
    this.password = bcrypt.hashSync(password, 10);
};
UserSchema.methods.generateJWT = function generateJWT() {
    return jwt.sign({ email: this.email }, 'iLoveShelaJoyHuiso');
};
UserSchema.methods.setConfirmationToken = function setConfirmationToken() {
    this.confirmationToken = this.generateJWT();
};
UserSchema.methods.generateConfirmationUrl = function generateConfirmationUrl() {
    return `${process.env.HOSTNAME || process.env.LOCALHOST}confirmation/${this.confirmationToken}`;
};
UserSchema.methods.toAuthJSON = function toAuthJSON() {
    return {
        _id: this._id,
        email: this.email,
        token: this.generateJWT(),
        confirmed: this.confirmed
    };
};
exports.default = mongoose.model('User', UserSchema);
//# sourceMappingURL=User.js.map