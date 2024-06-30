import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const messages = await req.context.models.Blogpost.find();
  return res.send(messages);
});

router.get('/:messageId', async (req, res) => {
  const message = await req.context.models.Blogpost.findById(
    req.params.messageId,
  );
  return res.send(message);
});

router.post('/', async (req, res, next) => {
  const message = await req.context.models.Blogpost.create({
    text: req.body.text,
    user: req.body.user,
    title: req.body.title,
    ifPublished: req.body.ifPublished,
  }).catch((error) => {
    error.statusCode = 400;
    next(error);
  });
  return res.send(message);
});   

router.delete('/:messageId', async (req, res) => {
  const message = await req.context.models.Blogpost.findByIdAndDelete(
    req.params.messageId,
  );

  return res.send(message);
});

router.put('/:messageId', async (req, res) => {
  const message = await req.context.models.Blogpost.findByIdAndUpdate(
    req.params.messageId,
    {text: req.body.text,
      title: req.body.title,
      image_url: req.body.image_url,
      ifPublished: req.body.ifPublished,},
  );

  return res.send(message);
});


export default router;