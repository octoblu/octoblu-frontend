class StatusWidgetController
  constructor: ->
    setInterval @update, 5*60*1000
    @update()

  update: =>
    sp = new StatusPage.page page: 'c3jcws6d2z45'

    sp.incidents
      filter : 'unresolved'
      success: (data) =>
        incident = _.first data.incidents
        if incident?
          {name, impact} = incident
        else
          name = 'All Systems Operational'
          impact = 'none'

        @description = name
        @classes = {}
        @classes[impact] = true

angular.module('octobluApp').controller 'StatusWidgetController', StatusWidgetController
