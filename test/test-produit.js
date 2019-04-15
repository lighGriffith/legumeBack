var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();
var User = require('../models/user');
const addContext = require('mochawesome/addContext');
chai.use(chaiHttp);
var ind=0;
var token=undefined;
var user=undefined;
describe('Produits', function() {
  before(function (done) {
    var me=this;
      User.deleteMany({}, function(err) {
        if(!err){
          var valeurEntree={
              "username": "quentinnn",
              "password": "quentinnn",
              "email":"quentin"+ind+"@gmail.com",
              "lat"     : "12,234567",
              "lng"    :"12,234567",
              "telephone"    : "0990298378",
              "isFermier" :true
            };
          console.log('suppression des utilisateurs OK');
          chai.request(server)
              .post('/api/signup')
              .send(valeurEntree)
                .end(function(err, res) {
                  addContext(me, {
                          title: 'output /api/signup' ,
                          value: res.body
                      });
                  if (err) done(err);
                  user=res.body.user;
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
                          token=res.body.token;
                          chai.expect(res.body.success).to.equal(true);
                          done();
                           });
                   });
        }else{
          console.log('suppression des utilisateurs KO');
        }
      });
    });
  beforeEach(function(done){
        ind=ind+1;
        done();
      });

      it('ajout produit avec succés.', function(done) {
        var me=this;
        var valeurEntree={
            nom: "carotte",
            quantite: 10,
            prix: 3
        }
          addContext(me, {
                  title: 'entrée user/quentinn/produit' ,
                  value: valeurEntree
              });
        chai.request(server)
            .post('user/quentinn/produit')
            .set('authorization',token)
            .send(valeurEntree)
              .end(function(err, res) {
                addContext(me, {
                        title: 'output /user/quentinnn/produit' ,
                        value: res.body
                    });
                if (err) done(err);
                res.should.be.JSON;
                res.body.should.have.property('success');
                chai.expect(res.body.success).to.equal(true);
                done();
                 });
      });







});
