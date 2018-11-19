var User = require('../models/user')
const jwt = require('jsonwebtoken')

//Chai
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();
let chaiHttp = require('chai-http');
let app = require('../app.js');
chai.use(chaiHttp);

describe('User', () => {   
    let token = '' 
    let idUser = ''
    let idUser2 = ''
    let idUser3 = ''
    let newUser = {
        name: 'user',
        email: 'user123@test.com',
        password: '123456'
    }
    
    beforeEach((done) => {
        User.create({
          name : "User2",
          email : "user2@test.com",
          password : '123456'
        })
        .then(result=>{
            let newToken = jwt.sign({
                email : result.email,
                name : result.name,
                id : result._id
            }, process.env.JWT_SECRET)
            token = newToken
            idUser = result._id
            User.create({
                name : "User22",
                email : "user22@test.com",
                password : '123456'
            })
            .then((result2) => {
                idUser2 = result2._id
                User.create({
                    name : "User33",
                    email : "user33@test.com",
                    password : '123456'
                })
                .then((result3) => {
                    idUser3 = result3._id
                    User.updateOne({
                        _id: idUser
                    }, {
                        $push: {
                            subscribe: result3._id
                        }
                    })
                    .then((result4) => {
                        User.updateOne({
                            _id: result3._id
                        }, {
                            $push: {
                                subscriber: idUser
                            }
                        })
                        .then((result) => {
                            done();
                        })
                    })
                })
            })
        })
        .catch(err=>{
            console.log(err);
        });
    });

    it('Register/create new user', function(done) {
        chai
        .request(app)
        .post('/users')
        .send(newUser)
        .end(function (err, res) {            
            expect(res).to.have.status(201)
            res.body.data.should.have.property('name').eql(`user`)
            res.body.data.should.have.property('email').eql(`user123@test.com`)
            res.body.data.should.have.property('password')
            done()
        })
    });

    it('Register/create new user with empty field', function(done) {
        let failUser = {
            name: '',
            email: '',
            password: ''
        }
        chai
        .request(app)
        .post('/users')
        .send(failUser)
        .end(function (err, res) {           
            expect(res).to.have.status(500)
            res.body.should.have.property('errors')
            done()
        })
    });

    it('Register/create new user with same email', function(done) {
        let failUser = {
            name: 'user',
            email: 'user2@test.com',
            password: '123456'
        }
        chai
        .request(app)
        .post('/users')
        .send(failUser)
        .end(function (err, res) {            
            expect(res).to.have.status(400)
            res.body.should.have.property('message').eql(`Email Sudah Digunakan`)
            done()
        })
    });

    it('Register/create new user with wrong email format', function(done) {
        let failUser = {
            name: 'user',
            email: 'user12.test.com',
            password: '123456'
        }
        chai
        .request(app)
        .post('/users')
        .send(failUser)
        .end(function (err, res) {    
            expect(res).to.have.status(500)
            res.body.should.have.property('errors')
            res.body.errors.email.should.have.property('message').eql('Format Email Harus Sesuai')
            done()
        })
    });

    it('Register/create new user with 4 characters password', function(done) {
        let failUser = {
            name: 'user',
            email: 'user2111@test.com',
            password: '1234'
        }
        chai
        .request(app)
        .post('/users')
        .send(failUser)
        .end(function (err, res) {       
            expect(res).to.have.status(500)
            res.body.should.have.property('errors')
            res.body.errors.password.should.have.property('message').eql('Password Minimal 5 Karakter')
            done()
        })
    });

    it('Log in a users', (done) => {
        let userLogin = {
            email : "user2@test.com",
            password : '123456'
        };
        chai
        .request(app)
        .post('/users/login')
        .send(userLogin)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('token');
            res.body.should.have.property('msg').eql('Login berhasil');
            done();
        });
    });

    it('Log in a users with empty field', (done) => {
        let failLogin = {
            email : "",
            password : ''
        };
        chai
        .request(app)
        .post('/users/login')
        .send(failLogin)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('status').eql(false)
            res.body.should.have.property('msg').eql('email atau password salah');
            done();
        });
    });

    it('Log in a users with random password ', (done) => {
        let failLogin = {
            email : "user2@test.com",
            password : 'qwerty'
        };
        chai
        .request(app)
        .post('/users/login')
        .send(failLogin)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('msg').eql('password salah')
            done();
        });
    });

    it('Log in a users with user unregistered ', (done) => {
        let failLogin = {
            email : "user88@test.com",
            password : '123456'
        };
        chai
        .request(app)
        .post('/users/login')
        .send(failLogin)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.have.property('status').eql(false)
            res.body.should.have.property('msg').eql('email atau password salah');
            done();
        });
    });

    it('Get User info by token', (done) => {
        chai
        .request(app)
        .get('/users')
        .set('token', token)
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.have.property('articles')
            res.body.should.have.property('comments')
            res.body.should.have.property('_id')
            res.body.should.have.property('name')
            res.body.should.have.property('email')
            done()
        })
    })

    it('Get User info with wrong token', (done) => {
        let wrongToken = 'qwertyuiop123456789'
        chai
        .request(app)
        .get('/users')
        .set('token', wrongToken)
        .end((err, res) => {
            res.should.have.status(500)
            done()
        })
    })

    it('Subscribe User', (done) => {
        let author = {
            idAuthor: idUser2
        }
        chai
        .request(app)
        .post('/users/subscribe')
        .set('token', token)
        .send(author)
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object');
            res.body.should.have.property('msg').eql('Subscribed')
            done()
        })
    })

    it('UnSubscribe User', (done) => {
        let author = {
            idAuthor: idUser3
        }
        chai
        .request(app)
        .post('/users/unSubscribe')
        .set('token', token)
        .send(author)
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object');
            res.body.should.have.property('msg').eql('UnSubscribed')
            done()
        })
    })

    afterEach(function (done) {
        User.remove({}, function (err) {
            done()
        })
    })
})