import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import passport from 'passport';
import passportConfig from './passportConfig';

import db from './db';
import middleware from './middleware';
import api from './api';

const app = express();

// Add cors middleware
app.use(cors({ exposedHeaders: ['Link'] }));

// JSON response middleware
app.use(bodyParser.json({ limit: '100kb' }));

// Authentication
app.use(passport.initialize());

// Add passport configuration
passportConfig(passport);

// Form handling middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to db
db(() => {
  app.use(middleware());

  // API router
  app.use('/api', api());
});

// error handlers

// development error handler - will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler - no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

// export default app;
module.exports = app;
