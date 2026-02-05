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

    // Save to DB (HMSET pour enregistrer un hash)
    // On utilise le username comme clé
    db.hmset(user.username, userObj, (err, res) => {
      if (err) return callback(err, null)
      callback(null, res) // Return callback
    })
  },

  get: (username, callback) => {
    // Validation du paramètre
    if(!username)
      return callback(new Error("Username is required"), null)

    // Récupération depuis la DB (HGETALL pour récupérer tout le hash)
    db.hgetall(username, (err, res) => {
      if (err) return callback(err, null)

      // Si res est null ou vide, l'utilisateur n'existe pas
      if (!res) return callback(new Error("User not found"), null)

      // On retourne l'objet trouvé
      callback(null, res)
    })
  }
}