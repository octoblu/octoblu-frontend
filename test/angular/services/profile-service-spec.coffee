# describe 'ProfileService', ->
#   beforeEach ->
#     module 'email-password', ($provide) =>
#       @http = post: sinon.stub()
#       $provide.value '$http', @http
#       $provide.constant 'PROFILE_URI', '#'
#       return

#     inject ($q, $rootScope, ProfileService) =>
#       @q = $q
#       @rootScope = $rootScope
#       @sut = ProfileService

#   describe '->register', ->
#     describe 'when called', ->
#       beforeEach ->
#         @http.post.returns @q.when(data: {callbackUrl: 'something.biz'})
#         @sut.register 'taft@president.org', 'bathtub', 'underwater.dive'
#         @rootScope.$digest()

#       it 'should post to signup.octoblu.com with the email and password', ->
#         url = '#/devices'
#         params =
#           email: 'taft@president.org'
#           password: 'bathtub'
#           callbackUrl: 'underwater.dive'
#         expect(@http.post).to.have.been.calledWith url, params

#     describe 'when called and the service rejects', ->
#       beforeEach (done) ->
#         @http.post.returns @q.reject({data: 'you done screwed up'})
#         @sut.register 'complicated', 'dolphin', 'rockslide.gz'
#             .catch (@errorMessage) => done()
#         @rootScope.$digest()

#       it 'should reject the promise and return the error', ->
#         expect(@errorMessage).to.equal 'you done screwed up'

#     describe 'when called and the service resolves', ->
#       beforeEach (done) ->
#         @http.post.returns @q.when(data: {callbackUrl: 'die.cool'})
#         @sut.register 'crippling', 'insecurity', 'sucked-out'
#             .then (@result) => done()
#         @rootScope.$digest()

#       it 'should reject the promise and return the error', ->
#         expect(@result).to.equal 'die.cool'
