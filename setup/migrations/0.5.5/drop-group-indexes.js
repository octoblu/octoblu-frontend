db.copyDatabase("meshines", "meshines-" + new Date().toISOString());

use meshines;
db.groups.dropIndexes();

db.users.update({ 'resource.properties.skynettoken' : {$exists: true} },
    {$unset : { 'resource.properties.skynettoken' : '' }}, {multi: true});

db.groups.update({'resource.owner.properties.skynettoken' : {$exists: true}},
    {$unset: {'resource.owner.properties.skynettoken' : ''}}, {multi: true});

db.resourcepermissions.update({'resource.owner.properties.skynettoken' : {$exists: true}},
    {$unset: {'resource.owner.properties.skynettoken' : ''}}, {multi: true});

