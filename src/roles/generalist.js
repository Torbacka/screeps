function assignSource(creep) {
    const generalists = _.filter(Game.creeps, creep => creep.memory.role === 'generalist');
    const assignedCounts = _.countBy(generalists, creep => creep.memory.source);
    const sources = {};
    for (const source of creep.room.find(FIND_SOURCES)) {
        sources[source.id] = countFreeSpots(creep.room, source);
    }
    for (const [key, value] of Object.entries(sources)) {
        if (assignedCounts[key] === undefined ||  assignedCounts[key] < value) {
            console.log("Assigning source " + key + " to " + creep.name);
            creep.memory.source = key;
            break;
        }
    }
}

function countFreeSpots(room, source) {
    if (!source) return 0;

    const terrain = room.getTerrain();
    let freeSpots = 0;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;

            const x = source.pos.x + dx;
            const y = source.pos.y + dy;

            if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
                freeSpots++;
            }
        }
    }
    return freeSpots;
}

const roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.source === undefined) {
            assignSource(creep);
        }
        if (creep.store.getUsedCapacity() === 0) {
            creep.memory.harvesting = true;
        }
        if (creep.store.getFreeCapacity() === 0) {
            creep.memory.harvesting = false;
        }

        if (!creep.memory.harvesting) {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: structure =>
                    (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            const buildingTargets = creep.room.find(FIND_CONSTRUCTION_SITES);

            if (targets.length > 0 && creep.memory.source !== "5bbcb0169099fc012e63b93b") {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else if (buildingTargets.length > 0 && creep.memory.source !== "5bbcb0169099fc012e63b93b") {
                if (creep.build(buildingTargets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildingTargets[0]);
                }
            } else {
                if (creep.room.controller) {
                    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        } else {
            if (creep.harvest(Game.getObjectById(creep.memory.source)) === ERR_NOT_IN_RANGE) {
                const result = creep.moveTo(Game.getObjectById(creep.memory.source), {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleBuilder;
