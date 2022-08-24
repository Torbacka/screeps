
let moveUtil = require('../../../util/moveUtil.js');
var roleRemoteTransporter = {

    /** @param {Creep} creep @param {Room} mainRoom **/
    run: function(creep, mainRoom) {
        
        if (creep.memory.collect) {
            moveUtil.moveToRoom(creep, creep.memory.room, withdraw, creep.memory.room);
        } else {
            moveUtil.moveToRoom(creep, mainRoom, transfer, mainRoom);
        }
	}
};

/** @param {Creep} creep @param {String} roomName**/
function withdraw(creep, roomName) {
  
    if (creep.store.getUsedCapacity() === creep.store.getCapacity()) {
        creep.memory.collect = false;
        creep.memory.container = undefined;
        return;
    }
    if (creep.memory.container == undefined || (creep.room.name === roomName && Game.getObjectById(creep.memory.container).room.name !== roomName)) { 
        console.log("Calculate transport container");
        let containers = creep.room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }})
            .sort((container1, container2) => container1.store[RESOURCE_ENERGY] < container2.store[RESOURCE_ENERGY]);
        creep.memory.container = containers[0].id
    }

    const energy = creep.pos.findInRange(
        FIND_DROPPED_RESOURCES,
        3, { filter: (resource) => { return resource.amount > 100 }}
    );

    if (energy !== null && energy.length > 0) {
        const pickupResult = creep.pickup(energy[0]);
        console.log("Pickup result " + pickupResult);
        if (pickupResult === ERR_NOT_IN_RANGE) {
            console.log("Finding energy for pickup: " +  energy[0].amount);
            creep.moveTo(energy[0], {visualizePathStyle: {stroke: '#ff671a'}});
        }
    } else if (creep.withdraw(Game.getObjectById(creep.memory.container), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.getObjectById(creep.memory.container), {visualizePathStyle: {stroke: '#ffaa00'}});
    }
};

/** @param {Creep} creep @param {String} roomName**/
function transfer(creep, roomName) {
    let containers = creep.room.find(FIND_STRUCTURES, {filter:  (structure) => {
        if (structure.structureType ===  STRUCTURE_CONTAINER) {
            return structure.store[RESOURCE_ENERGY] < structure.store.getCapacity();
        } 
    }});
    if (creep.store.getUsedCapacity() === 0) {
        creep.memory.collect = true;
        creep.memory.container = undefined;
        return;
    }
    if (creep.memory.container === undefined || (creep.room.name === roomName && Game.getObjectById(creep.memory.container).room.name !== roomName) || Game.getObjectById(creep.memory.container).store.getUsedCapacity() === Game.getObjectById(creep.memory.container).store.getCapacity()) {
        console.log("Calculate transport container");
        let containers = creep.room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }})
            .sort((container1, container2) => container1.store[RESOURCE_ENERGY] > container2.store[RESOURCE_ENERGY]);
        creep.memory.container = containers[0].id
    }
    if (containers.length == 1) {
        if (creep.room.storage) {
            creep.memory.container = creep.room.storage.id
        }
    }
    if (creep.transfer(Game.getObjectById(creep.memory.container), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.getObjectById(creep.memory.container), {visualizePathStyle: {stroke: '#ffffff'}});
    }
};

module.exports = roleRemoteTransporter;