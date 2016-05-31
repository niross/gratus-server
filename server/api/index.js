import { Router } from 'express';
import { appVersion } from '../../config';

import users from './users';

export default function() {
  const api = Router();

  // Expose the version number at the root
  api.get('/', (req, res) => {
    res.json({
      version: appVersion
    });
  });

  // Mount the users resource
  api.use('/accounts', users);

  return api;
}