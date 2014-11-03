#!/usr/bin/env coffee
fs = require 'fs'
_  = require 'lodash'
commander = require 'commander'

class AddMissingURLParams
  constructor: (options={}) ->
    @channel_filename = options.channel_filename

  channel: =>
    JSON.parse fs.readFileSync @channel_filename

  run: =>
    channel = @channel()
    matches = []

    _.each channel.application.resources, (resource) =>
      unless resource.params
        resource.params = []
      @names = _.pluck resource.params, 'name'
      matches = resource.url.match /\:([\w-_]*)/g
      matches = matches.slice 1, matches.length
      _.each matches, (match) =>
      		return if _.contains @names, match
      		resource.params.push {
      		    "name": match,
      		    "style": "url",
      		    "type": "string",
      		    "value": "",
      		    "required": true
      		}

    prettyChannel = JSON.stringify channel, null, 2
    fs.writeFileSync @channel_filename, prettyChannel

commander
  .version 0.1
  .option '-f, --filename [path]',  'Path to the channel file to augment'
  .parse(process.argv);

commander.help() unless commander.filename?

converter = new AddMissingURLParams channel_filename: commander.filename
converter.run()
