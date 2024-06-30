import { v4 as uuidv4 } from 'uuid';
import { Router } from 'express';

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

router.post('/', async (req, res, next) => {
  const message = await req.context.models.Blogcomment.create({
    text: req.body.text,
    user: req.body.user,
    post: req.body.post,
  }).catch((error) => {
    error.statusCode = 400;
    next(error);
  });
  return res.send(message);
});   

router.delete('/:messageId', async (req, res) => {
  const message = await req.context.models.Blogcomment.findByIdAndDelete(
    req.params.messageId,
  );

  return res.send(message);
});

router.put('/:messageId', async (req, res) => {
  const message = await req.context.models.Blogcomment.findByIdAndUpdate(
    req.params.messageId,
    {text: req.body.text},
  );

  return res.send(message);
});


export default router;