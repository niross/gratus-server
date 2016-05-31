/* eslint-disable no-underscore-dangle */
import jwtSimple from 'jwt-simple';

import './utils';
import Post from '../server/models/Post';
import User from '../server/models/User';
import { SECRET_KEY } from '../config';

describe('Post API', () => {
  it('returns 401 for unauthenticated get request', (done) => {
    api.get('/api/posts')
      .expect(401, done);
  });

  it('returns 401 for unauthenticated post request', (done) => {
    api.post('/api/posts')
      .expect(401, done);
  });

  it('returns 401 for unauthenticated put request', (done) => {
    Post.findOne({}, (err, post) => {
      api.put(`/api/posts/${post._id}`)
        .expect(401, done);
    });
  });

  it('returns 401 for unauthenticated delete request', (done) => {
    Post.findOne({}, (err, post) => {
      api.delete(`/api/posts/${post._id}`)
        .expect(401, done);
    });
  });

  it('lists all posts', (done) => {
    User.findOne({}, (err, user) => {
      api
        .get('/api/posts')
        .set({ Authorization: `JWT ${jwtSimple.encode(user, SECRET_KEY)}` })
        .expect(200)
        .expect((res) => {
          res.body.length.should.equal(1);
        })
        .end(done);
    });
  });

  it('gets a post', (done) => {
    Post.findOne({}, (_, post) => {
      api.get(`/api/posts/${post._id}`)
        .set({ Authorization: `JWT ${jwtSimple.encode(post.user, SECRET_KEY)}` })
        .expect(200)
        .end((__, res) => {
          res.body._id.should.equal(post._id.toString());
          res.body.location.x.should.equal(post.location.x);
          res.body.location.y.should.equal(post.location.y);
          res.body.public.should.equal(post.public);
          res.body.text.should.equal(post.text);
          done();
        });
    });
  });

  it('creates a post', (done) => {
    User.findOne({}, (err, user) => {
      api.post('/api/posts')
        .set({ Authorization: `JWT ${jwtSimple.encode(user, SECRET_KEY)}` })
        .field('latitude', '-111')
        .field('longitude', '222')
        .field('public', '1')
        .field('text', 'This is a test')
        .attach('image', 'test/fixtures/test.png')
        .expect(200)
        .expect((res) => {
          res.body.location.x.should.equal(-111);
          res.body.location.y.should.equal(222);
          res.body.public.should.be.true();
          res.body.text.should.equal('This is a test');
        })
        .end(done);
    });
  });

  it('throws an error if the post text is not supplied', (done) => {
    User.findOne({}, (err, user) => {
      api.post('/api/posts')
        .set({ Authorization: `JWT ${jwtSimple.encode(user, SECRET_KEY)}` })
        .expect(400, done);
    });
  });

  it('throws an error if the image is not jpg/png', (done) => {
    User.findOne({}, (err, user) => {
      api.post('/api/posts')
        .set({ Authorization: `JWT ${jwtSimple.encode(user, SECRET_KEY)}` })
        .field('text', 'test post')
        .attach('image', 'test/fixtures/test.txt')
        .expect(400, done);
    });
  });

  it('deletes a post', (done) => {
    Post.findOne({}, (err, post) => {
      api.delete(`/api/posts/${post._id}`)
        .set({ Authorization: `JWT ${jwtSimple.encode(post.user, SECRET_KEY)}` })
        .expect(200, done);
    });
  });

  it('updates a post', (done) => {
    Post.findOne({}, (err, post) => {
      api.put(`/api/posts/${post._id}`)
        .set({ Authorization: `JWT ${jwtSimple.encode(post.user, SECRET_KEY)}` })
        .field('latitude', '-111')
        .field('longitude', '222')
        .field('public', '1')
        .field('text', 'updated text')
        .expect(200)
        .expect((res) => {
          res.body.location.x.should.equal(-111);
          res.body.location.y.should.equal(222);
          res.body.public.should.be.true();
          res.body.text.should.equal('updated text');
        })
        .end(done);
    });
  });
});
