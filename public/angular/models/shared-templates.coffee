SHARED_TEMPLATES =
  'E406E836-D97B-495D-834B-EBF1FA0AC497': {
    'name': 'SMS -> Weather'
    'url': 'https://app.octoblu.com/design/import/fbc3a070-e91e-11e4-bd02-3515df578f32'
    'description': 'Sends a text message containing the weather'
  },
  '22D94D71-6C5B-4EDF-AB8C-E3ED2B3D714E': {
    'name': 'Twitter Sentiment Analysis'
    'url': 'https://app.octoblu.com/design/import/b2490ca0-e91e-11e4-bd02-3515df578f32'
    'description': 'Changes color of Blink(1) depending on sentiment analysis of tweets from Twitter'
  },
  'E10281B5-17EE-481B-A7FF-CDFAA114B918': {
    'name': 'Flow Tutorial'
    'url': 'https://app.octoblu.com/tutorial/create'
    'description': 'Sends an email containing the weather.'
  },
  '6270B65B-8EAE-49F1-A96B-7CCB20F7403E': {
    'name': 'GoToMeeting -> Shell'
    'url': 'https://app.octoblu.com/design/import/2c674e60-e92f-11e4-84e5-75b844d80250'
    'description': 'Creates and starts a GoToMeeting, then opens it from the shell.'
  },
  'FE188D6C-A96D-4B6C-829E-0943AE80A1BC': {
    'name': 'Gifs -> Shell'
    'url': 'https://app.octoblu.com/design/import/9883e770-e934-11e4-84e5-75b844d80250'
    'description': 'Searches Giphy.com for gifs and opens them using the shell node.'
  }

angular.module('octobluApp').constant 'SHARED_TEMPLATES', SHARED_TEMPLATES
