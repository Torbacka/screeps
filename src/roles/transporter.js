function assignContainer(creep) {
    const container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_CONTAINER &&
                structure.store[RESOURCE_ENERGY] > 0;
        }
    });
    if (container !== null) {
        creep.memory.container = container.id;
    }
}

function getFreeEnergy(room) {
    const droppedEnergy = room.find(FIND_DROPPED_RESOURCES, {
        filter: resource => resource.resourceType === RESOURCE_ENERGY && resource.amount > 400
    });

    const tombstonesWithEnergy = room.find(FIND_TOMBSTONES, {
        filter: tombstone => tombstone.store[RESOURCE_ENERGY] > 400
    });
    return {droppedEnergy, tombstonesWithEnergy};
}
//6769c67d7464d811dcaba9a4
//6769c67d7464d811dcaba9a4
//6769c67d7464d811dcaba9a4
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
        if (creep.memory.storing && creep.store.getUsedCapacity() === 0) {
            switchContainer(creep);
            creep.memory.storing = false;
        }
        if (!creep.memory.storing && creep.store.getFreeCapacity() === 0) {
            creep.memory.storing = true;
        }
        if (!creep.memory.storing) {
            const {droppedEnergy, tombstonesWithEnergy} = getFreeEnergy(creep.room);
            const terminal = creep.room.terminal;
            // Attempt to withdraw or pick up energy
            if (droppedEnergy.length > 0) { // Dropped energy
                if (creep.pickup(droppedEnergy[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy[0], {visualizePathStyle: {stroke: '#ff671a'}});
                }
            } else if (tombstonesWithEnergy.length > 0) { // Tombstone energy
                if (creep.withdraw(tombstonesWithEnergy[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(tombstonesWithEnergy[0], {visualizePathStyle: {stroke: '#ff671a'}});
                }
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
            }else {
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
            const labs = creep.room.find(FIND_STRUCTURES, {filter: structure => structure.structureType === STRUCTURE_LAB});
            if (targets) {
                if (creep.transfer(targets, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
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
                if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleTransporter;
