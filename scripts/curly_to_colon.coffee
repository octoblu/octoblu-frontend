#!/usr/bin/env coffee
fs = require 'fs'
_  = require 'lodash'
commander = require 'commander'

class CurlyToColonConverter
  constructor: (options={}) ->
    @channel_filename = options.channel_filename

  channel: =>
    JSON.parse fs.readFileSync @channel_filename

  run: =>
    channel = @channel()
    _.each channel.application.resources, (resource) =>
      _.each resource, (value, key) =>
        return unless _.isString value
        value = value.replace /\{(.*?)\}/g, (full, param) => ":#{param}"
        resource[key] = value

    prettyChannel = JSON.stringify channel, null, 2
    fs.writeFileSync @channel_filename, prettyChannel

commander
  .version 0.1
  .option '-f, --filename [path]',  'Path to the channel file to augment'
  .parse(process.argv);

commander.help() unless commander.filename?

converter = new CurlyToColonConverter channel_filename: commander.filename
converter.run()
