const upgrader = {

    /** @param {Creep} creep *
     * @param source
     * @param target
     */
    run: function (creep, source = null, target = "W38N34") {
        if (creep.room.name !== target) {
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(target)), {visualizePathStyle: {stroke: '#ffffff'}});
        } else {
            if (source == null) {
                source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
            }
            if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
                creep.memory.building = false;
                creep.memory.wall = getWallToRepair(creep).id;
                creep.say('🔄 harvest');
            }
            if (!creep.memory.building && creep.store[RESOURCE_ENERGY] === creep.store.getCapacity()) {
                creep.memory.building = true;
                creep.say('🚧 build');
            }

            if (creep.memory.building) {
                const repairObject = null;//getRepairObjects(creep);
                const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                const wall = Game.getObjectById(creep.memory.wall);
                if (repairObject !== null) {
                    if (creep.repair(repairObject) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(repairObject, {visualizePathStyle: {stroke: '#ffffff'}});
                        creep.say('repair');
                    }
                } else if (target) {
                    if (creep.build(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else if (wall) {
                    if (creep.repair(wall) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(wall, {visualizePathStyle: {stroke: '#ffffff'}});
                        creep.say('repair');
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
                }/* else if (storage.length > 0 && storage[0].store[RESOURCE_ENERGY]  > 0) {
                    if (creep.withdraw(storage[0], RESOURCE_ENERGY) === OK) {

                    } else  if (storage[0].store[RESOURCE_ENERGY]  > 0 && creep.withdraw(storage[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }*/
                else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

function getWallToRepair(creep) {
    let walls = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_RAMPART && structure.hits < structure.hitsMax * 0.003) ||
              (structure.structureType === STRUCTURE_WALL && structure.hits < structure.hitsMax * 0.001);
        }
    });
    console.log("Walls to repair: " + walls.length);
    if (walls) {
        walls.sort((wall1, wall2) => (wall1.hits > wall2.hits) ? 1 : -1);
        return walls[0];
    } else {
        return null;
    }
}

function getRepairObjects(creep) {
    return creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_ROAD && structure.hits < structure.hitsMax * 0.75) ||
              (structure.structureType === STRUCTURE_CONTAINER && structure.hits < structure.hitsMax) ||
              (structure.structureType === STRUCTURE_RAMPART && structure.hits < structure.hitsMax * 0.00005);
        }
    });

}

module.exports = upgrader;
