class CoordinatesService
  constructor: () ->

  transform : (svgElement,x,y) =>
    transformPoint = svgElement.createSVGPoint()
    transformPoint.x = x
    transformPoint.y = y
    transformPoint = transformPoint.matrixTransform(svgElement.getScreenCTM().inverse())
    {
      x: transformPoint.x
      y: transformPoint.y
    }

angular.module('octobluApp').service 'CoordinatesService', CoordinatesService
