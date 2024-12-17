let moveUtil = require('../../util/moveUtil.js');
const roleRemoteTransporter = {

    /**
     * @param {Creep} creep
     * @param {Room} mainRoom
     * @param {Room} toRoom **/
    run: function (creep, mainRoom, toRoom) {
        if (creep.memory.collect) {
            moveUtil.moveToRoom(creep, toRoom, withdraw, toRoom);
        } else {
            moveUtil.moveToRoom(creep, mainRoom, transfer, mainRoom);
        }
    }
};

/**
 * @param {Creep} creep
 * @param {String} roomName
 * **/
function withdraw(creep, roomName) {

    if (creep.store.getUsedCapacity() === creep.store.getCapacity()) {
        creep.memory.collect = false;
        creep.memory.container = undefined;
        return;
    }
    if (creep.memory.container === undefined || (creep.room.name === roomName && Game.getObjectById(creep.memory.container).room.name !== roomName)) {
        console.log("Calculate transport container");
        let containers = creep.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}})
            .sort((container1, container2) => container1.store[RESOURCE_ENERGY] < container2.store[RESOURCE_ENERGY]);
        creep.memory.container = containers[0].id
    }

    const energy = creep.pos.findInRange(
        FIND_DROPPED_RESOURCES,
        3, {
            filter: (resource) => {
                return resource.amount > 100
            }
        }
    );

    if (energy !== null && energy.length > 0) {
        const pickupResult = creep.pickup(energy[0]);
        console.log("Pickup result " + pickupResult);
        if (pickupResult === ERR_NOT_IN_RANGE) {
            console.log("Finding energy for pickup: " + energy[0].amount);
            creep.moveTo(energy[0], {visualizePathStyle: {stroke: '#ff671a'}});
        }
    } else if (creep.withdraw(Game.getObjectById(creep.memory.container), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.getObjectById(creep.memory.container), {visualizePathStyle: {stroke: '#ffaa00'}});
    }
}

/**
 * Transfer all collected energy to the main room storage
 *
 * @param {Creep} creep
 * @param {String} mainRoom
 * **/
function transfer(creep, mainRoom) {
    if (creep.room.name === mainRoom && creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
    }
}

module.exports = roleRemoteTransporter;
