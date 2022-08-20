
let moveUtil = require('../../../util/moveUtil.js');
var roleRemoteTransporter = {

    /** @param {Creep} creep @param {Room} mainRoom @param {Room} toRoom **/
    run: function(creep, mainRoom, toRoom) {
        console.log("Container memory " +  creep.memory.container + "   " + mainRoom);
        if (creep.memory.collect) {
            moveUtil.moveToRoom(creep, toRoom, withdraw, toRoom);
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
    
    if (creep.memory.container == undefined || Game.getObjectById(creep.memory.container).room.name !== roomName) { 
        console.log("Calculate transport container");
        let containers = creep.room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }})
            .sort((container1, container2) => container1.store[RESOURCE_ENERGY] < container2.store[RESOURCE_ENERGY]);
        creep.memory.container = containers[0].id
    }
    if (creep.withdraw(Game.getObjectById(creep.memory.container), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.getObjectById(creep.memory.container), {visualizePathStyle: {stroke: '#ffaa00'}});
    }
};

/** @param {Creep} creep @param {String} roomName**/
function transfer(creep, roomName) {
    if (creep.store.getUsedCapacity() === 0) {
        creep.memory.collect = true;
        creep.memory.container = undefined;
        return;
    }
    if (creep.memory.container === undefined || Game.getObjectById(creep.memory.container).room.name !== roomName) {
        console.log("Calculate transport container");
        let containers = creep.room.find(FIND_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }})
            .sort((container1, container2) => container1.store[RESOURCE_ENERGY] > container2.store[RESOURCE_ENERGY]);
        creep.memory.container = containers[0].id
    }
    if (creep.transfer(Game.getObjectById(creep.memory.container), RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.getObjectById(creep.memory.container), {visualizePathStyle: {stroke: '#ffffff'}});
    }
};

module.exports = roleRemoteTransporter;