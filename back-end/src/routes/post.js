import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import { verifyToken } from '../modules/verifytoken.js';

const jwt = require('jsonwebtoken');

const router = Router();

router.get('/', async (req, res) => {
  const messages = await req.context.models.Blogpost.find()
  .populate("user")
  .exec();
  return res.send(messages);
});

router.get('/:messageId', async (req, res) => {
  const message = await req.context.models.Blogpost.findById(
    req.params.messageId,
  )
  .populate("user")
  .exec();
  return res.send(message);
});

router.post('/', verifyToken, async (req, res, next) => {
  // const message = await req.context.models.Blogpost.create({
  //   text: req.body.text,
  //   user: req.body.user,
  //   title: req.body.title,
  //   ifPublished: req.body.ifPublished,
  // }).catch((error) => {
  //   error.statusCode = 400;
  //   next(error);
  // });
  // return res.send(message);

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      // res.send(Status(403));
      res.send('You are not signed in.');
    } else { 
      const fullVerify = async () => {
      const acc = await req.context.models.Blogger.findOne({username: authData.user.username, password: authData.user.password});
      if (acc) {
        const message = await req.context.models.Blogpost.create({
          text: req.body.text,
          image_url: req.body.image_url,
          user: acc.id,
          title: req.body.title,
          ifPublished: req.body.ifPublished,
        }).catch((error) => {
          error.statusCode = 400;
          next(error);
        });
        return res.json({message: "Message created"});
    } else {
      res.sendStatus(401);
    }};
    fullVerify();
  }
  })
});   

router.delete('/:messageId', verifyToken, async (req, res) => {
  // const message = await req.context.models.Blogpost.findByIdAndDelete(
  //   req.params.messageId,
  // );

  // return res.send(message);
  
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      // res.send(Status(403));
      res.send('You are not signed in.');
    } else { 
      const fullVerify = async () => {
      const acc = await req.context.models.Blogger.findOne({username: authData.user.username, password: authData.user.password});
      const use = await req.context.models.Blogpost.findById(req.params.messageId);
      if (acc.id === use.user.toString()) {
        const message = await req.context.models.Blogpost.findByIdAndDelete(
          req.params.messageId,
        );
        const comdelete = await req.context.models.Blogcomment.deleteMany({post: use.id});
      
        return res.json({message: "Message deleted"});
    } else {
      res.sendStatus(401);
    }};
    fullVerify();
  }
  })
});

router.put('/:messageId', verifyToken, async (req, res) => {
  // const message = await req.context.models.Blogpost.findByIdAndUpdate(
  //   req.params.messageId,
  //   {text: req.body.text,
  //     title: req.body.title,
  //     image_url: req.body.image_url,
  //     ifPublished: req.body.ifPublished,},
  // );

  // return res.send(message);

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      // res.send(Status(403));
      res.send('You are not signed in.');
    } else { 
      const fullVerify = async () => {
      const acc = await req.context.models.Blogger.findOne({username: authData.user.username, password: authData.user.password});
      const use = await req.context.models.Blogpost.findById(req.params.messageId);
      if (acc.id === use.user.toString()) {
        const message = await req.context.models.Blogpost.findByIdAndUpdate(
          req.params.messageId,
          {text: req.body.text,
            title: req.body.title,
            image_url: req.body.image_url,
            ifPublished: req.body.ifPublished,},
        );
      
        return res.json({message: "Message updated"});
    } else {
      console.log(acc.id + ' AYAYA ' + use.user);
      res.sendStatus(401);
    }};
    fullVerify();
  }
  })
});


export default router;