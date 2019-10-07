const defender = {
    run: function (creep) {
        if (creep.memory.roomToDefend === undefined) {
            creep.memory.roomToDefend = creep.room.name;
        }
        if (creep.room.name !== creep.memory.roomToDefend) {
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(target)), {visualizePathStyle: {stroke: '#ffffff'}});
        } else {
            let hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);

            if (hostileCreeps.length) {
                if (creep.attack(hostileCreeps[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostileCreeps[0], {visualizePathStyle: {stroke: '#ff0019'}});
                }
            } else {
                Object.values(Game.rooms).forEach((room) => {
                    let hostileCreep = room.find(FIND_HOSTILE_CREEPS);
                    if (hostileCreep.length) {
                        creep.memory.roomToDefend = room.name
                    }
                });
            }
        }
    }
};

module.exports = defender;