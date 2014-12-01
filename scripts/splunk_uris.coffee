#!/usr/bin/env coffee
fs         = require 'fs'
url        = require 'url'
_          = require 'lodash'
commander  = require 'commander'
changeCase = require 'change-case'
csv        = require 'fast-csv'
stream     = fs.createReadStream 'scripts/splunk_api_list.csv'
endpoints  = {}

class TitleCaseParams
  constructor: (options={}) ->
    @channel_filename = options.channel_filename

  channel: =>
    JSON.parse fs.readFileSync @channel_filename

  run: =>
    channel = @channel()

    _.each channel.application.resources, (resource) =>
      method = resource.httpMethod.toUpperCase()
      endpoint = resource.path

      resource.displayName = endpoints["#{method} #{endpoint}"] || 'REPLACEME'
      console.log resource.displayName


    prettyChannel = JSON.stringify channel, null, 2
    fs.writeFileSync @channel_filename, prettyChannel

commander
  .version 0.1
  .option '-f, --filename [path]',  'Path to the channel file to augment'
  .parse(process.argv);

commander.help() unless commander.filename?

converter = new TitleCaseParams channel_filename: commander.filename

csv.fromStream(stream, {headers : ['endpoint', 'desc']}).on('data', (data) ->
  _.each [['GET', 'Get'], ['POST', 'Update'], ['DELETE', 'Delete']], (stuff) ->
    method = stuff[0]
    description = stuff[1]
    endpoints["#{method} /#{data.endpoint}"] = description + ' ' + changeCase.titleCase data.desc
).on 'end', ->
  converter.run()
