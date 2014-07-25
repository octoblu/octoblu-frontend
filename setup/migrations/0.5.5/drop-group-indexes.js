db.copyDatabase("meshines", "meshines-" + new Date().toISOString());
use meshines
db.groups.dropIndexes();