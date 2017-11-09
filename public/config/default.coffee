return if location.hostname in ['localhost', 'app.octoblu.com', 'app.runnable.octoblu.com', 'app.octoblu-staging.com']
protocol = location.protocol.replace(/\W*$/,'')
hostname = location.hostname.split('.')[1..-1].join('.')

port = '80'
port = '443' if protocol == 'https'
console.log 'using octoblu-dev env'
angular.module('octobluApp')
  .constant 'AUTHENTICATOR_URIS', {
    EMAIL_PASSWORD: "#{protocol}://email-password-site.#{hostname}"
  }
  .constant 'SERVICE_UUIDS', {
    TRIGGER: 'b560b6ee-c264-4ed9-b98e-e3376ce6ce64',
    INTERVAL: '11d64fbe-1633-4e56-ade8-3517e0ff3bae',
    CREDENTIALS: 'c339f6ce-fe26-4788-beee-c97605f50403'
  }
  .constant 'CLUSTER_DOMAIN', '#{hostname}'
  .constant 'BLUPRINTER_URL', 'https://bluprinter.#{hostname}'
  .constant 'CONNECTOR_DETAIL_SERVICE_URL', "#{protocol}://connector.#{hostname}"
  .constant 'FLOW_DEPLOY_SERVICE_URL', 'https://nanocyte-flow-deploy.#{hostname}'
  .constant 'FLOW_LOGGER_UUID', 'none'
  .constant 'GATEBLU_LOGGER_UUID', 'none'
  .constant 'INTERCOM_APPID', 'thuyk9s6'
  .constant 'MESHBLU_FIREHOSE_HOSTNAME', "meshblu-firehose-socket-io.#{hostname}"
  .constant 'MESHBLU_FIREHOSE_PORT', port
  .constant 'MESHBLU_FIREHOSE_PROTOCOL', protocol
  .constant 'MESHBLU_HOST', "meshblu.#{hostname}"
  .constant 'MESHBLU_PORT', port
  .constant 'MESHBLU_PROTOCOL', protocol
  .constant 'OAUTH_PROVIDER', "#{protocol}://oauth.#{hostname}"
  .constant 'OCTOBLU_API_URL', "#{protocol}://app.#{hostname}"
  .constant 'OCTOBLU_ICON_URL', 'https://icons.octoblu.com/'
  .constant 'REGISTRY_URL', 'https://s3-us-west-2.amazonaws.com/nanocyte-registry/latest/registry.json'
  .constant 'CONNECTOR_FACTORY_UI', 'https://connector-factory.octoblu.com'
  .constant 'SENTRY_DSN', ''
  .constant 'STATUS_PAGE_ID', 'c3jcws6d2z45'
  .constant 'STATUS_PAGE_URL', 'http://status.octoblu.com'
  .constant 'OCTOBLU_REGISTRY_CONNECTOR_OFFICIAL', 'https://raw.githubusercontent.com/octoblu/registry-meshblu-connector-official/master/registry.json'
  .constant 'OCTOBLU_REGISTRY_CONNECTOR_COMMUNITY', 'https://raw.githubusercontent.com/octoblu/registry-meshblu-connector-community/master/registry.json'
  .constant 'OCTOBLU_REGISTRY_ENDO_OFFICIAL', 'https://raw.githubusercontent.com/octoblu/registry-endo-official/master/registry.json'
  .constant 'OCTOBLU_REGISTRY_ENDO_COMMUNITY', 'https://raw.githubusercontent.com/octoblu/registry-endo-community/master/registry.json'
