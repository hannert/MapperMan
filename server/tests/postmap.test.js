
const request = require('supertest');

 describe('POST /newmap', function(){
    it('Should post the map', function(done){
      request('https://mapperman.herokuapp.com/api')
          .post('/newmap')
          .send(
            {
            name: "Dinagat Islands",
            owner: {
                "email": "TestingAccount@gmail.com"
            },
            mapData: 
            {
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [125.6, 10.1]
              },
              "properties": {
                "name": "Dinagat Islands"
              }
            }
          }
          )
          .expect(201)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
        }) 
    it('Should reject this request', function(done){
      request('https://mapperman.herokuapp.com/api')
          .post('/newmap')
          .send(
            {
                name: "Shouldn't Work",
                owner: {
                "email": "Not a real email"
            },
            mapData: 
            {
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [125.6, 10.1]
              },
              "properties": {
                "name": "Dinagat Islands"
              }
            }
            }
            
            
            )
          .expect(400)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
    })
})