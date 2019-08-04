const builder = {

    /** @param {Creep} creep *
     * @param source
     * @param target
     */
    run: function (creep, source = null, target = `W38N35`) {
        if (creep.room.name !== target) {
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(target)), {visualizePathStyle: {stroke: '#ffffff'}});
        } else {
            if (source == null) {
                source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            }
            if (creep.memory.building && creep.carry.energy === 0) {
                creep.memory.building = false;
                creep.say('🔄 harvest');
            }
            if (!creep.memory.building && creep.carry.energy === creep.carryCapacity) {
                creep.memory.building = true;
                creep.say('🚧 build');
            }

            if (creep.memory.building) {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (targets.length) {
                    if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            } else {
                const energy = creep.pos.findInRange(
                    FIND_DROPPED_RESOURCES,
                    6
                );
                if (energy.length) {

                    if (creep.pickup(energy[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(energy[0], {visualizePathStyle: {stroke: '#ff671a'}});
                    }
                } else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = builder;