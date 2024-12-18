function assignContainer(creep) {
    const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_CONTAINER &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    if (container !== null) {
        creep.memory.container = container.id;
    }
    //console.log('Assigned container ' + container.id + ' to ' + creep.name);
}

function getFreeEnergy() {
    const droppedEnergy = Game.rooms['E58S34'].find(FIND_DROPPED_RESOURCES, {
        filter: resource => resource.resourceType === RESOURCE_ENERGY && resource.amount > 100
    });

    const tombstonesWithEnergy = Game.rooms['E58S34'].find(FIND_TOMBSTONES, {
        filter: tombstone => tombstone.store[RESOURCE_ENERGY] > 100
    });
    return {droppedEnergy, tombstonesWithEnergy};
}

function switchContainer(creep) {
    const containers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER) &&
                structure.store.getUsedCapacity() > 0 && structure.id !== creep.memory.container;
        }
    });
    console.log('Containers: ' + JSON.stringify(containers));
    if (containers.length > 0) {
        console.log('Switching containers' + ' for ' + creep.name + ' from ' + creep.memory.container + ' to ' + containers[0].id);
        creep.memory.container = containers[0].id;
    }
}

const roleTransporter = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.memory.container === undefined) {
            assignContainer(creep);
        }
        if (creep.memory.storing && creep.store[RESOURCE_ENERGY] === 0) {
            switchContainer(creep);
            creep.memory.storing = false;
            creep.say('🔄 Fetching');
        }
        if (!creep.memory.storing && creep.store.getFreeCapacity() === 0) {
            creep.memory.storing = true;
            creep.say('⚡ Storing');
        }
        if (!creep.memory.storing) {
            const {droppedEnergy, tombstonesWithEnergy} = getFreeEnergy();
            // Attempt to withdraw or pick up energy
            if (droppedEnergy.length > 0) { // Dropped energy
                if (creep.pickup(droppedEnergy[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy[0], {visualizePathStyle: {stroke: '#ff671a'}});
                }
            } else if (tombstonesWithEnergy.length > 0) { // Tombstone energy
                if (creep.withdraw(tombstonesWithEnergy[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(tombstonesWithEnergy[0], {visualizePathStyle: {stroke: '#ff671a'}});
                }
            } else {
                const container = Game.getObjectById(creep.memory.container);
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        } else {
            const targets = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if (targets) {
                if (creep.transfer(targets, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // Transfer excess energy to storage
                if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleTransporter;
