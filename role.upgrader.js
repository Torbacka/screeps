const roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep, source = null) {
        if (creep.carry.energy < creep.carryCapacity)
        {
            const energy = creep.pos.findInRange(
                FIND_DROPPED_RESOURCES,
                6
            );
            if (energy.length) {
                console.log('found ' + energy[0].energy + ' energy at ', energy[0].pos + '  ' + creep.pickup(energy[0]) === ERR_NOT_IN_RANGE);
                if (creep.pickup(energy[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(energy[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
        if (source == null) {
            source = creep.room.find(FIND_SOURCES, {
                filter: function (object) {
                    return object.pos.x === 39
                }
            })[0];
        }

        if (creep.memory.upgrading && creep.carry.energy === 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('🚧 upgrading');
        }
        if (creep.memory.upgrading) {
            if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleUpgrader;