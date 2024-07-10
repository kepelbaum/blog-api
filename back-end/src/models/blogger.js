import mongoose from 'mongoose';

const bloggerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
        type: String,
        required: true,
    },
  },
  { timestamps: true },
);

const Blogger = mongoose.model('Blogger', bloggerSchema);

export default Blogger;