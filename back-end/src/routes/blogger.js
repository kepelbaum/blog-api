import { Router } from 'express';
import { verifyToken } from '../modules/verifytoken.js';
const jwt = require('jsonwebtoken');

const router = Router();



router.get('/', async (req, res) => {
  const users = await req.context.models.Blogger.find();
  return res.send(users);
});

// Commented out code below is unused, blogger creation moved to index.js
// router.post('/', async (req, res) => {
//   const user = await req.context.models.Blogger.create({
//     username: req.body.username,
//     password: req.body.password,
//   }).catch((error) => {
//     error.statusCode = 400;
//     next(error);
//   });
//   return res.send(user);
// });

// router.delete('/:userId', verifyToken, async (req, res) => {
//   jwt.verify(req.token, 'secretkey', (err, authData) => {
//     if(err) {
//       res.send('You are not signed in.');
//     } else { 
//       const fullVerify = async () => {
//       const acc = await req.context.models.Blogger.findOne({username: authData.user.username, password: authData.user.password});
//       const use = await req.context.models.Blogger.findById(req.params.userId);
//       if (acc.username === use.username && acc.password === use.password) {
//         const user = await req.context.models.Blogger.findByIdAndDelete(
//           req.params.userId,
//       );

//         const posts = await req.context.models.Blogpost.find({user: req.params.userId});

//         posts.map(async (ele) => {
//           const comments = await req.context.models.Blogcomment.deleteMany({post: ele._id});
//         });

//         const poststwo = await req.context.models.Blogpost.deleteMany({user: req.params.userId});

//         return res.json({"Account deleted"});
//     } else {
//       res.sendStatus(401);
//     }};
//     fullVerify();
//   }
//   })
// });

router.put('/:userId', verifyToken, 
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
  jwt.verify(req.token, 'secretkey', (err, authData) => {
    if(err) {
      res.send('You are not signed in.');
    } else { 
      const fullVerify = async () => {
      const acc = await req.context.models.Blogger.findOne({username: authData.user.username, password: authData.user.password});
      const use = await req.context.models.Blogger.findById(req.params.userId);
      if (acc.username === use.username && acc.password === use.password) {
        const user = await req.context.models.Blogger.findByIdAndUpdate(
          req.params.userId,
          {password: req.body.password},
        );
        return res.json({message: "Password updated"});
    } else {
      res.sendStatus(401);
    }};
    fullVerify();
  }
  })}
});

router.get('/:userId', async (req, res) => {
  const user = await req.context.models.Blogger.findById(
    req.params.userId,
  );
  return res.send(user);
});

export default router;