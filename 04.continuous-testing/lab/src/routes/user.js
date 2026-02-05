const express = require('express')
const userController = require('../controllers/user')

const userRouter = express.Router()

/**
 * @typedef User
 * @property {string} username.required
 * @property {string} firstname.required
 * @property {string} lastname.required
 */


/**
 * Create a new user
 * @route POST /user
 * @group User - Operations about user
 * @param {User.model} user.body.required - the new user
 * @returns {object} 201 - Success message
 * @returns {Error}  default - Unexpected error
 */


userRouter
  .post('/', (req, resp) => {
    userController.create(req.body, (err, res) => {
      let respObj
      if(err) {
        respObj = {
          status: "error",
          msg: err.message
        }
        return resp.status(400).json(respObj)
      }
      respObj = {
        status: "success",
        msg: res
      }
      resp.status(201).json(respObj)
    })
  })
  // .get('/:username', (req, resp, next) => { // Express URL params - https://expressjs.com/en/guide/routing.html
  //   // TODO Create get method API
  //   const username = req.params.username
  // })

/**
 * Get a user by username
 * @route GET /user/{username}
 * @group User - Operations about user
 * @param {string} username.path.required - username
 * @returns {object} 200 - User object
 * @returns {Error}  404 - User not found
 */

userRouter.get('/:username', (req, res) => {
  const username = req.params.username
  userController.get(username, (err, result) => {
    if (err) {
      return res.status(404).json({
        status: "error",
        msg: err.message
      })
    }
    return res.status(200).json({
      status: "success",
      msg: result
    })
  })
})


module.exports = userRouter
