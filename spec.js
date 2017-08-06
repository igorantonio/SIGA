var request = require('supertest');
describe('loading express', function () {
  beforeEach(function () {
    delete require.cache[require.resolve('./server/server')];
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
  it('responds to /edificio', function testSlash(done) {
  request(server)
    .get('/edificio')
    .expect(200, done);
  });
  it('responds to /edificio/:edificio_id', function testSlash(done) {
  request(server)
    .get('/edificio/597cfaf02ad4752b3414e375')
    .expect(200, done);
  });
  it('responds to /estatistica/edificio/:edificio_id', function testSlash(done) {
  request(server)
    .get('/estatistica/edificio/597cfa802ad4752b3414e374')
    .expect(200, done);
  });
  it('responds to /estatistica/setor/:setor', function testSlash(done) {
  request(server)
    .get('/estatistica/setor/A')
    .expect(200, done);
  });

  // POST ROUTES
  it('responds to /register', function testPath(done) {
    request(server)
      .post('/register')
      .send({
        username: 'newUser',
        password: 'myPassword'
      })
      .expect(200, done);
  });
  it('responds to /login', function testPath(done) {
    request(server)
      .post('/login')
      .send({
        username: 'newUser',
        password: 'myPassword'
      })
      .expect(200, done);
  });
  it('responds to /edificio/:edificio_id/geolocalizacao', function testPath(done) {
    request(server)
      .post('/edificio/597cfa802ad4752b3414e374/geolocalizacao')
      .send({
        latitude: '-7.216076',
        longitude: '-35.911609'
      })
      .expect(200, done);
  });
  it('responds to /edificio/:edificio_id/consumo/new', function testPath(done) {
    request(server)
      .post('/edificio/597cfaf02ad4752b3414e375/consumo/new')
      .send({
        data: '2012-04-23T18:25:43.511Z',
        consumo: '500',
        novoConsumo: '1000'
      })
      .expect(200, done);
  });
  it('responds to /edificio', function testPath(done) {
    request(server)
      .post('/edificio')
      .send({
        nome: 'Bloco BD',
        descricao: 'Bloco padrao com 1 andar',
        atividade: 'Edificio focado em aulas do curso engenharia quimica',
        caracteristicasFisicas: {
          localizacao: { setor: 'B', bloco: 'BD' },
          area: '200',
          n_pavimentos: '1',
          ocupacaoMedia: '100',
          n_baciasSanitarias: '15',
          n_torneiras: '10',
          n_duchas: '0',
          n_chuveiros: '0',
          n_pias: '10',
          volumeReservatorio: '100'
        },
        mediaEsperada: '22',
        historicoConsumo: [{data: '2017-07-23T18:25:43.511Z', consumo: '200' }],
        geolocalizacao: {latitude: '-7.216273', longitude: '-35.910783'},
      })
      .expect(200, done);
  });
  it('responds to /edificio/:edificio_id', function testPath(done) {
    request(server)
      .post('/edificio/597cfaf02ad4752b3414e375')
      .send({
        nome: 'ADUFCG',
        descricao: 'Bloco padrao com 2 andares',
        atividade: 'Sede da Adufcg',
        caracteristicasFisicas: {
          localizacao: { setor: 'A', bloco: 'AG' },
          area: '200',
          n_pavimentos: '1',
          ocupacaoMedia: '100',
          n_baciasSanitarias: '15',
          n_torneiras: '10',
          n_duchas: '0',
          n_chuveiros: '0',
          n_pias: '10',
          volumeReservatorio: '100'
        },
        historicoConsumo: [{data: '2017-07-23T18:25:43.511Z', consumo: '200' }],
        geolocalizacao: {latitude: '-7.215940', longitude: '-35.910783'},
      })
      .expect(200, done);
  });
  it('responds to /edificio/:edificio_id/vazamentos/new', function testPath(done) {
    request(server)
      .post('/edificio/597cfaf02ad4752b3414e375/vazamentos/new')
      .send({
        data: '2012-04-23T18:25:43.511Z',
        volume: '20'
      })
      .expect(200, done);
  });

  // WRONG ROUTES
  it('404 for inexistent routes', function testPath(done) {
    request(server)
      .get('/foooo')
      .expect(404, done);
  });
  it('400 for wrong edificio info at creation', function testPath(done) {
    request(server)
      .post('/edificio')
      .send({
        descricao: 'Bloco padrao com 1 andar',
        atividade: 'Edificio focado em aulas do curso engenharia quimica',
        caracteristicasFisicas: {
          localizacao: { setor: 'B', bloco: 'BD' },
          area: '200',
          n_pavimentos: '1',
          ocupacaoMedia: '100',
          n_baciasSanitarias: '15',
          n_torneiras: '10',
          n_duchas: '0',
          n_chuveiros: '0',
          n_pias: '10',
          volumeReservatorio: '100'
        },
        mediaEsperada: '22',
        historicoConsumo: [{data: '2017-07-23T18:25:43.511Z', consumo: '200' }],
        geolocalizacao: {latitude: '-7.216273', longitude: '-35.910783'},
      })
      .expect(400, done);
  });
  it('400 for wrong edificio info at geolocation edition', function testPath(done) {
    request(server)
      .post('/edificio/597cfa802ad4752b3414e374/geolocalizacao')
      .send({
        longitude: '-35.911609'
      })
      .expect(400, done);
  });
  it('400 for null data at consumo', function testPath(done) {
    request(server)
      .post('/edificio/597cfaf02ad4752b3414e375/consumo/new')
      .send({
        consumo: '500',
        novoConsumo: '1000'
      })
      .expect(400, done);
  });
  it('400 for empty body at vazamentos', function testPath(done) {
    request(server)
      .post('/edificio/597cfaf02ad4752b3414e375/vazamentos/new')
      .send({
        volume: '20'
      })
      .expect(400, done);
  });
});