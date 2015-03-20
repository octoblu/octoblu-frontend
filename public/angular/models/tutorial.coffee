FLOW_TUTORIAL_1 = [
    {
      id: "intro"
      text: "Once upon a time, a user wanted to know what the weather was like."
    }
    {
      id: 'open_configured_nodes'
      text: "This user opened their magical tray of 'Configured Nodes'"
      attachTo:
        element: 'button[tooltip="Configured Nodes"]'
        on: 'top'
      tetherOptions:
        offset: '50px 20px'
      advanceOn:
        selector: 'button[tooltip="Configured Nodes"]'
        event: 'click'
      buttons: false
    }
    {
      id: 'add_weather_node'
      text: "Then the user clicked on the magical weather node to cast it onto their flow."
      buttons: false
    }
    {
      id: 'end_tutorial'
      text: "And the user lived happily ever after"
    }
  ]

angular.module('octobluApp').constant 'FLOW_TUTORIAL_1', FLOW_TUTORIAL_1

