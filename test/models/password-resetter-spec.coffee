octobluDB = require '../../app/lib/database'
PasswordResetter = null

describe 'PasswordResetter', ->
  beforeEach ->
    octobluDB.createConnection()
    PasswordResetter = require '../../app/models/password-resetter'
    @sut = new PasswordResetter()

  describe '#resetByEmail', ->
    describe 'when the email does not exist', ->
      it 'should reject the result with a "user not found" error', ->
        return expect(@sut.resetByEmail('')).to.be.rejectedWith('user not found')

