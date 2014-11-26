#!/usr/bin/env coffee
fs        = require 'fs'
url       = require 'url'
_         = require 'lodash'
commander = require 'commander'
prettyCamel = require 'pretty-camel'

class ParseDSL
  constructor: (@options={}) ->
    @channel_filename = @options.channel_filename

  channel: =>
    JSON.parse fs.readFileSync @channel_filename

  run: =>
    channel = @channel()

    _.each channel.application.resources, (resource) =>
      unless resource.params
        resource.params = []
      @names = _.pluck resource.params, 'name'
      _.each resource.params, (param) ->
        return unless param.stuff?
        _.each param.stuff, (para) ->
          [name,flags,displayName,enums,defaultValue] = para.split ':'
          style = 'body'
          type = 'string'
          if /i/.test flags
            type = 'integer'
          if /b/.test flags
            type = 'boolean'
          if /o/.test flags
            type = 'object'
          if /q/.test flags
            style = 'query'
          displayName = displayName || prettyCamel(name)
          newParam = {
            name: name
            displayName: displayName
            style: style
            type: type
          }
          newParam.displayName += " ( #{enums.split(',').join(' / ')} )" if enums
          newParam.default = defaultValue if defaultValue
          newParam.required = true if /r/.test(flags)
          resource.params.push newParam

      resource.params = _.reject resource.params, (param) ->
        param.stuff?

    prettyChannel = JSON.stringify channel, null, 2
    if @options.dry_run
      console.log prettyChannel
    else
      fs.writeFileSync @channel_filename, prettyChannel

commander
  .version 0.1
  .option '-f, --filename [path]',  'Path to the channel file to augment'
  .option '-t, --test',  'Dry Run'
  .parse(process.argv);

commander.help() unless commander.filename?

converter = new ParseDSL channel_filename: commander.filename, dry_run: commander.test
converter.run()
