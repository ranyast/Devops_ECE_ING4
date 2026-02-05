const express = require('express')
const userController = require('../controllers/user')

const userRouter = express.Router()

/**
 * @typedef User
 * @property {string} username.required - The user's unique username
 * @property {string} firstname.required - The user's first name
 * @property {string} lastname.required - The user's last name
 */

userRouter
    /**
     * Create a new user
     * @route POST /user
     * @group User - Operations about user
     * @param {User.model} user.body.required - The user object
     * @returns {object} 201 - User created successfully
     * @returns {Error}  400 - Wrong parameters
     */
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
    /**
     * Get a user by username
     * @route GET /user/{username}
     * @group User - Operations about user
     * @param {string} username.path.required - The username of the user
     * @returns {object} 200 - User object found
     * @returns {Error}  404 - User not found
     */
    .get('/:username', (req, resp, next) => {
      const username = req.params.username

      userController.get(username, (err, res) => {
        let respObj
        if(err) {
          // Si l'utilisateur n'est pas trouvé ou autre erreur
          respObj = {
            status: "error",
            msg: err.message
          }
          return resp.status(404).json(respObj)
        }

        // Succès
        respObj = {
          status: "success",
          data: res
        }
        resp.status(200).json(respObj)
      })
    })

module.exports = userRouter