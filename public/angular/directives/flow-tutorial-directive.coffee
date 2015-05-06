class FlowTutorialDirective
  constructor: (@scope, @element, @attributes) ->
    observer = new MutationObserver @showStep
    observer.observe @element[0],
      childList: true
      subtree: true
      attributes: true
      attributeFilter: ['class', 'transform']
      attributeOldValue: true

  link: =>
    @scope.$watch 'steps', @start

  cleanup: =>
    @tour?.cancel()
    Shepherd.currentTour?.cancel()

  start: (steps) =>
    @tour?.cancel()
    @currentStep = null
    @steps = _.cloneDeep steps
    @nextStep()

  nextStep: =>
    return if _.isEmpty @steps
    @currentStep = @steps.shift()
    @showStep()

  showStep: (mutations) =>
    return unless @currentStep?
    return if @mutationWasOnlyShepherd mutations
    return unless @domReady()

    @cleanup()
    @tour = new Shepherd.Tour defaults: classes: 'shepherd-theme-dark flow-tutorial-shepherd'
    Shepherd.currentTour = @tour
    @tour.addStep @currentStep.id, _.cloneDeep(@currentStep)
    @tour.on 'complete', @nextStep
    @tour.show()

  domReady: =>
    return true unless @currentStep.attachTo?

    elements = @element.find @currentStep.attachTo.element
    return _.any elements

  mutationWasOnlyShepherd: (mutations) =>
    return _.any mutations, (mutation) =>
      oldValues = mutation.oldValue?.split?(' ') ? []
      newValues = mutation.target?.className?.split?(' ') ? []
      differences = _.xor oldValues, newValues

      _.any differences, (value) => _.startsWith value, 'shepherd'

angular.module('octobluApp')
.directive 'tutorial', ->
  restrict: 'A'
  controller: 'FlowTutorialController'
  link: (scope, element, attributes) =>
    directive = new FlowTutorialDirective scope, element, attributes
    directive.link()

    scope.$on '$destroy', ->
      directive.cleanup()
