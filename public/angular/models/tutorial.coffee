angular.module('octobluApp').constant 'FLOW_TUTORIAL_1', {
  step1:
    helpers: [
      {
        text: "Once upon a time, a user wanted to know what the weather was like."
      }
      {
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
        text: "Then the user clicked on the magical weather node to cast it onto their flow."
        buttons: false
      }
    ]
  step2:
    helpers: [
      {
        text: "And the user lived happily ever after"
        buttons: false
      }
    ]
      # {
      #   text: "With the weather node attached to their flow, the user can select the node to customize it."
      #   attachTo:
      #     element: 'g.flow-node-Weather'
      #     on: 'left'
      #   advanceOn:
      #     selector: 'g.flow-node-Weather'
      #     event: 'click'
      #   buttons: false
      # }
}
