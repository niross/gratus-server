import Post from '../server/models/Post';
import User from '../server/models/User';

beforeEach((done) => {
  User.create({
    email: 'testuser1@test.com',
    password: '123456',
    name: 'Test Testerson'
  }, (err, user) => {
    Post.create({
      user,
      location: {
        x: -999,
        y: 888
      },
      public: true,
      text: 'Test 1 message'
    }, () => done());
  });
});

beforeEach((done) => {
  User.create({
    email: 'testuser2@test.com',
    password: '123456',
    name: 'Bob Boberson'
  }, (err, user) => {
    Post.create({
      user,
      location: {
        x: -222,
        y: 333
      },
      public: false,
      text: 'Test 2 message'
    }, () => done());
  });
});

afterEach((done) => {
  Post.collection.remove();
  User.collection.remove();
  done();
});
