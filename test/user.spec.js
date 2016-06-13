/* eslint-disable no-underscore-dangle */
import jwtSimple from 'jwt-simple';

import { SECRET_KEY } from '../config';
import './utils';
import User from '../server/models/User';

describe('User API', () => {
  it('requires a valid email on signup', (done) => {
    api.post('/api/accounts/register')
      .send({
        email: 'a',
        password: 'aaaaaa',
        name: 'Bob'
      })
      .expect(400, done);
  });

  it('requires a password on signup', (done) => {
    api.post('/api/accounts/register')
      .send({
        email: 'test@example.com',
        password: '',
        name: 'Bob'
      })
      .expect(400, done);
  });

  it('requires a name on signup', (done) => {
    api.post('/api/accounts/register')
      .send({
        email: 'test@example.com',
        password: '123456',
        name: ''
      })
      .expect(400)
      .end(done);
  });

  it('registers a user', (done) => {
    api.post('/api/accounts/register')
      .send({
        email: 'test@example.com',
        password: '123456',
        name: 'Bob'
      })
      .expect(201)
      .end(done);
  });

  it('fails authentication for invalid email and password', (done) => {
    api.post('/api/accounts/authenticate')
      .send({
        email: 'wrong@email.com',
        password: 'aaaaaa'
      })
      .expect(401)
      .end(done);
  });

  it('fails authentication for invalid email', (done) => {
    api.post('/api/accounts/authenticate')
      .send({
        email: 'wrong@email.com',
        password: '123456'
      })
      .expect(401)
      .end(done);
  });

  it('fails authentication for invalid password', (done) => {
    api.post('/api/accounts/authenticate')
      .send({
        email: 'testuser1@test.com',
        password: 'aaaaaa'
      })
      .expect(401)
      .end(done);
  });

  it('authenticates user', (done) => {
    api.post('/api/accounts/authenticate')
      .send({
        email: 'testuser1@test.com',
        password: '123456'
      })
      .expect((res) => {
        expect(res.body.token).to.exist();
      })
      .expect(200)
      .end(done);
  });

  it('returns 401 for unauthenticated user', (done) => {
    api.get('/api/accounts/account')
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('returns user data for authenticated user', (done) => {
    User.findOne({}, (err, user) => {
      api
        .get('/api/accounts/account')
        .set('Accept', 'application/json')
        .set({ Authorization: `JWT ${jwtSimple.encode(user, SECRET_KEY)}` })
        .expect(200)
        .expect((res) => {
          res.body.email.should.equal('testuser1@test.com');
          res.body.name.should.equal('Test Testerson');
          expect(res.body.postFrequency).to.deep.equal({
            sunday: true,
            saturday: true,
            friday: true,
            thursday: true,
            wednesday: true,
            tuesday: true,
            monday: true
          });
          res.body.postAmount.should.equal(3);
          res.body.postTime.should.equal(25200);
        })
        .end(done);
    });
  });
});
