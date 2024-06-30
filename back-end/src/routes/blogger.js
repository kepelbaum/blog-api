import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const users = await req.context.models.Blogger.find();
  return res.send(users);
});

router.post('/', async (req, res) => {
  const user = await req.context.models.Blogger.create({
    username: req.body.username,
    password: req.body.password,
  }).catch((error) => {
    error.statusCode = 400;
    next(error);
  });

  // await user.save();
  return res.send(user);
});

router.delete('/:userId', async (req, res) => {
  const user = await req.context.models.Blogger.findByIdAndDelete(
    req.params.userId,
  );

  return res.send(user);
});

router.put('/:userId', async (req, res) => {
  const user = await req.context.models.Blogger.findByIdAndUpdate(
    req.params.userId,
    {password: req.body.password},
  );

  return res.send(user);
});

router.get('/:userId', async (req, res) => {
  const user = await req.context.models.Blogger.findById(
    req.params.userId,
  );
  return res.send(user);
});

export default router;