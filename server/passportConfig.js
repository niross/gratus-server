import { Strategy, ExtractJwt } from 'passport-jwt';

import User from './models/User';
import { SECRET_KEY } from '../config';

export default function (passport) {
  const opts = {
    secretOrKey: SECRET_KEY,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
  };

  passport.use(new Strategy(opts, (jwtPayload, done) => {
    User.findOne({ id: jwtPayload.id }, (err, user) => {
      if (err) return done(err, false);
      if (user) {
        done(null, user);
      }
      else {
        done(null, false);
      }
    });
  }));
}
