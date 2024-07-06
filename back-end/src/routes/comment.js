import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import { verifyToken } from '../modules/verifytoken.js';

const jwt = require('jsonwebtoken');

const router = Router();

router.get('/', async (req, res) => {
  const messages = await req.context.models.Blogcomment.find();
  return res.send(messages);
});

router.get('/:messageId', async (req, res) => {
  const message = await req.context.models.Blogcomment.findById(
    req.params.messageId,
  );
  return res.send(message);
});

router.post('/:messageId', verifyToken, async (req, res, next) => {
  // const message = await req.context.models.Blogcomment.create({
  //   text: req.body.text,
  //   user: req.body.user,
  //   post: req.body.post,
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
      let acc = await req.context.models.Blogger.findOne({username: authData.user.username, password: authData.user.password});
      let pos = await req.context.models.Blogpost.findById(req.params.messageId);
      if (acc && pos.ifPublished) {
        const message = await req.context.models.Blogcomment.create({
          text: req.body.text,
          user: acc.id,
          post: req.params.messageId,
        }).catch((error) => {
          error.statusCode = 400;
          next(error);
        });
        return res.send(message);
    } else {
      res.sendStatus(401);
    }};
    fullVerify();
  }
  })
});   

router.delete('/:messageId', verifyToken, async (req, res) => {
  // const message = await req.context.models.Blogcomment.findByIdAndDelete(
  //   req.params.messageId,
  // );

  // return res.send(message);

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      // res.send(Status(403));
      res.send('You are not signed in.');
    } else { 
      const fullVerify = async () => {
      let acc = await req.context.models.Blogger.findOne({username: authData.user.username, password: authData.user.password});
      let com = await req.context.models.Blogcomment.findById(req.params.messageId);
      let pos = await req.context.models.Blogpost.findById(com.post.toString());
      if (acc.id === com.user.toString() || acc.id === pos.user.toString()) {
        const message = await req.context.models.Blogcomment.findByIdAndDelete(
          req.params.messageId,
        );
      
        return res.send(message);
    } else {
      res.sendStatus(401);
    }};
    fullVerify();
  }
  })
});

router.put('/:messageId', verifyToken, async (req, res) => {
  // const message = await req.context.models.Blogcomment.findByIdAndUpdate(
  //   req.params.messageId,
  //   {text: req.body.text},
  // );

  // return res.send(message);

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      // res.send(Status(403));
      res.send('You are not signed in.');
    } else { 
      const fullVerify = async () => {
      let acc = await req.context.models.Blogger.findOne({username: authData.user.username, password: authData.user.password});
      let com = await req.context.models.Blogcomment.findById(req.params.messageId);
      if (acc.id === com.user.toString()) {
        const message = await req.context.models.Blogcomment.findByIdAndUpdate(
          req.params.messageId,
          {text: req.body.text},
        );
      
        return res.send(message);
    } else {
      res.sendStatus(401);
    }};
    fullVerify();
  }
  })
});


export default router;