import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';

const TodoSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
    versionKey: false
  }
);

TodoSchema.plugin(mongoosePaginate);

export default mongoose.model('Todo', TodoSchema);
