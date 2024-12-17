

function assignSource(creep) {
    const sourceAssignments = _.countBy(
        _.filter(Game.creeps, creep => creep.memory.role === 'harvester'),
        creep => creep.memory.source
    );
    creep.room.find(FIND_SOURCES).forEach(source => {
        if (!sourceAssignments[source.id]) {
            creep.memory.source = source.id;
        }
    });
}

function harvestEnergy(creep) {

    const source = Game.getObjectById(creep.memory.source);
    const container = source.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_CONTAINER
    });

    // Attempt to withdraw or pick up energy

    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
}

const roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        console.log(creep.memory.source);
        if (creep.memory.source === undefined) {
            assignSource(creep);
        }
        if (creep.memory.storing && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.storing = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.storing && creep.store.getFreeCapacity() === 0) {
            creep.memory.storing = true;
            creep.say('⚡ Storing');
        }
        if (!creep.memory.storing) {
            harvestEnergy(creep);
        } else {
            const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType === STRUCTURE_CONTAINER &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (container !== null) {
                if (creep.transfer(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;
