import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Blogger' },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const Blogcomment = mongoose.model('Comment', commentSchema);

export default Blogcomment;