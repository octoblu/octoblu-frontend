octobluDB = require '../lib/database'
_         = require 'lodash'
When      = require 'when'
uuidGenerator = require 'node-uuid'

UPDATE_PROPERTIES  = ['name', 'members']
PERMISSIONS_SUFFIX =
  sources: '_sources'
  targets: '_targets'

class Group
  constructor: (userUuid) ->
    @userUuid = userUuid
    @collection = octobluDB.getCollection 'groups'

  create: (name) =>
    uuid = uuidGenerator.v1()

    newGroup =
      uuid: uuid
      name: name
      resource:
          uuid: uuid
          owner:
            uuid: @userUuid
          type: 'group'
      members: []
      type: 'group'

    @collection.insert newGroup
      .then (results) =>
        _.first results

  ensureOperatorsGroup: =>
    @getOperatorsGroup().then (operatorsGroup) =>
        return operatorsGroup if operatorsGroup?

        uuid = uuidGenerator.v1()
        @collection.insert
            uuid: uuid
            name: 'operators'
            type: 'operators'
            resource:
              uuid: uuid
              owner:
                uuid: @userUuid
              type: 'group'
          .then (results) =>
            _.first results

  findByOptionalType: (type=null) =>
    query = 'resource.owner.uuid': @userUuid
    query.type = type if type?

    @collection.find query

  findByUuid: (uuid) =>
    @collection.findOne
      'uuid': uuid
      'resource.owner.uuid': @userUuid

  findByUuidWithoutRegardToOwner: (uuid) =>
    @collection.findOne 'resource.uuid': uuid

  findResourcePermission: (groupUUID, ownerUUID) =>
    group = undefined
    sourcePermissionsGroup = undefined
    targetPermissionsGroup = undefined

    @collection.findOne
      'uuid': groupUUID
      'resource.owner.uuid': ownerUUID

      .then (results) =>
        _.first results

    .then (dbGroup) =>
      throw new Error 'Group not found!' unless dbGroup?
      group = dbGroup
      @collection.find
        'type': 'permissions'
        'resource.owner.uuid': ownerUUID
        'resource.parent.uuid': groupUUID

    .then (permissionsGroups) =>
      throw new Error 'Permission groups not found' unless permissionsGroups?

      sourcePermissionsGroup = _.findWhere(permissionsGroups, name: group.uuid + Group.permissionsSuffix.sources)
      targetPermissionsGroup = _.findWhere(permissionsGroups, name: group.uuid + Group.permissionsSuffix.targets)

      ResourcePermission.findOne
        'resource.owner.uuid': ownerUUID
        'source.uuid': sourcePermissionsGroup.resource.uuid
        'target.uuid': targetPermissionsGroup.resource.uuid

    .then (resourcePermission) =>
      throw new Error 'Resource permission not found' unless resourcePermission?
      resourcePermission.source = sourcePermissionsGroup
      resourcePermission.target = targetPermissionsGroup
      resourcePermission

  findGroupsContainingResource: (resourceUUIDs) =>
    resourceUUIDs = [resourceUUIDs] unless _.isArray resourceUUIDs

    @collection.find 'members.uuid': {$in: resourceUUIDs}

  getOperatorsGroup: =>
    query =
      'resource.owner.uuid': @userUuid
      'type': 'operators'

    @collection.findOne query

  removeByUuid: (uuid) =>
    query =
      'uuid': uuid
      'resource.owner.uuid': @userUuid

    @collection.remove query, justOne: true

  update: (uuid, attributes) =>
    query = 'uuid': uuid, 'resource.owner.uuid': @userUuid
    attributes = _.pick attributes, 'name', 'members'

    @collection.update query, $set: attributes

module.exports = Group
