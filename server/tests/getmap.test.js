
const request = require('supertest');

 describe('GET /map/:id', function(){
    it('Should get this map', function(done){
      request('https://mapperman.herokuapp.com/api')
          .get('/map/6446c521d2b32508b63f2a28')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
    }) 
    it('Should not find a map', function(done){
      request('https://mapperman.herokuapp.com/api')
          .get('/map/kasdfkjasgdfkjhasgdflkajsdfh')
          .expect(400)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
    }) 
})