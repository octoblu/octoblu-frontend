fs = require 'fs'
async = require 'async'
_ = require 'lodash'

listJSONFiles = (path, callback) =>
  fs.readdir path, (error, files) =>
    return callback error if error
    foundFiles = []
    _.each files, (fileOrDir) =>
      filePath = path + '/' + fileOrDir
      stat = fs.statSync filePath
      foundFiles.push filePath if stat.isFile()
    callback null, foundFiles

describe 'Node Types', ->
  describe '#channels', ->
    beforeEach (done) ->
      directory = __dirname + '/../../assets/json/nodetypes/channel'
      listJSONFiles directory, (@error, @files) => done()

    describe 'when compiled into one file', ->
      beforeEach (done) ->
        validateFile = (file, callback) =>
          try
            JSON.parse fs.readFileSync file
            callback()
          catch error
            callback 'Unable to read or parse: ' + file
        files = async.map @files, validateFile, (@error, @results) => done()

      it 'should not have an error', ->
        expect(@error).to.not.exist

      it "should have the same number of results", ->
        expect(@results.length).to.equal @files.length 

  describe '#device', ->
    beforeEach (done) ->
      directory = __dirname + '/../../assets/json/nodetypes/device'
      listJSONFiles directory, (@error, @files) => done()

    describe 'when compiled into one file', ->
      beforeEach (done) ->
        validateFile = (file, callback) =>
          try
            JSON.parse fs.readFileSync file
            callback()
          catch error
            callback 'Unable to read or parse: ' + file
        files = async.map @files, validateFile, (@error, @results) => done()

      it 'should not have an error', ->
        expect(@error).to.not.exist

      it "should have the same number of results", ->
        expect(@results.length).to.equal @files.length
          
  