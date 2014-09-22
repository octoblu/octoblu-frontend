#!/usr/bin/env coffee
fs = require 'fs'
_  = require 'lodash'
commander = require 'commander'

class UrlParamGenerator
  constructor: (options={}) ->
    @channel_filename = options.channel_filename

  channel: =>
    JSON.parse fs.readFileSync 'github.json'

  run: =>
    channel = @channel()
    _.each channel.application.resources, (resource) =>
      params = _.filter resource.params, (param) => param.style != 'url'

      chunks = resource.path.split '/'
      chunks = _.filter chunks, (chunk) => chunk.indexOf(':') == 0

      new_params = _.map chunks, (chunk) =>
        name : chunk
        style : "url"
        type : "string"
        value : "",
        required : "true"

      resource.params = _.union params, new_params

    prettyChannel = JSON.stringify channel, null, 2
    fs.writeFileSync 'github.json', prettyChannel

commander
  .version 0.1
  .option '-f, --filename [path]',  'Path to the channel file to augment'
  .parse(process.argv);

commander.help() unless commander.filename?

generator = new UrlParamGenerator channel_filename: commander.filename
console.log generator.channel_filename
# generator.run()
