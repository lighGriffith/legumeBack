var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe('Utilisateurs', function() {
  it('user test basique', function(done) {
    chai.request(server)
        .get('/api/test')
        .end(function(err, res){
          //console.log(JSON.stringify(res))
          res.should.be.JSON;
          chai.expect(res).to.have.status(200);
          done();
        });
  });
});
