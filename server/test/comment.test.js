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

describe('Comment', () => {
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

    it('Comment article', (done) => {
        let komen = {
            comment: 'leh ugha'
        }
        chai
        .request(app)
        .post('/comments')
        .send(komen)
        .set('token', token)
        .end((err, res) => {
            expect(res).to.have.status(201)
            res.body.should.be.a('object');
            done();
        });
    });

    it('Comment article with wrong token', (done) => {
        let komen = {
            comment: 'leh ugha'
        }
        chai
        .request(app)
        .post('/comments')
        .send(komen)
        .set('token', 'qwertyuiopasdfghjklzxcvbnm1234567890')
        .end((err, res) => {
            expect(res).to.have.status(500)
            done();
        });
    });

    it('Comment article with empty field', (done) => {
        let komen = {
            comment: ''
        }
        chai
        .request(app)
        .post('/comments')
        .send(komen)
        .set('token', token)
        .end((err, res) => {
            expect(res).to.have.status(500)
            res.body.should.be.a('object');
            res.body.should.have.property('errors')
            res.body.errors.comment.should.have.property('message').eql('Komen Harus Diisi')
            done();
        });
    });
  
    afterEach((done) => { 
        Article.remove({}, (err) => {
            User.remove({}, err=>{
                done();
            })
        });
    });
})