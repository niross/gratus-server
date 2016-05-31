import express from 'express';
import multer from 'multer';
import passport from 'passport';

import Post from '../models/Post';

const router = express.Router();
const upload = multer({ dest: './uploads/' });

/**
 * Create an object of the post fields for creating or updating the post model
 * @param req - the request object
 * @returns {Object} - key value pairs
 */
function parsePostBody(req) {
  return {
    user: req.user,
    location: {
      x: req.body.latitude,
      y: req.body.longitude
    },
    public: req.body.public,
    text: req.body.text
  };
}

/**
 * Read in the image data from the put/post request
 * @param req - request object
 * @returns {Object}
 */
function parseImageData(req) {
  return {
    image: {
      mimetype: req.file.mimetype,
      path: req.file.path,
      name: req.file.originalname
    }
  };
}

router.route('/')
  .get(passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.find({ user: req.user }, (err, posts) => {
      if (err) res.json({ error: err });
      res.status(200).json(posts);
    });
  })

  .post(passport.authenticate('jwt', { session: false }), upload.single('image'), (req, res) => {
    if (!req.body.text || req.body.text === '') {
      return res.status(400).json({
        error: 'Please enter something you are grateful for.'
      });
    }

    const postData = parsePostBody(req);

    if (req.file) {
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({
          error: 'The image field must contain a valid image'
        });
      }
      Object.assign(postData, parseImageData(req));
    }

    const post = new Post(postData);
    post.save((err) => {
      if (err) res.json({ error: err });
      res.json(post);
    });
  });

router.route('/:postId')
  .get(passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findOne({ _id: req.params.postId, user: req.user }, (err, post) => {
      if (err) res.status(404).json({ error: err });
      res.json(post);
    });
  })

  .put(passport.authenticate('jwt', { session: false }), upload.single('image'), (req, res) => {
    const putData = parsePostBody(req);
    if (req.file) {
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({
          error: 'The image field must contain a valid image'
        });
      }
      Object.assign(putData, parseImageData(req));
    }
    else {
      putData.image = null;
    }

    Post.findOneAndUpdate({ _id: req.params.postId }, putData, { new: true }, (err, post) => {
      if (err) res.status(404).json({ error: err });
      res.json(post);
    });
  })

  .delete(passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.remove({ _id: req.params.postId }, (err) => {
      if (err) res.status(404).json({ error: err });
      res.json({ message: 'OK' });
    });
  });

export default router;
