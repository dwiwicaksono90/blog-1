const User = require('../models/user')
const Article = require('../models/article')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

//chai
var chai = require('chai')
var assert = chai.assert
var expect = chai.expect
var should = chai.should()
var chaiHttp = require('chai-http')
let app = require('../app.js')
chai.use(chaiHttp)

describe('Article', () => {
    let idUser = ''
    let idArticle = ''
    let token = ''
    let newUser = {
        name: 'user',
        email: 'user@test.com',
        password: '123456'
    }
    
    beforeEach((done) => {
        User.create(newUser)
        .then((result) => {
        idUser = result._id
        let newToken = jwt.sign({
            email : result.email,
            name : result.name,
            id : result._id
        }, process.env.JWT_SECRET)
            token = newToken
        Article.create({
            title : "Kopi",
            text : "lorem ipsum",
            author : result._id,
            img : 'https://storage.googleapis.com/ecomerce.ndiw.online/154200328014359964a21e1a07150266556.jpg'
        })
        .then(result2=>{            
            idArticle = result2._id;
            done();
        })
        })
        .catch((err) => {
        console.log(err);
        });
    })

    it('Show all the articles', (done) => {
        chai
        .request(app)
        .get('/articles')
        .end((err, res) => {
            expect(res).to.have.status(200)
            // res.body.should.have.property('errors')
            res.body.should.be.a('array');
        done();
        });
    });

    it('find Article by Id', (done) => {
        chai
        .request(app)
        .get(`/articles/${idArticle}`)
        .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        done()
        })
    })

    it('search Article by Title', (done) => {
        chai
        .request(app)
        .get(`/articles/search/kopi`)
        .end((err, res) => {        
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('result')
        done()
        })
    })

    it(`Create a new article`, (done)=> {    
        let article = {
        title: 'kopitest',
        text: 'kopikopikopi',
        img: 'https://storage.googleapis.com/ecomerce.ndiw.online/154200328014359964a21e1a07150266556.jpg'
        }
        chai
        .request(app)
        .post('/articles')
        .send(article)
        .set('token', token)
        .end((err, res) => {
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.should.have.property('result')
        res.body.should.have.property('msg').eql('add article success')
        done()
        })
    })

    it(`Create a new article with empty field`, (done)=> {    
        let failArticle = {
        title: '',
        text: '',
        img: ''
        }
        chai
        .request(app)
        .post('/articles')
        .send(failArticle)
        .set('token', token)
        .end((err, res) => {
            res.should.have.status(500)
            res.body.should.be.a('object')
            res.body.should.have.property('errors')
            done()
        })
    })

    it(`Create a new article with random token`, (done)=> {    
        let failArticle = {
            title: 'kopitest',
            text: 'kopikopikopi',
            img: 'https://storage.googleapis.com/ecomerce.ndiw.online/154200328014359964a21e1a07150266556.jpg'
        }
        let wrongToken = 'qwertyuiop1234567890'
        chai
        .request(app)
        .post('/articles')
        .send(failArticle)
        .set('token', wrongToken)
        .end((err, res) => {
            res.should.have.status(500)
            done()
        })
    })

    it('Show All My articles', (done) => {
        chai
        .request(app)
        .get('/articles/my')
        .set('token', token)
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('array')
            done()
        })
    })

    it('update/edit my article', (done) => {
        let updateArticle = {
            title: 'kopi edit',
            img: 'blablabla',
            text: 'llalalalalala'
        }
        chai
        .request(app)
        .put(`/articles/${idArticle}`)
        .set('token', token)
        .send(updateArticle)
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('msg').eql('Edit Article Success')
            done()
        })
    })

    it('update/edit my article with empty field', (done) => {
        let updateArticle = {
            title: '',
            img: '',
            text: ''
        }
        chai
        .request(app)
        .put(`/articles/${idArticle}`)
        .set('token', token)
        .send(updateArticle)
        .end((err, res) => {
            res.should.have.status(500)
            res.body.should.have.property('msg').eql('Kolom Harus Diisi Semua!')
            done()
        })
    })

    it('delete my article', (done) => {
        chai
        .request(app)
        .delete(`/articles/${idArticle}`)
        .set('token', token)
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('msg').eql('Article Deleted')
            done()
        })
    })

    it('delete my article with wrong token', (done) => {
        chai
        .request(app)
        .delete(`/articles/${idArticle}`)
        .set('token', 'qwertyuiop1234567890')
        .end((err, res) => {
            res.should.have.status(500)
            done()
        })
    })

    it('read article by id article', (done) => {
        chai
        .request(app)
        .get(`/articles/${idArticle}`)
        .end((err, res) => {            
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('title').eql('Kopi')
            res.body.should.have.property('text').eql('lorem ipsum')
            done()
        })
    })

    it('search article by query', (done) => {
        chai
        .request(app)
        .get(`/articles/search/kopi`)
        .end((err, res) => {         
            res.should.have.status(200)
            res.body.result.should.be.a('array')
            done()
        })
    })

    it('get popular article', (done) => {
        chai
        .request(app)
        .get(`/articles/popular`)
        .end((err, res) => {    
            res.should.have.status(200)
            res.body.should.be.a('array')
            done()
        })
    })
  
    afterEach((done) => { 
        Article.remove({}, (err) => {
            User.remove({}, err=>{
                done();
            })
        });
    });
})