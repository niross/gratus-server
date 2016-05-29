import { Router } from 'express';
import { appVersion } from '../../config';

export default function () {
  const api = Router();

  // Expose the version number at the root
  api.get('/', (req, res) => {
    res.json({
      version: appVersion
    });
  });

  return api;
}
