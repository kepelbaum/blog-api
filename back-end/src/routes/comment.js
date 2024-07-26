import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';
import { verifyToken } from '../modules/verifytoken.js';

const jwt = require('jsonwebtoken');

const router = Router();

router.get('/', async (req, res) => {
  const messages = await req.context.models.Blogcomment.find()
  .populate("user", "-password")
  .exec();
  return res.send(messages);
});

router.get('/:messageId', async (req, res) => {
  const message = await req.context.models.Blogcomment.findById(
    req.params.messageId,
  )
  .populate("user", "-password")
  .exec();
  return res.send(message);
});

router.post('/:messageId', verifyToken, async (req, res, next) => {

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.send('You are not signed in.');
    } else { 
      const fullVerify = async () => {
      const acc = await req.context.models.Blogger.findOne({username: authData.user.username, password: authData.user.password});
      const pos = await req.context.models.Blogpost.findById(req.params.messageId);
      if (acc && pos.ifPublished) {
        const message = await req.context.models.Blogcomment.create({
          text: req.body.text,
          user: acc.id,
          post: req.params.messageId,
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

  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.send('You are not signed in.');
    } else { 
      const fullVerify = async () => {
      const acc = await req.context.models.Blogger.findOne({username: authData.user.username, password: authData.user.password});
      const com = await req.context.models.Blogcomment.findById(req.params.messageId);
      const pos = await req.context.models.Blogpost.findById(com.post.toString());
      if (acc.id === com.user.toString() || acc.id === pos.user.toString()) { // currently not intended for user to be able to delete their own posts, but keeping this just in case
        const message = await req.context.models.Blogcomment.findByIdAndDelete(
          req.params.messageId,
        );
      
        return res.json({message: "Message deleted"});
    } else {
      res.sendStatus(401);
    }};
    fullVerify();
  }
  })
});

// currently unused - not necessary for user/blog owner to be able to edit posts
// router.put('/:messageId', verifyToken, async (req, res) => {

//   jwt.verify(req.token, 'secretkey', (err, authData) => {
//     if(err) {
//       // res.send(Status(403));
//       res.send('You are not signed in.');
//     } else { 
//       const fullVerify = async () => {
//       const acc = await req.context.models.Blogger.findOne({username: authData.user.username, password: authData.user.password});
//       const com = await req.context.models.Blogcomment.findById(req.params.messageId);
//       if (acc.id === com.user.toString()) {
//         const message = await req.context.models.Blogcomment.findByIdAndUpdate(
//           req.params.messageId,
//           {text: req.body.text},
//         );
      
//         return res.json({message: "Message updated"});
//     } else {
//       res.sendStatus(401);
//     }};
//     fullVerify();
//   }
//   })
// });


export default router;