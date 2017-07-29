var request = require('supertest');
describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('./server/server');
  });
  afterEach(function () {
    server.close();
  });
  it('responds to /', function testSlash(done) {
  request(server)
    .get('/')
    .expect(200, done);
  });
  it('responds to /logout', function testSlash(done) {
  request(server)
    .get('/logout')
    .expect(200, done);
  });
  it('responds to /status', function testSlash(done) {
  request(server)
    .get('/status')
    .expect(200, done);
  });
  it('responds to /users', function testSlash(done) {
  request(server)
    .get('/users')
    .expect(200, done);
  });
  it('responds to /edificio', function testSlash(done) {
  request(server)
    .get('/edificio')
    .expect(200, done);
  });
  it('responds to /edificio/:edificio_id', function testSlash(done) {
  request(server)
    .get('/edificio/:edificio_id')
    .expect(200, done);
  });
  it('responds to /estatistica/edificio/:edificio_id', function testSlash(done) {
  request(server)
    .get('/estatistica/edificio/:edificio_id')
    .expect(200, done);
  });
  it('responds to /estatistica/setor/:setor', function testSlash(done) {
  request(server)
    .get('/estatistica/setor/:setor')
    .expect(200, done);
  });
  it('responds to /map', function testSlash(done) {
  request(server)
    .get('/map')
    .expect(200, done);
  });
  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foooo')
      .expect(404, done);
  });
});
