const attacker = {
    run: function (creep, target) {
        if (creep.room.name !== target) {
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(target)), {visualizePathStyle: {stroke: '#ffffff'}});
        } else {
            let hostileSpawns = creep.room.find(FIND_HOSTILE_SPAWNS);
            let hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
            let hostileConstructionSites = creep.room.find(FIND_HOSTILE_STRUCTURES);
            console.log(hostileConstructionSites.length);
            if (hostileSpawns.length) {
                console.log('Found spawn');
                if (creep.attack(hostileSpawns[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostileSpawns[0], {visualizePathStyle: {stroke: '#ff0019'}});
                }
            }  else if(hostileCreeps.length) {
                console.log('Time to kill');
                if (creep.attack(hostileCreeps[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostileCreeps[0], {visualizePathStyle: {stroke: '#ff0019'}});
                }
            } else if(hostileConstructionSites.length) {
                console.log('Time to destroy');
                if (creep.attack(hostileConstructionSites[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostileConstructionSites[0], {visualizePathStyle: {stroke: '#ff0019'}});
                }
            }
        }
    }
};

module.exports  = attacker;