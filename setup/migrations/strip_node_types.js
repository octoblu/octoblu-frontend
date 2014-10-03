db     = db.getSiblingDB('meshines');

db.nodetypes.update({category: 'channel'}, {$unset: {'channel.application.resources': true}});
