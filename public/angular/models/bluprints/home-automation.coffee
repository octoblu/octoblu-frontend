SHARED_BLUPRINTS =
  '0828d090-b19a-11e4-8301-077f59e8fafc': {
    'name': 'Nest Interaction'
    'id': '0828d090-b19a-11e4-8301-077f59e8fafc'
    'description': 'Interact with your nest using javascript.'
    'tags': ['trigger', 'function', 'nest', 'debug']
    'liked_by': []
    'download_count': 0
    'author': 'Chris M.'
  },
  '7e9f5390-c9b2-11e4-90c6-e5475bb92564': {
    'name': 'Blink + Hue Light Triggers'
    'id': '7e9f5390-c9b2-11e4-90c6-e5475bb92564'
    'description': 'Trigger your Blink and Hues using Octoblu.'
    'tags': ['trigger', 'blink1', 'hue']
    'liked_by': []
    'download_count': 0
    'author': 'Chris M.'
  },
  '61cdb2b0-f5af-11e4-ac81-99a9caba106c': {
    'name': 'GitHub Commits Turn On Outlets'
    'id': '61cdb2b0-f5af-11e4-ac81-99a9caba106c'
    'description': 'Turn on outlets in your home when you git commit!'
    'tags': ['interval', 'pluck', 'github', 'function', 'lessthan', 'debug', 'trigger', 'wemo', 'delay']
    'liked_by': []
    'download_count': 0
    'author': 'Chris M.'
  },
  '13a5ab85-8079-4b3c-9e32-307b58e7230e': {
    'name': 'Nest Weather'
    'id': '13a5ab85-8079-4b3c-9e32-307b58e7230e'
    'description': 'This heats or cools your home based on the location of your NEST.'
    'tags': ['onstart', 'nest', 'demultiplex', 'function', 'compose', 'weather', 'pluck', 'change', 'greaterthanorequal', 'lessthanorequal']
    'liked_by': []
    'download_count': 0
    'author': 'Ari S.'
  }

angular.module('octobluApp').constant 'SHARED_BLUPRINTS', SHARED_BLUPRINTS
