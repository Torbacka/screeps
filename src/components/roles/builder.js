const builder = {

    /** @param {Creep} creep *
     * @param source
     * @param target
     */
    run: function (creep, source = null) {
        let storage = creep.room.storage;
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
            creep.memory.wall = getWallToRepair(creep).id;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            const wall = Game.getObjectById(creep.memory.wall);
            if (target) {
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
            if (energy.length) {

                if (creep.pickup(energy[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(energy[0], {visualizePathStyle: {stroke: '#ff671a'}});
                }
            } else if(storage && storage.store[RESOURCE_ENERGY] > 150000) {
                if (creep.withdraw(storage, RESOURCE_ENERGY) === OK) {

                } else if (storage.store[RESOURCE_ENERGY] > 150000 && creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
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
    console.log()
    if (walls) {
        walls.sort((wall1, wall2) => (wall1.hits > wall2.hits) ? 1 : -1);
        return walls[0];
    } else {
        return null;
    }
}

module.exports = builder;
