function assignContainer(creep) {
    const container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_CONTAINER &&
                structure.store.getUsedCapacity() > 0;
        }
    });
    if (container !== null) {
        creep.memory.container = container.id;
    }
}

function getFreeEnergy(creep) {
    const droppedEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
        filter: resource => resource.resourceType === RESOURCE_ENERGY && resource.amount > 400
    });

    const tombstonesWithResources = creep.room.find(FIND_TOMBSTONES, {
        filter: tombstone => {
            const hasEnergy = tombstone.store[RESOURCE_ENERGY] > 400;
            const hasMinerals = Object.keys(tombstone.store).some(resource =>
                resource !== RESOURCE_ENERGY && tombstone.store[resource] > 0
            );
            return hasEnergy || hasMinerals;
        }
    });
    return {droppedEnergy, tombstonesWithResources};
}

function switchContainer(creep) {
    const containers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER) &&
                structure.store.getUsedCapacity() > 0 && structure.id !== creep.memory.container;
        }
    }).sort((a, b) => b.store.getUsedCapacity() - a.store.getUsedCapacity());

    if (containers.length > 0) {
        creep.memory.container = containers[0].id;
    }
}

const roleTransporter = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.container === undefined) {
            console.log('Assigning container for ' + creep.name);
            assignContainer(creep);
        }
        let transporterCreep = _.filter(Game.creeps, filterCreep =>
            filterCreep.memory.role === 'transporter' &&
            filterCreep.room.name === creep.room.name &&
            creep.memory.labAssitent
        );
        if (transporterCreep.length === 0) {
            creep.memory.labAssitent = true;
        }
        if (creep.memory.storing === undefined) {
            creep.memory.storing = false;
        }
        if (creep.memory.container && Game.getObjectById(creep.memory.container).store.getUsedCapacity() < 50) {
            switchContainer(creep);
        }
        if (creep.memory.storing && creep.store.getUsedCapacity() === 0) {
            switchContainer(creep);
            creep.memory.storing = false;
        }
        if (!creep.memory.storing && creep.store.getFreeCapacity() === 0) {
            creep.memory.storing = true;
        }
        if (!creep.memory.storing) {
            const {droppedEnergy, tombstonesWithResources} = getFreeEnergy(creep);
            const terminal = creep.room.terminal;
            // Attempt to withdraw or pick up energy
            if (droppedEnergy) { // Dropped energy
                if (creep.pickup(droppedEnergy) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy, {visualizePathStyle: {stroke: '#ff671a'}});
                }
            } else if( tombstonesWithResources.length > 0) { // Tombstone energy
                Object.keys(tombstonesWithResources[0].store).forEach(resourceType => {
                    if (creep.withdraw(tombstonesWithResources[0], resourceType) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(tombstonesWithResources[0], {visualizePathStyle: {stroke: '#ff671a'}});
                    }
                });
            } else if (terminal !== undefined && terminal.store[RESOURCE_ENERGY] > (terminal.store.getCapacity() * 0.8)) { // Terminal energy
                if (creep.withdraw(terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal, {visualizePathStyle: {stroke: '#ff671a'}});
                }
            } else if (terminal !== undefined && terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] > 0) { // Terminal lab energy
                if (creep.withdraw(terminal, RESOURCE_CATALYZED_GHODIUM_ACID) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal, {visualizePathStyle: {stroke: '#ff671a'}});
                } else if (creep.withdraw(terminal, RESOURCE_CATALYZED_GHODIUM_ACID) === ERR_NOT_ENOUGH_RESOURCES) {
                    creep.memory.storing = true;
                }
            } else {
                const container = Game.getObjectById(creep.memory.container);
                Object.keys(container.store).forEach(resourceType => {
                    if (creep.withdraw(container, resourceType) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(container, {visualizePathStyle: {stroke: '#ff671a'}});
                    }
                });
            }
        } else {
            const targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
                        creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            const tower = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 400 && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            const labs = creep.room.find(FIND_STRUCTURES, {filter: structure => structure.structureType === STRUCTURE_LAB});
            if (targets) {
                if (creep.transfer(targets, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (tower) {
                if (creep.transfer(tower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (labs.length > 0 && labs[0].store[RESOURCE_ENERGY] < 2000) {
                if (creep.transfer(labs[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(labs[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (labs.length > 0 && creep.store[RESOURCE_CATALYZED_GHODIUM_ACID] > 0) {
                if (creep.transfer(labs[0], RESOURCE_CATALYZED_GHODIUM_ACID) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(labs[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // Transfer excess energy to storage
                Object.keys(creep.store).forEach(resourceType => {
                    if (creep.transfer(creep.room.storage, resourceType) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                });
            }
        }
    }
};

module.exports = roleTransporter;
