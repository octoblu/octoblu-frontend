angular.module('schemaForm').config (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) ->
  endpointSelector = (name, schema, options) ->
    if schema.type == 'string' and name == 'endpoint'
      form = schemaFormProvider.stdFormObj(name, schema, options)
      form.key = options.path
      form.type = 'endpoint-selector'
      options.lookup[sfPathProvider.stringify(options.path)] = form
      return form

  schemaFormProvider.defaults.string.unshift endpointSelector

  #Add to the bootstrap directive
  schemaFormDecoratorsProvider.addMapping 'bootstrapDecorator', 'endpoint-selector', '/angular/directives/angular-schema-endpoint-selector/endpoint-selector.html'
  schemaFormDecoratorsProvider.createDirective 'endpointSelector'
