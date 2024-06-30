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

  bloggerSchema.pre('remove', function(next) {
    this.model('Post').deleteMany({ user: this._id }, next);
  });

const Blogger = mongoose.model('Blogger', bloggerSchema);

export default Blogger;