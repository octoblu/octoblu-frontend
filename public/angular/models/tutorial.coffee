FLOW_TUTORIAL_1 = {
  'open_node_browser_for_weather' : [
    {
      text: "Welcome to the Octoblu designer."
    }
    {
      text: "You may end this tutorial at any time by deleting this flow."
    }
    {
      text: "Open the 'Configured Nodes' tab in the bottom drawer to see a list of activated nodes"
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
      text: "Add a weather node to your flow. You can do this by clicking on the weather node."
      buttons: false
      attachTo:
        element: '.flow-browser [data-type="channel:weather"]'
        on: 'top'
    }
  ]

  'select_weather_node': [
    {
      text: "Splendid! Click on the weather node to configure it."
      buttons: false
      attachTo:
        element: '.flow-editor-workspace .flow-node-channel-weather'
        on: 'top'
    }
  ]

  'configure_weather_node': [
    {
      text: "Type the name of a city in the city field. Then click outside the node to proceed."
      buttons: false
      attachTo:
        element: '[data-name="city"]'
        on: 'right'
    }
  ]
  'open_node_browser_for_email': [
    {
      text: "Wonderful! Now let's add another node from your configured nodes tray."
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
      text: "Click on the email node to add it to your flow."
      buttons: false
      attachTo:
        element: '.flow-browser [data-type="channel:email"]'
        on: 'top'
    }
  ]
  'select_email_node': [
    {
      text: "Click on the email node to configure it."
      buttons: false
      attachTo:
        element: '.flow-editor-workspace .flow-node-channel-email'
        on: 'top'
    }
  ]
  'configure_email_node_to': [
    {
      text: "Add an email address in the 'to:' field"
      buttons: false
      attachTo:
        element: '[data-name="to"]'
        on: 'right'
    }
  ]
  'configure_email_node_body': [
    {
      text: "In order to send the temperature, add {{msg.temperature}} to the 'body' field"
      buttons: false
      attachTo:
        element: '[data-name="body"]'
        on: 'right'
    }
  ]
  'link_weather_to_email': [
    {
      text: "Click and drag the line from the right side of the weather node to the left side of the email node. You can also drag nodes to position them."
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
      text: "Awesome! Let's open up the 'operator nodes' in the bottom drawer."
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
      text: "Now, click on the trigger node to add it to your flow."
      buttons: false
      attachTo:
        element: '.flow-browser [data-type="operation:trigger"]'
        on: 'top'
    }
  ]
  'link_trigger_to_weather': [
    {
      text: "Connect the trigger to your weather node."
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
      text: "Now, you can deploy your flow."
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
      text: "Click on the trigger to fire your flow and send an email with the weather!"
      buttons: false
    }
  ]
}

angular.module('octobluApp').constant 'FLOW_TUTORIAL_1', FLOW_TUTORIAL_1
