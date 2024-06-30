import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    image_url: {
        type: String,
    },
    title: { 
        type: String,
        required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Blogger' },
    date: { type: Date, default: Date.now },
    ifPublished: {type: Boolean, default: true},
  },
  { timestamps: true },
);

const Blogpost = mongoose.model('Post', postSchema);

export default Blogpost;