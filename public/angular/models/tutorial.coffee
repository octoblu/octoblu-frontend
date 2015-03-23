FLOW_TUTORIAL_1 = {
  'add_weather_node': [
    {
      text: "Once upon a time, a user wanted to know what the weather was like."
    }
    {
      text: "This user opened their magical tray of 'Configured Nodes'"
      attachTo:
        element: '#btn-configured-nodes'
        on: 'top'
      tetherOptions:
        offset: '15px 0'
      advanceOn:
        selector: '#btn-configured-nodes, #btn-configured-nodes *'
        event: 'click'
      buttons: false
    }
    {
      text: "Then the user clicked on the magical weather node to cast it onto their flow."
      buttons: false
      attachTo:
        element: 'li[data-type="channel:weather"]'
        on: 'top'
    }
  ]
  'select_weather_node': [
    {
      text: '"What is this?" the user proclaimed as they clicked the weather node'
      buttons: false
      attachTo:
        element: 'g.flow-node-Weather'
        on: 'top'
    }
  ]
  'configure_weather_node': [
    {
      text: "The user, curious about this mysterious new-added node, decided to inscribe the name of a city into the enticing field labeled.....city"
      buttons: false
      attachTo:
        element: '[data-name="city"]'
        on: 'right'
    }
  ]
  'add_email_node': [
    {
      text: "Mad with power, the user quickly went back to the configured nodes and added an email node"
      buttons: false
    }
  ]
  'end_tutorial': [
    {
      text: "And the user lived happily ever after"
      buttons: false
    }
  ]
}

angular.module('octobluApp').constant 'FLOW_TUTORIAL_1', FLOW_TUTORIAL_1

