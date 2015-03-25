FLOW_TUTORIAL_1 = {
  'open_node_browser_for_weather' : [
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
  ]

  'add_weather_node': [
    {
      text: "Then the user clicked on the magical weather node to cast it onto their flow."
      buttons: false
      attachTo:
        element: '.flow-browser .flow-node-channel-weather'
        on: 'top'
    }
  ]

  'select_weather_node': [
    {
      text: '"What is this?" the user proclaimed as they clicked the weather node'
      buttons: false
      attachTo:
        element: '.flow-editor-workspace .flow-node-channel-weather'
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
  'open_node_browser_for_email': [
    {
      text: 'The user once again opened their magical tray of "Configured Nodes"'
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
  ]
  'add_email_node': [
    {
      text: "Mad with power, the user quickly went back to the configured nodes and added an email node"
      buttons: false
      attachTo:
        element: '.flow-browser .flow-node-channel-email'
        on: 'top'
    }
  ]
  'select_email_node': [
    {
      text: '"What is this?" the user proclaimed as they clicked the email node'
      buttons: false
      attachTo:
        element: '.flow-editor-workspace .flow-node-channel-email'
        on: 'top'
    }
  ]
  'configure_email_node_to': [
    {
      text: "fairy tale speak entered something into the 'to' field"
      buttons: false
      attachTo:
        element: '[data-name="to"]'
        on: 'right'
    }
  ]
  'configure_email_node_body': [
    {
      text: "Possessed with a strange desire to enter text with strange symbols, the user entered {{msg.temperature}} into the body field of the email node"
      buttons: false
      attachTo:
        element: '[data-name="body"]'
        on: 'right'
    }
  ]
  'link_weather_to_email': [
    {
      text: "The user pointed at the small gray square on the right side of the weather node. Holding his mouse button down, he conjoured a magical snake that he, uh, connected to the email node"
      buttons: false
      tetherOptions:
        offset: '15px 0'
      attachTo:
        element: '.flow-editor-workspace .flow-node-channel-weather .flow-node-output-port'
        on: 'top'
    }
  ]
  'open_operation_browser_for_trigger' : [
    {
      text: "The user, curious about other buttons, clicked the 'operation nodes' button"
      attachTo:
        element: '#btn-operation-nodes'
        on: 'top'
      tetherOptions:
        offset: '15px 0'
      advanceOn:
        selector: '#btn-operation-nodes, #btn-operation-nodes *'
        event: 'click'
      buttons: false
    }
  ]
  'add_trigger_node': [
    {
      text: "Clicking randomly, the user added a trigger node"
      buttons: false
      attachTo:
        element: '.flow-browser .flow-node-trigger'
        on: 'top'
    }
  ]
  'link_trigger_to_weather': [
    {
      text: '"Hocus pocus!"" Chanted the user slowly and rhythmically. As if in a trance, the user summoned another snake from the output port on the trigger and attached it to the weather node'
      buttons: false
      tetherOptions:
        offset: '15px 0'
      attachTo:
        element: '.flow-editor-workspace .flow-node-trigger .flow-node-output-port'
        on: 'top'
    }
  ]
  'deploy_flow': [
    {
      text: "Then the user deployed the flow and lived happily ever after"
      buttons: false
      tetherOptions:
        offset: '-20px 10px'
      attachTo:
        element: 'button.start-button'
        on: 'left'
    }
  ]
  'end_tutorial': [
    {
      endTutorial: true
      text: "You have completed your magical journey. Live long and prosper."
      buttons: false
      tetherOptions:
        offset: '-20px 10px'
      attachTo:
        element: '[data-action="delete-flow"]'
        on: 'left'
    }
  ]
}

angular.module('octobluApp').constant 'FLOW_TUTORIAL_1', FLOW_TUTORIAL_1

