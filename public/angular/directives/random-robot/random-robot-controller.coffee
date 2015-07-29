class RandomRobotController
  luckyRobotNumber = Math.floor(1 + (Math.random() * 9))
  randomRobot: ()->
    "//cdn.octoblu.com/robots/robot#{luckyRobotNumber}.png"

angular.module('octobluApp').controller 'RandomRobotController', RandomRobotController
