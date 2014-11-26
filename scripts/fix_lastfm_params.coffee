#!/usr/bin/env coffee
fs        = require 'fs'
url       = require 'url'
_         = require 'lodash'
commander = require 'commander'
prettyCamel = require 'pretty-camel'

class FixLastFmParams
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
      parsedUri = url.parse(resource.url, true)
      _.each parsedUri.query, (method, key) =>
        resource.params = _.reject resource.params, {name: key}
        return if _.contains(@names, method)
        resource.params = _.reject resource.params, {name: 'Content-Type'}
        resource.params.push {
          "name": key,
          "default": method,
          "displayName": prettyCamel(method),
          "style": "body",
          "type": "string",
          "hidden": true,
          "required": true
        }
        console.log resource.params

    prettyChannel = JSON.stringify channel, null, 2
    fs.writeFileSync @channel_filename, prettyChannel

commander
  .version 0.1
  .option '-f, --filename [path]',  'Path to the channel file to augment'
  .parse(process.argv);

commander.help() unless commander.filename?

converter = new FixLastFmParams channel_filename: commander.filename
converter.run()
