import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import models, { connectDb } from './models';
import routes from './routes';

const eraseDatabaseOnSync = true;

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  req.context = {
    models, 
    // me: await models.Blogger.findByLogin('rwieruch'),
  };
  next();
});

// app.use('/session', routes.session);
app.use('/users', routes.blogger);
app.use('/posts', routes.post);
app.use('/comments', routes.comment);

app.get('*', function (req, res, next) {
  const error = new Error(
    `${req.ip} tried to access ${req.originalUrl}`,
  );

  error.statusCode = 301;

  next(error);
});

app.use((error, req, res, next) => {
  if (!error.statusCode) error.statusCode = 500;

  if (error.statusCode === 301) {
    return res.status(301).redirect('/not-found');
  }

  return res
    .status(error.statusCode)
    .json({ error: error.toString() });
});
  
connectDb().then(async () => {
  if (eraseDatabaseOnSync) {
    await Promise.all([
      models.Blogger.deleteMany({}),
      models.Blogpost.deleteMany({}),
      models.Blogcomment.deleteMany({}),
    ]);
    createUsersWithMessages();
  }

  app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`),
  );
});


const createUsersWithMessages = async () => {
  const user1 = new models.Blogger({
    username: 'rwieruch',
    password: 'test',
  });

  const user2 = new models.Blogger({
    username: 'ddavids',
    password: 'test',
  });
  
  const post1 = new models.Blogpost({
    title: 'Test Title',
    text: 'AYAYA!',
    user: user1.id,
  })

  const post2 = new models.Blogpost({
    title: 'Test Title v2.0',
    text: 'AYAYA! AYAYA! AYAYA!!!',
    user: user1.id,
  })

  const message1 = new models.Blogcomment({
    text: 'Published the Road to learn React',
    user: user1.id,
    post: post1.id,
  });

  const message2 = new models.Blogcomment({
    text: 'Happy to release ...',
    user: user2.id,
    post: post1.id,
  });

  const message3 = new models.Blogcomment({
    text: 'Published a complete ...',
    user: user2.id,
    post: post2.id,
  });

  await user1.save();
  await user2.save();

  await post1.save();
  await post2.save();

  await message1.save();
  await message2.save();
  await message3.save();

};