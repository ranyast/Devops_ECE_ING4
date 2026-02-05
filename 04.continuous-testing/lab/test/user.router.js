const app = require('../src/index')
const chai = require('chai')
const chaiHttp = require('chai-http')
const db = require('../src/dbClient')

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

  // describe('GET /user', ()=> {
  //   // TODO Create test for the get method
  // })
    describe('GET /user', () => {
        it('successfully get user', (done) => {
            const user = { username: 'sergkudinov', firstname: 'sergei', lastname: 'kudinov' }
            // On crée l'utilisateur d'abord
            chai.request(app)
                .post('/user')
                .send(user)
                .then(() => {
                    // Puis on essaie de le récupérer
                    chai.request(app)
                        .get('/user/' + user.username)
                        .then((res) => {
                            chai.expect(res).to.have.status(200) // Ajout de "chai." devant expect
                            chai.expect(res.body.status).to.equal('success')
                            chai.expect(res.body.msg).to.deep.equal(user)
                            done()
                        })
                        .catch((err) => done(err)) // Important pour éviter le timeout en cas d'erreur
                })
                .catch((err) => done(err))
        })

        it('cannot get a user when it does not exist', (done) => {
            chai.request(app)
                .get('/user/unknown')
                .then((res) => {
                    chai.expect(res).to.have.status(404) // Ajout de "chai." devant expect
                    chai.expect(res.body.status).to.equal('error')
                    done()
                })
                .catch((err) => done(err))
        })
    })
})
