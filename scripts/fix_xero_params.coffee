#!/usr/bin/env coffee
fs        = require 'fs'
url       = require 'url'
_         = require 'lodash'
commander = require 'commander'
prettyCamel = require 'pretty-camel'

class FixXeroParams
  constructor: (options={}) ->
    @channel_filename = options.channel_filename

  channel: =>
    JSON.parse fs.readFileSync @channel_filename

  run: =>
    channel = @channel()

    _.each channel.application.resources, (resource) =>
      unless resource.params
        resource.params = []
      @names = _.pluck resource.params, 'name'
      _.each resource.params, (param) ->
        return if param.displayName?
        param.displayName = prettyCamel(param.name)

    prettyChannel = JSON.stringify channel, null, 2
    fs.writeFileSync @channel_filename, prettyChannel

commander
  .version 0.1
  .option '-f, --filename [path]',  'Path to the channel file to augment'
  .parse(process.argv);

commander.help() unless commander.filename?

converter = new FixXeroParams channel_filename: commander.filename
converter.run()
