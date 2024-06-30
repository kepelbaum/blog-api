import mongoose from 'mongoose';

import Blogger from './blogger';
import Blogpost from './post';
import Blogcomment from './comment';

const connectDb = () => {
  return mongoose.connect(process.env.MONGODB_URI);
};

const models = { Blogger, Blogpost, Blogcomment };

export { connectDb };

export default models;

