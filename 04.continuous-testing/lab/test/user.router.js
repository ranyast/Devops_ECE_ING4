const app = require('../src/index')
const chai = require('chai')
const chaiHttp = require('chai-http')
const db = require('../src/dbClient')
const userController = require('../src/controllers/user')

chai.use(chaiHttp)

describe('User REST API', () => {

    beforeEach(() => {
        // Clean DB before each test
        db.flushdb()
    })

    after(() => {
        app.close()
        db.quit()
    })

    describe('POST /user', () => {

        it('create a new user', (done) => {
            const user = {
                username: 'sergkudinov',
                firstname: 'Sergei',
                lastname: 'Kudinov'
            }
            chai.request(app)
                .post('/user')
                .send(user)
                .then((res) => {
                    chai.expect(res).to.have.status(201)
                    chai.expect(res.body.status).to.equal('success')
                    chai.expect(res).to.be.json
                    done()
                })
                .catch((err) => {
                    throw err
                })
        })

        it('pass wrong parameters', (done) => {
            const user = {
                firstname: 'Sergei',
                lastname: 'Kudinov'
            }
            chai.request(app)
                .post('/user')
                .send(user)
                .then((res) => {
                    chai.expect(res).to.have.status(400)
                    chai.expect(res.body.status).to.equal('error')
                    chai.expect(res).to.be.json
                    done()
                })
                .catch((err) => {
                    throw err
                })
        })
    })

    describe('GET /user', ()=> {

        it('get an existing user', (done) => {
            // 1. Création préalable via le controller pour avoir des données
            const user = {
                username: 'sergkudinov',
                firstname: 'Sergei',
                lastname: 'Kudinov'
            }

            userController.create(user, () => {
                // 2. Test de la route GET
                chai.request(app)
                    .get('/user/' + user.username)
                    .then((res) => {
                        chai.expect(res).to.have.status(200)
                        chai.expect(res.body.status).to.equal('success')
                        // Note: Redis stocke tout en string, parfois il faut faire attention aux types
                        chai.expect(res.body.data.firstname).to.equal(user.firstname)
                        chai.expect(res.body.data.lastname).to.equal(user.lastname)
                        done()
                    })
                    .catch((err) => {
                        throw err
                    })
            })
        })

        it('cannot get a user when it does not exist', (done) => {
            chai.request(app)
                .get('/user/invalid_user')
                .then((res) => {
                    chai.expect(res).to.have.status(404)
                    chai.expect(res.body.status).to.equal('error')
                    done()
                })
                .catch((err) => {
                    throw err
                })
        })
    })
})