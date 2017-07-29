var request = require('supertest');
describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('./server/server');
  });
  afterEach(function () {
    server.close();
  });
  it('responds to /register', function testSlash(done) {
  request(server)
    .post('/register')
    .send({
      username: 'newUser',
      password: 'myPassword'
    })
    .expect(200, done);
  });
 });