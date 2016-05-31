import mongoose from 'mongoose';
import './User';

const PostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    x: Number,
    y: Number
  },
  image: {
    mimetype: String,
    path: String,
    name: String
  },
  public: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    required: true
  }
});

export default mongoose.model('Post', PostSchema);
