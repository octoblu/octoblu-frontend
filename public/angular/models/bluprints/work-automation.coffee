SHARED_BLUPRINTS =
  '288aaf30-70aa-4c3c-9f35-9fd29ce820f8': {
    'name': 'Wemo Podio Coffee Maker'
    'id': '288aaf30-70aa-4c3c-9f35-9fd29ce820f8'
    'description': 'This project makes a pot of coffee for every Podio meeting you have at your office.'
    'tags': ['trigger', 'interval', 'podio', 'demultiplex', 'compose', 'function', 'equal', 'wemo']
    'liked_by': []
    'download_count': 0
    'author': 'Ari S.'
  }
  '947f2b28-6e09-4c9a-9686-d0b358e408ee': {
    'name': 'Start workspace meetings'
    'id': '947f2b28-6e09-4c9a-9686-d0b358e408ee'
    'description': 'Start a workspace meeting and invite all of the members of the workspace via email to join the meeting.'
    'tags': ['trigger', 'podio', 'setkey', 'getkey', 'function', 'gotomeeting', 'demultiplex', 'delay', 'throttle', 'compose', 'template', 'debug', 'sendmail']
    'liked_by': []
    'download_count': 0
    'author': 'Octoblu L.'
  }

angular.module('octobluApp').constant 'SHARED_BLUPRINTS', SHARED_BLUPRINTS
