db.copyDatabase("meshines", "meshines-" + new Date().toISOString());

use meshines;
db.groups.dropIndexes();

db.users.update({ 'resource.properties.skynettoken' : {$exists: true} },
    {$unset : { 'resource.properties.skynettoken' : '' }}, {multi: true});

db.groups.update({'resource.owner.properties.skynettoken' : {$exists: true}},
    {$unset: {'resource.owner.properties.skynettoken' : ''}}, {multi: true});

db.groups.update({'members.token' : {$exists: true}},
    {$unset: {'members.$.token' : ''}}, {multi: true});

db.groups.update({'members.resource.token' : {$exists: true}},
    {$unset: {'members.$.resource.token' : ''}}, {multi: true});

db.groups.update({'members.skynettoken' : {$exists: true}},
    {$unset: {'members.$.skynettoken' : ''}}, {multi: true});

db.groups.update({'members.resource.token' : {$exists: true}},
    {$unset: {'members.$.resource.skynettoken' : ''}}, {multi: true});

db.resourcepermissions.update({'resource.owner.properties.skynettoken' : {$exists: true}},
    {$unset: {'resource.owner.properties.skynettoken' : ''}}, {multi: true});

