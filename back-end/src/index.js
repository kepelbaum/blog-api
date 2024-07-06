import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import models, { connectDb } from './models';
import routes from './routes';
import { verifyToken } from './modules/verifytoken.js';

const jwt = require('jsonwebtoken');

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
app.get('/not-found', (req, res) => {
  res.send('Page not found.');
});

app.get('/', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      // res.send(Status(403));
      res.send('You are not signed in.');
    } else { 
      const fullVerify = async () => {
      let acc = await models.Blogger.findOne({username: authData.user.username, password: authData.user.password});
      if (acc) {
      res.json({
        message: 'Welcome, ' + authData.user.username + '!',
      })
    } else {
      // res.sendStatus(401);
      res.send('You are not signed in.');
    }};
    fullVerify();
  }

  })
})

app.post('/sign-up', async (req, res, next) => {
  const user = {
    username: req.body.username.toLowerCase(),
    password: req.body.password,
  };

  const check = await models.Blogger.findOne({username: user.username});
  if (check) {
    res.send('Username "' + req.body.username + '" is already taken.');
    }
  else {
    const newuser = await models.Blogger.create(user)
    .catch(err => { 
      res.send(err);
  });
  res.send(user);
  } 
});


app.post('/login', async (req, res, next) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
  };

  const check = await models.Blogger.findOne({username: user.username, password: user.password});
  if (check) {
    jwt.sign({user}, 'secretkey', {expiresIn: '10h'}, (err, token) => {
      res.json({
        token
      })
    });
  }
  else {
    res.send('Wrong username and/or password.')
  } 
});



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

app.use((req, res, next) => {
  
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
    username: "roflan",
    password: "newtest",
  });
  
  const post1 = new models.Blogpost({
    title: 'Test Title',
    text: 'AYAYA!',
    user: user1.id,
    // ifPublished: false,
  })

  const post2 = new models.Blogpost({
    title: 'Test Title v2.0',
    text: 'AYAYA! AYAYA! AYAYA!!!',
    user: user2.id,
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

// function verifyToken(req, res, next) {
//   const bearerHeader = req.headers['authorization'];

//   if (typeof bearerHeader !== 'undefined') {
//     const bearer = bearerHeader.split(' ');
//     const bearerToken = bearer[1];
//     req.token = bearerToken;
//     next();
//   }
//   else {
//     // res.sendStatus(403);
//     res.send('You are not signed in.')
//   }
// }