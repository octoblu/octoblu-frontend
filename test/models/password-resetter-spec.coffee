octobluDB = require '../../app/lib/database'
PasswordResetter = null
User = null

describe 'PasswordResetter', ->
  beforeEach ->
    octobluDB.createConnection()
    User = require '../../app/models/user'
    PasswordResetter = require '../../app/models/password-resetter'
    @sut = new PasswordResetter()

  describe '#resetByEmail', ->
    describe 'when the email does not exist', ->
      it 'should reject the result with a "user not found" error', ->
        expect(@sut.resetByEmail('')).to.be.rejectedWith('user not found')

    describe 'when the email does exist', ->
      beforeEach ->
        User.createLocalUser({email: 'foo@bar.com', password: 'abc123'})

      xit 'should set the resetPasswordToken', ->
        User.findByEmail('foo@bar.com').then (user) ->
          expect(user.resetPasswordToken).to.exist

