import User from '../server/models/User';

beforeEach((done) => {
  User.create({
    email: 'testuser1@test.com',
    password: '123456',
    name: 'Test Testerson'
  }, () => {
    done();
  });
});

afterEach((done) => {
  User.collection.remove();
  done();
});
