function assignSource(creep) {
    const sourceAssignments = _.countBy(
        _.filter(Game.creeps, creep => creep.memory.role === 'generalist'),
        creep => creep.memory.source
    );
    const sources = creep.room.find(FIND_SOURCES);
    const leastAssignedSource = _.min(sources, source => sourceAssignments[source.id] || 0);

    creep.memory.source = leastAssignedSource.id;

}
const roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.source === undefined) {
            assignSource(creep);
        }
        if (!creep.memory.harvesting && creep.store.getUsedCapacity() === 0) {
            creep.memory.harvesting = true;
            creep.say('🔄 harvest');
        }
        if (creep.memory.harvesting && creep.store.getFreeCapacity() === 0) {
            creep.memory.harvesting = false;
            creep.say('💣 Do stuff');
        }

        if (!creep.memory.harvesting) {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: structure =>
                    (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });

            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                if (creep.room.controller) {
                    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        } else {
            if (creep.harvest(creep.memory.source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.memory.source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;
