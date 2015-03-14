Group = require '../models/group-model'

class GroupController
  getGroups: (request, response) =>
    group = new Group request.user.resource.uuid
    group.find request.query.type
      .then (groups) =>
        res.send groups
      .catch (error) =>
        res.status(500).send error.message

  getGroupById: (request, response) =>
    group = new Group request.user.resource.uuid
    group.findByUuid request.params.uuid
      .then (group) =>
        return response.status(404).send() unless group?
        response.send group
      .catch (error) =>
        res.status(500).send error.message

  addGroup: (request, response) =>
    group = new Group request.user.resource.uuid
    group.create request.body.name
      .then (device) =>
        response.send device
      .catch (error) =>
        response.status(500).send error.message

  deleteGroup: (request, response) =>
    group = new Group request.user.resource.uuid
    group.removeByUuid request.params.uuid
      .then =>
        response.status(204).send()
      .catch (error) =>
        response.status(500).send error.message

  updateGroup: (request, response) =>
    uuid = request.params.uuid
    group = new Group request.user.resource.uuid
    group.findByUuid uuid
      .then (group) =>
        return response.status(404).send() unless group?

        group.update(request.params.uuid, request.body).then response.status(204).send
      .catch (error) =>
        response.status(500).send error.message

  getOperatorsGroup: (request, response) =>
    group = new Group request.user.resource.uuid
    group.ensureOperatorsGroup()
      .then group.getOperatorsGroup
      .then (operatorsGroup) =>
        response.send operatorsGroup
      .catch (error) =>
        response.status(500).send error.message

  getGroupsContainingResource: (request, response) =>
    group = new Group request.user.resource.uuid
    group.findGroupsContainingResource(req.params.uuid)
      .then (groups) =>
        response.send groups
      .catch (error) =>
        res.status(500).send error.message

module.exports = GroupController
