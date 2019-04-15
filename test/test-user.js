var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var User = require('../models/user');
const addContext = require('mochawesome/addContext');
chai.use(chaiHttp);
var ind=0;
describe('Utilisateurs', function() {

  before(function (done) {
      User.deleteMany({}, function(err) {
        if(!err){
          console.log('suppression des utilisateurs OK');
          done();
        }else{
          console.log('suppression des utilisateurs KO');
        }
      });
    });
  beforeEach(function(done){
        ind=ind+1;
        done();
      });

      it('ajout utilisateur avec succés.', function(done) {
        var me=this;
        var valeurEntree={
            "username": "quentinnn",
            "password": "quentinnn",
            "email":"quentin"+ind+"@gmail.com",
            "lat"     : "12,234567",
            "lng"    :"12,234567",
            "telephone"    : "0990298378",
            "isFermier" :true
          };
          addContext(me, {
                  title: 'entrée /api/signup' ,
                  value: valeurEntree
              });
        chai.request(server)
            .post('/api/signup')
            .send(valeurEntree)
              .end(function(err, res) {
                addContext(me, {
                        title: 'output /api/signup' ,
                        value: res.body
                    });
                if (err) done(err);
                res.should.be.JSON;
                res.body.should.have.property('success');
                chai.expect(res.body.success).to.equal(true);
                done();
                 });
      });

      it('ajout utilisateur mauvais username', function(done) {
        var me=this;
        var valeurEntree={
            "username": "q",
            "password": "quentin"+ind,
            "email":"quentin"+ind+"@gmail.com",
            "lat"     : "12,234567",
            "lng"    :"12,234567",
            "telephone"    : "0990298378",
            "isFermier" :true
          };
          addContext(me, {
                  title: 'entrée /api/signup' ,
                  value: valeurEntree
              });
        chai.request(server)
            .post('/api/signup')
            .send(valeurEntree)
              .end(function(err, res) {
                addContext(me, {
                        title: 'output /api/signup' ,
                        value: res.body
                    });
                if (err) done(err);
                res.should.be.JSON;
                res.body.should.have.property('success');
                chai.expect(res.body.success).to.equal(false);
                res.body.should.have.property('error');
                res.body.error.should.have.property('type');
                chai.expect(res.body.error.type).to.equal("validation");
                res.body.error.should.have.property('liste_erreur');
                chai.expect(res.body.error.liste_erreur).to.be.an('array');
                res.body.error.liste_erreur.should.have.property('0');
                res.body.error.liste_erreur['0'].should.have.property('field');
                chai.expect(res.body.error.liste_erreur['0'].field).to.equal('username');
                done();
                 });
      });

      it('ajout utilisateur mauvais password', function(done) {
        var me=this;
        var valeurEntree={
            "username": "quentin"+ind,
            "password": "q",
            "email":"quentin"+ind+"@gmail.com",
            "lat"     : "12,234567",
            "lng"    :"12,234567",
            "telephone"    : "0990298378",
            "isFermier" :true
          };
          addContext(me, {
                  title: 'entrée /api/signup' ,
                  value: valeurEntree
              });
        chai.request(server)
            .post('/api/signup')
            .send(valeurEntree)
              .end(function(err, res) {
                addContext(me, {
                        title: 'output /api/signup' ,
                        value: res.body
                    });
                if (err) done(err);
                res.should.be.JSON;
                res.body.should.have.property('success');
                chai.expect(res.body.success).to.equal(false);
                res.body.should.have.property('error');
                res.body.error.should.have.property('type');
                chai.expect(res.body.error.type).to.equal("validation");
                res.body.error.should.have.property('liste_erreur');
                chai.expect(res.body.error.liste_erreur).to.be.an('array');
                res.body.error.liste_erreur.should.have.property('0');
                res.body.error.liste_erreur['0'].should.have.property('field');
                chai.expect(res.body.error.liste_erreur['0'].field).to.equal('password');
                done();
                 });
      });

      it('ajout utilisateur mauvais email', function(done) {
        var me=this;
        var valeurEntree={
            "username": "quentin"+ind,
            "password": "quentin"+ind,
            "email":"quentin"+ind+"",
            "lat"     : "12,234567",
            "lng"    :"12,234567",
            "telephone"    : "0990298378",
            "isFermier" :true
          };
          addContext(me, {
                  title: 'entrée /api/signup' ,
                  value: valeurEntree
              });
        chai.request(server)
            .post('/api/signup')
            .send(valeurEntree)
              .end(function(err, res) {
                addContext(me, {
                        title: 'output /api/signup' ,
                        value: res.body
                    });
                if (err) done(err);
                res.should.be.JSON;
                res.body.should.have.property('success');
                chai.expect(res.body.success).to.equal(false);
                res.body.should.have.property('error');
                res.body.error.should.have.property('type');
                chai.expect(res.body.error.type).to.equal("validation");
                res.body.error.should.have.property('liste_erreur');
                chai.expect(res.body.error.liste_erreur).to.be.an('array');
                res.body.error.liste_erreur.should.have.property('0');
                res.body.error.liste_erreur['0'].should.have.property('field');
                chai.expect(res.body.error.liste_erreur['0'].field).to.equal('email');
                done();
                 });
      });

      it('récupération du token après création d\'un utilisateur.', function(done) {
        var me=this;
        chai.request(server)
            .post('/api/signin')
            .send({"username":"quentinnn","password":"quentinnn"})
            .end(function(err, res) {
              addContext(me, {
                      title: 'output /api/signin' ,
                      value: res.body
                  });
                if (err) done(err);
                res.should.be.JSON;
                res.body.should.have.property('success');
                res.body.should.have.property('token');
                chai.expect(res.body.success).to.equal(true);
                done();
                 });
      });


});
