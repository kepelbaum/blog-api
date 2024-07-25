import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import models, { connectDb } from './models';
import routes from './routes';
import { verifyToken } from './modules/verifytoken.js';
const { body, validationResult } = require("express-validator");

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
  res.json({result: 'Page not found.'});
});

app.get('/', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      // res.send(Status(403));
      res.json({result: "You are not signed in."});
    } else { 
      const fullVerify = async () => {
      const acc = await models.Blogger.findOne({username: authData.user.username, password: authData.user.password});
      if (acc) {
      res.json({
        message: 'Welcome, ' + authData.user.username + '!',
        name: acc.username,
        id: acc.id,
      })
    } else {
      // res.sendStatus(401);
      res.json({result: "You are not signed in."});
    }};
    fullVerify();
  }

  })
})

app.post('/sign-up', 
  body('username').isLength({ min: 1 }).withMessage("Please enter a username."),
  body('username').custom(async value => {
    const user = await models.Blogger.findOne({username: value.toLowerCase()}).exec();
    if (user) {
      throw new Error('Username "' + value.toLowerCase() + '" is already taken.');
      return false;
    }
    else {
      return true;  
    }
}),
body('password').isLength({ min: 5 }).withMessage("Password has to be at least 5 symbols long"),
body('confirm').custom((value, { req }) => {
      if (value === req.body.password) return true;
      else throw new Error('Passwords do not match');
}),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send(errors.array());
    } else {
  const user = {
    username: req.body.username.toLowerCase(),
    password: req.body.password,
  };
    const newuser = await models.Blogger.create(user)
    .catch(err => { 
      res.send(err);
  });
  res.json({"result": 'Account created.'});
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
    res.json({"result": 'Wrong username and/or password.'})
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
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    user: user1.id,
    image_url: 'https://images.unsplash.com/photo-1720440931331-bdc0e7af2045?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // ifPublished: false,
  })

  const post2 = new models.Blogpost({
    title: 'Test Title Test Title Test Title Test Title Test Title',
    text: 'AYAYA! AYAYA! AYAYA!!!',
    user: user2.id,
    image_url: 'https://images.unsplash.com/photo-1481988535861-271139e06469?q=80&w=2690&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  })

  const post3 = new models.Blogpost({
    title: 'Test Title',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    user: user1.id,
    image_url: 'https://images.unsplash.com/photo-1720440931331-bdc0e7af2045?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // ifPublished: false,
  })

  const post4 = new models.Blogpost({
    title: 'Test Title',
    text: 'Arcu cursus vitae congue mauris rhoncus aenean. Tempor id eu nisl nunc mi ipsum faucibus vitae. Pellentesque adipiscing commodo elit at imperdiet dui accumsan sit. Etiam dignissim diam quis enim lobortis scelerisque. In iaculis nunc sed augue lacus viverra vitae congue eu. Facilisi nullam vehicula ipsum a arcu cursus vitae. Tincidunt augue interdum velit euismod in pellentesque massa placerat. Placerat orci nulla pellentesque dignissim enim sit amet venenatis urna. Id leo in vitae turpis massa sed elementum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames. Arcu felis bibendum ut tristique et egestas quis ipsum. Proin sed libero enim sed.',
    user: user1.id,
    image_url: 'https://images.unsplash.com/photo-1720440931331-bdc0e7af2045?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // ifPublished: false,
  })

  const post5 = new models.Blogpost({
    title: 'Test Title',
    text: 'Faucibus purus in massa tempor nec feugiat. Quam id leo in vitae turpis. Lacus sed viverra tellus in hac habitasse platea dictumst. Id diam maecenas ultricies mi eget mauris. Mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien et. Faucibus in ornare quam viverra orci sagittis. Felis donec et odio pellentesque diam volutpat commodo sed. Turpis massa sed elementum tempus egestas sed sed. Id aliquet risus feugiat in ante metus. Mi tempus imperdiet nulla malesuada pellentesque elit eget gravida cum. Quam vulputate dignissim suspendisse in est ante in. Nec tincidunt praesent semper feugiat nibh sed. Interdum velit euismod in pellentesque massa placerat duis. Nisl purus in mollis nunc. Nunc sed velit dignissim sodales ut. Ultrices eros in cursus turpis massa tincidunt dui ut. Amet venenatis urna cursus eget nunc scelerisque viverra mauris in. Mi sit amet mauris commodo quis. Elementum tempus egestas sed sed risus pretium.',
    user: user1.id,
    image_url: 'https://images.unsplash.com/photo-1720440931331-bdc0e7af2045?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // ifPublished: false,
  })

  const post6 = new models.Blogpost({
    title: 'Test Title',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Commodo sed egestas egestas fringilla phasellus faucibus scelerisque. Eget nunc lobortis mattis aliquam. Facilisi morbi tempus iaculis urna. Dapibus ultrices in iaculis nunc sed augue. Sapien pellentesque habitant morbi tristique senectus et netus et. Id consectetur purus ut faucibus pulvinar elementum. Quisque non tellus orci ac auctor augue mauris. Sed egestas egestas fringilla phasellus faucibus scelerisque. Ut venenatis tellus in metus. Aliquet lectus proin nibh nisl condimentum id venenatis. Magna etiam tempor orci eu lobortis elementum nibh. Et odio pellentesque diam volutpat commodo sed egestas. Commodo quis imperdiet massa tincidunt nunc pulvinar sapien.',
    user: user1.id,
    image_url: 'https://images.unsplash.com/photo-1720440931331-bdc0e7af2045?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // ifPublished: false,
  })

  const post7 = new models.Blogpost({
    title: 'Test Title',
    text: 'Ut tellus elementum sagittis vitae. Aliquam ut porttitor leo a diam sollicitudin. Non blandit massa enim nec dui nunc mattis enim. Mattis vulputate enim nulla aliquet porttitor. Ipsum faucibus vitae aliquet nec ullamcorper sit amet risus nullam. Facilisis volutpat est velit egestas dui id. Duis convallis convallis tellus id interdum. Volutpat est velit egestas dui id. Eget aliquet nibh praesent tristique magna sit amet purus. Id porta nibh venenatis cras. Condimentum lacinia quis vel eros donec ac odio. Malesuada bibendum arcu vitae elementum curabitur vitae nunc. Ut enim blandit volutpat maecenas volutpat blandit aliquam etiam.',
    user: user1.id,
    image_url: 'https://images.unsplash.com/photo-1720440931331-bdc0e7af2045?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    // ifPublished: false,
  })

  const message1 = new models.Blogcomment({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Enim facilisis gravida neque convallis a cras semper. Tincidunt praesent semper feugiat nibh sed pulvinar proin gravida hendrerit. Enim praesent elementum facilisis leo. In hendrerit gravida rutrum quisque non tellus orci ac. Neque gravida in fermentum et sollicitudin. Sed viverra ipsum nunc aliquet bibendum enim. Aenean pharetra magna ac placerat vestibulum lectus mauris ultrices eros. Pharetra magna ac placerat vestibulum lectus. Fusce ut placerat orci nulla pellentesque dignissim enim. Pellentesque massa placerat duis ultricies lacus sed turpis tincidunt id. Rhoncus mattis rhoncus urna neque viverra justo nec. Tincidunt praesent semper feugiat nibh sed pulvinar proin gravida hendrerit. Enim neque volutpat ac tincidunt vitae. Nisi lacus sed viverra tellus in hac habitasse platea dictumst. Dolor sit amet consectetur adipiscing elit duis tristique sollicitudin. Convallis posuere morbi leo urna molestie at elementum eu facilisis. In nisl nisi scelerisque eu ultrices vitae auctor eu augue. Tempor commodo ullamcorper a lacus vestibulum sed arcu non. Enim sed faucibus turpis in eu mi bibendum neque egestas.',
    user: user1.id,
    post: post1.id,
  });

  const message2 = new models.Blogcomment({
    text: 'Montes nascetur ridiculus mus mauris vitae ultricies leo integer. Tincidunt dui ut ornare lectus sit amet est placerat in. Sit amet est placerat in egestas erat. Sed adipiscing diam donec adipiscing tristique. Tristique nulla aliquet enim tortor at auctor urna nunc id. Proin nibh nisl condimentum id venenatis a condimentum vitae. At erat pellentesque adipiscing commodo elit at. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras. Eget velit aliquet sagittis id consectetur purus ut. Bibendum ut tristique et egestas. Rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant. Porttitor massa id neque aliquam vestibulum morbi blandit cursus risus. Faucibus ornare suspendisse sed nisi lacus sed viverra tellus. Non odio euismod lacinia at.',
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
  await post3.save();
  await post4.save();
  await post5.save();
  await post6.save();
  await post7.save();

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