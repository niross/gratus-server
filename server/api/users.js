import express from 'express';
import jwtSimple from 'jwt-simple';
import passport from 'passport';

import { SECRET_KEY } from '../../config';
import User from '../models/User';

const router = express.Router();

router.route('/register')
  .post((req, res) => {
    // Ensure valid email was provided
    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    const user = new User({
      email: req.body.email,
      password: req.body.password,
      name: req.body.name
    });

    user.save((err) => {
      if (err) return res.status(400).json({ error: 'Email address already exists' });
      res.status(201).json(
        Object.assign({ token: `JWT ${jwtSimple.encode(user, SECRET_KEY)}` }, user.toObject())
      );
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
            res.json(
              Object.assign({ token: `JWT ${jwtSimple.encode(user, SECRET_KEY)}` }, user.toObject())
            );
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
