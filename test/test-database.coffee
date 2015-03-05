nodefn    = require 'when/node/function'
_         = require 'lodash'
USE_MONGO = process.env.USE_MONGO == 'true'

console.log "================================================"
console.log "  using #{if USE_MONGO then 'mongo' else 'nedb'}"
console.log "================================================"

class TestDatabase
  @open: (callback=->) =>
    if USE_MONGO
      mongojs = require 'mongojs'
      db = mongojs 'octoblu-test', ['users']
      db.users.remove (error) =>
        callback error, @wrap(db)
    else
      Datastore = require 'nedb'
      datastore = new Datastore
        inMemoryOnly: true
        autoload: true
        onload: => callback null, @wrap({users: datastore})
  
  @wrap: (database) =>
    users:
      find:    nodefn.lift(_.bind(database.users.find,    database.users))
      findOne: nodefn.lift(_.bind(database.users.findOne, database.users))
      remove:  nodefn.lift(_.bind(database.users.remove,  database.users))
      insert:  nodefn.lift(_.bind(database.users.insert,  database.users))
      update:  nodefn.lift(_.bind(database.users.update,  database.users))

module.exports = TestDatabase
