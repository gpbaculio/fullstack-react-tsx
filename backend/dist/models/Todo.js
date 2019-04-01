"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
const TodoSchema = new mongoose.Schema({
    text: {
        type: String
    },
    complete: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    versionKey: false
});
TodoSchema.plugin(mongoosePaginate);
exports.default = mongoose.model('Todo', TodoSchema);
//# sourceMappingURL=Todo.js.map