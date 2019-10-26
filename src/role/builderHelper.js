const upgrader = {

    /** @param {Creep} creep *
     * @param source
     * @param target
     */
    run: function (creep, source = null, target = "W40N34") {

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
                const repairObjects = getRepairObjects(creep);
                const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if (repairObjects.length > 0) {
                    if(creep.repair(repairObjects[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(repairObjects[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        creep.say('repair');
                    }
                } else if(targets.length) {
                    if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            } else {
                const energy = creep.pos.findInRange(
                  FIND_DROPPED_RESOURCES,
                  6
                );

                let storage = creep.room.find(FIND_STRUCTURES, {
                    filter: (i) => {
                        return (i.structureType === STRUCTURE_STORAGE)
                    }
                });
                if (energy.length) {

                    if (creep.pickup(energy[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(energy[0], {visualizePathStyle: {stroke: '#ff671a'}});
                    }
                } else if (storage.length > 0 && storage[0].store[RESOURCE_ENERGY]  > 0) {
                    if (creep.withdraw(storage[0], RESOURCE_ENERGY) === OK) {

                    } else  if (storage[0].store[RESOURCE_ENERGY]  > 0 && creep.withdraw(storage[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
                else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

function getRepairObjects(creep) {
    return creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_ROAD && structure.hits < structure.hitsMax * 0.75) ||
              (structure.structureType === STRUCTURE_CONTAINER && structure.hits < structure.hitsMax);
        }
    });

}

module.exports = upgrader;
