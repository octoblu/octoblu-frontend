#!/usr/bin/env coffee
fs = require 'fs'
_  = require 'lodash'
commander = require 'commander'

class UrlBuilder
  constructor: (options={}) ->
    @channel_filename = options.channel_filename

  channel: =>
    JSON.parse fs.readFileSync @channel_filename

  run: =>
    channel = @channel()
    base_uri = channel.application.base
    _.each channel.application.resources, (resource) =>
      resource.url = "#{base_uri}#{resource.path}"

    prettyChannel = JSON.stringify channel, null, 2
    fs.writeFileSync @channel_filename, prettyChannel

commander
  .version 0.1
  .option '-f, --filename [path]',  'Path to the channel file to augment'
  .parse(process.argv);

commander.help() unless commander.filename?

builder = new UrlBuilder channel_filename: commander.filename
builder.run()
