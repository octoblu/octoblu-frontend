db.copyDatabase("meshines", "meshines-" + new Date().toISOString());
//need to re-add later.
db.groups.dropIndexes();