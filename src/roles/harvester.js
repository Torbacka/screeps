

function assignSource(creep) {
    let harvesters = _.filter(Game.creeps, c => c.memory.role === 'harvester' && creep.room.name === c.room.name);
    const sourceAssignments = _.countBy(
        harvesters, creep => creep.memory.source
    );
    creep.room.find(FIND_SOURCES).forEach(source => {
        if (!sourceAssignments[source.id]) {
            creep.memory.source = source.id;
        }
    });
    if (creep.memory.source === undefined) {
        const uniqueCreeps = Object.values(
            harvesters.reduce((acc, creep) => {
                const source = creep.memory.source;
                if (!acc[source] || creep.ticksToLive > acc[source].ticksToLive) {
                    acc[source] = creep;
                }
                return acc;
            }, {})
        ).sort((a, b) => a.ticksToLive - b.ticksToLive);
        creep.memory.source = uniqueCreeps[0].memory.source;
    }
}

function calculatingSourceCost(creep) {
    const source = Game.getObjectById(creep.memory.source);
    const spawn = creep.room.find(FIND_MY_SPAWNS)[0]; // Assume there's at least one spawn in the room

    if (source && spawn) {
        // Calculate the path distance
        const {path, opts, cost, incomplete} = PathFinder.search(spawn.pos, { pos: source.pos, range: 1 });
        if (!incomplete) {
            console.log('Path found: ' + JSON.stringify(path), ' Options: ' + JSON.stringify(opts) + ' Cost: ' + cost + ' for ' + creep.name + ' ' + incomplete);
            return cost; // Store the cost of the path
        }
    }
}

function harvestEnergy(creep) {

    const source = Game.getObjectById(creep.memory.source);
    const container = source.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: structure => structure.structureType === STRUCTURE_CONTAINER
    });

    // Attempt to withdraw or pick up energy
    if (!(creep.pos.x === container.pos.x && creep.pos.y === container.pos.y) || creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
}

const roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.source === undefined) {
            assignSource(creep);
        }
        if (creep.memory.source && creep.memory.distanceToSource === undefined) {
            creep.memory.distanceToSource = calculatingSourceCost(creep)
            creep.memory.spawnTime =  creep.body.length*3;
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
