var conn = new Mongo(); 
var db = conn.getDB("meshines"); 
db.copyDatabase("meshines", "meshines-" + new Date().toISOString()); 
var userCursor = db.users.find( {$or: [
            {'local.skynetuuid' : {$exists : true }},
            {'twitter.skynetuuid' :{$exists : true }},
            {'facebook.skynetuuid' : {$exists : true }},
            {'google.skynetuuid' : {$exists : true }}
        ]
        });
while(userCursor.hasNext()){
	var user = userCursor.next();
	
	if(user.local && user.local.skynetuuid) {
		user.skynet = {
			uuid: user.local.skynetuuid,
			token: user.local.skynettoken
		};
		delete user.local.skynetuuid;
		delete user.local.skynettoken;
	} else if(user.google && user.google.skynetuuid) {
		user.skynet = {
			uuid: user.google.skynetuuid,
			token: user.google.skynettoken
		};
		delete user.google.skynetuuid;
		delete user.google.skynettoken;
	}  else if(user.facebook && user.facebook.skynetuuid) {
		user.skynet = {
			uuid: user.facebook.skynetuuid,
			token: user.facebook.skynettoken
		};
		delete user.facebook.skynetuuid;
		delete user.facebook.skynettoken;
	}   else if(user.twitter && user.twitter.skynetuuid) {
		user.skynet = {
			uuid: user.twitter.skynetuuid,
			token: user.twitter.skynettoken
		};
		delete user.twitter.skynetuuid;
		delete user.twitter.skynettoken;
	}
	printjson(user);
	db.users.save(user); 
}

var userCursor = db.users.find({});
while(userCursor.hasNext()){
    var user = userCursor.next();

    if(user.local && user.local.email) {
        user.email = user.local.email;
        user.displayName = user.local.email;
        user.username = user.local.email;

    } else if(user.google && user.google.email) {

        user.email = user.google.email;
        user.displayName = user.google.name;
        user.username = user.google.email;
    }  else if(user.facebook && user.facebook.name) {
        user.email = user.facebook.email;
        user.displayName = user.facebook.name;
        user.username = user.facebook.email;

    }   else if(user.twitter && user.twitter.displayName) {
        user.email = user.twitter.username + '@twitter';
        user.username = user.twitter.username;
        user.displayName = user.twitter.displayName;
    }

    delete user.groups;

    printjson(user);
    db.users.save(user);
}
