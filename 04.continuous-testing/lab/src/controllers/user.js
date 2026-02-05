const db = require('../dbClient')

module.exports = {
  create: (user, callback) => {
    // Check parameters
    if(!user.username)
      return callback(new Error("Wrong user parameters"), null)
    // Create User schema
    const userObj = {
      firstname: user.firstname,
      lastname: user.lastname,
    }
    // Save to DB
    // TODO check if user already exists
    db.hmset(user.username, userObj, (err, res) => {
      if (err) return callback(err, null)
      callback(null, res) // Return callback
    })
  },
  get(username, callback) {
    if (!username) return callback(new Error("Username is required"), null)

    // hgetall permet de récupérer toutes les propriétés de l'objet stocké dans Redis
    db.hgetall(username, (err, res) => {
      if (err) return callback(err, null)
      if (res) {
        // On rajoute le username dans l'objet car il n'est pas stocké dans les champs du hash
        res.username = username
        callback(null, res)
      } else {
        callback(new Error("User not found"), null)
      }
    })
  }
  // get: (username, callback) => {
  //   // TODO create this method
  // }
}
