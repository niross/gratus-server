import express from 'express';
import jwtSimple from 'jwt-simple';
import passport from 'passport';

import { SECRET_KEY } from '../../config';
import User from '../models/User';

const router = express.Router();

router.route('/register')
  .post((req, res) => {
    const user = new User({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name
    });

    user.save((err) => {
      if (err) return res.status(400).json({ error: 'Email address already exists' });
      res.status(201).json();
    });
  });

router.route('/authenticate')
  .post((req, res) => {
    User.findOne({
      email: req.body.email
    }, (err, user) => {
      if (err) return res.status(500).json();
      if (!user) {
        res.status(401).json({ error: 'Invalid username or password' });
      }
      else {
        user.comparePassword(req.body.password, (err, isMatch) => {
          if (err) return res.status(500).json();
          if (isMatch) {
            res.json({ token: `JWT ${jwtSimple.encode(user, SECRET_KEY)}` });
          }
          else {
            res.status(401).json({ error: 'Invalid username or password' });
          }
        });
      }
    });
  });

router.route('/account')
  .get(passport.authenticate('jwt', { session: false }), (req, res) =>
    res.json(req.user)
  );

export default router;