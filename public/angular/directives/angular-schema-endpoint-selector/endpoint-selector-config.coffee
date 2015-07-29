angular.module('schemaForm').config [
  'schemaFormProvider'
  'schemaFormDecoratorsProvider'
  'sfPathProvider'
  (schemaFormProvider, schemaFormDecoratorsProvider, sfPathProvider) ->

    endpointSelector = (name, schema, options) ->
      if schema.type == 'string' and name == 'endpoint'
        f = schemaFormProvider.stdFormObj(name, schema, options)
        console.log 'schema', schema, f
        f.key = options.path
        f.type = 'endpoint-selector'
        options.lookup[sfPathProvider.stringify(options.path)] = f
        return f

    schemaFormProvider.defaults.string.unshift endpointSelector

    #Add to the bootstrap directive
    schemaFormDecoratorsProvider.addMapping 'bootstrapDecorator', 'endpoint-selector', '/angular/directives/angular-schema-endpoint-selector/endpoint-selector.html'
    schemaFormDecoratorsProvider.createDirective 'endpointSelector'
]
