use meshines;

var channelCursor = db.apis.find({ owner : { $exists : false}, name : {$exists : true }});

while(channelCursor.hasNext()){
  var channel = channelCursor.next();
  printjson(channel.name);

  db.nodetypes.update({'channel._id': channel._id}, {$set: {channel: channel}});
};
