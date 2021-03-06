import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
  confirmed: string;
  confirmationToken: string;
  isValidPassword: (password: string) => boolean;
  setPassword: (password: string) => void;
  generateJWT: () => void;
  setConfirmationToken: () => void;
  generateConfirmationUrl: () => void;
  toAuthJSON: () => void;
}

const UserSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: false, versionKey: false }
);

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
  return `${process.env.HOSTNAME || process.env.LOCALHOST}confirmation/${
    this.confirmationToken
  }`;
};

UserSchema.methods.toAuthJSON = function toAuthJSON() {
  return {
    _id: this._id, // _id is mongoose id
    email: this.email,
    token: this.generateJWT(),
    confirmed: this.confirmed
  };
};

export default mongoose.model<UserDocument>('User', UserSchema);
