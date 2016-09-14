class StatusWidgetController
  constructor: (STATUS_PAGE_URL, STATUS_PAGE_ID) ->
    setInterval @update, 5*60*1000
    @page = STATUS_PAGE_ID
    @statusPageUrl = STATUS_PAGE_URL
    @update()

  update: =>
    sp = new StatusPage.page { @page }

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
