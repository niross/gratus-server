import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: (email) =>
      /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  website: {
    type: String,
    validate: (url) =>
      /^(http|ftp|https):\/\/[\w-]+(\.[\w-]*)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?/.test(url)
  },
  postFrequency: {
    monday: {
      type: Boolean,
      default: true
    },
    tuesday: {
      type: Boolean,
      default: true
    },
    wednesday: {
      type: Boolean,
      default: true
    },
    thursday: {
      type: Boolean,
      default: true
    },
    friday: {
      type: Boolean,
      default: true
    },
    saturday: {
      type: Boolean,
      default: true
    },
    sunday: {
      type: Boolean,
      default: true
    }
  },
  postAmount: {
    type: Number,
    min: 1,
    max: 10,
    default: 3
  },
  postTime: { // Stored as seconds since 00:00:00
    type: Number,
    min: 1,
    max: 86400,
    default: 25200 // 7am
  },
  created: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', function (next) {
  const user = this;
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, (saltErr, salt) => {
      if (saltErr) return next(saltErr);
      bcrypt.hash(user.password, salt, (hashErr, hash) => {
        if (hashErr) return next(hashErr);
        user.password = hash;
        next();
      });
    });
  }
  else {
    return next();
  }
});

UserSchema.methods.comparePassword = function (passwd, cb) {
  bcrypt.compare(passwd, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/** Only return certain fields in json responses */
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    return {
      email: ret.email,
      name: ret.name,
      website: ret.website,
      postFrequency: ret.postFrequency,
      postAmount: ret.postAmount,
      postTime: ret.postTime,
      created: ret.created
    };
  }
});

export default mongoose.model('User', UserSchema);
