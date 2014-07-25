use meshines;

var channelCursor = db.apis.find({ owner : { $exists : false}, name : {$exists : true }});

while(channelCursor.hasNext()){
  var channel = channelCursor.next();

  db.nodetypes.update({'channel._id': channel._id}, {$set: {channel: channel}});
};
