/*
 * Connect to the database
 */
import mongoose from 'mongoose';
import { DB } from '../config';

export default function (callback) {
  if (process.env.NODE_ENV === 'production') {
    mongoose.connect(DB.production);
  }
  else if (process.env.NODE_ENV === 'test') {
    mongoose.connect(DB.test);
  }
  else {
    mongoose.connect(DB.development);
  }
  callback();
}
