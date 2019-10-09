const attacker = {
    run: function (creep, target) {
        if (creep.room.name !== target) {
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(target)), {visualizePathStyle: {stroke: '#ffffff'}});
        } else {
            let hostileSpawns = creep.room.find(FIND_HOSTILE_SPAWNS);
            let hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
            let hostileConstructionSites = creep.room.find(FIND_HOSTILE_STRUCTURES);
            let sites  = [];
            hostileConstructionSites.forEach((site) => {
                if (site.structureType !== STRUCTURE_STORAGE) {
                    sites.push(site);
                }
            });
            sites.forEach((site) => console.log(site.structureType));

            if (hostileSpawns.length) {

                if (creep.attack(hostileSpawns[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostileSpawns[0], {visualizePathStyle: {stroke: '#ff0019'}});
                }
            }  else if(hostileCreeps.length) {

                if (creep.attack(hostileCreeps[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostileCreeps[0], {visualizePathStyle: {stroke: '#ff0019'}});
                }
            } else if(sites.length) {
                if (creep.attack(sites[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sites[0], {visualizePathStyle: {stroke: '#ff0019'}});
                }
            }
        }
    }
};

module.exports  = attacker;