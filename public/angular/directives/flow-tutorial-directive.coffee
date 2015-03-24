class FlowTutorialDirective
  constructor: (@scope, @element, @attributes) ->
    observer = new MutationObserver @showStep
    observer.observe @element[0],
      childList: true
      subtree: true
      attributes: true
      attributeFilter: ['class']

  link: =>
    @scope.$watch 'steps', @start

  start: (steps) =>
    @tour?.cancel()
    @currentStep = null
    @steps = _.cloneDeep steps
    @nextStep()

  nextStep: =>
    return if _.isEmpty @steps
    @currentStep = @steps.shift()
    @showStep()

  showStep: =>
    return unless @currentStep?
    return if @tour?.getCurrentStep()?.isOpen()

    return unless @domReady()

    @tour?.cancel()
    @tour = new Shepherd.Tour defaults: classes: 'shepherd-theme-dark'
    @tour.addStep @currentStep.id, @currentStep
    @tour.on 'complete', @nextStep
    @tour.show()

  domReady: =>
    return true unless @currentStep.attachTo?
    elements = @element.find @currentStep.attachTo.element
    return false if _.isEmpty elements

    animatedElements = @element.find '.ng-animate'
    return _.isEmpty animatedElements


angular.module('octobluApp')
.directive 'tutorial', ->
  restrict: 'A'
  controller: 'FlowTutorialController'
  link: (scope, element, attributes) =>
    directive = new FlowTutorialDirective scope, element, attributes
    directive.link()

