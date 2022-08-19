
let moveUtil = require('../../../util/moveUtil.js');
var roleRemoteTransporter = {

    /** @param {Creep} creep @param {Room} mainRoom @param {Room} toRoom **/
    run: function(creep, mainRoom, toRoom) {
        if (creep.memory.collect) {
            moveUtil.moveToRoom(creep, toRoom, withdraw);
        } else {
            moveUtil.moveToRoom(creep, mainRoom, transfer);
        }
	}
};



module.exports = roleRemoteTransporter;

/** @param {Creep} creep @param {Source} soruce**/
function withdraw(creep, source = null) {
    if (source == null) {
        source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    }
    let containers = creep.room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }})
        .sort((container1, container2) => container1.store[RESOURCE_ENERGY].getUsedCapacity() > container2.store[RESOURCE_ENERGY].getUsedCapacity());
    if (creep.withdraw(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
    }
};

/** @param {Creep} creep @param {Source} soruce**/
function transfer(creep, source = null) {
    if (source == null) {
        source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    }
    let containers = creep.room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_CONTAINER }})
        .sort((container1, container2) => container1.store[RESOURCE_ENERGY].getUsedCapacity() < container2.store[RESOURCE_ENERGY].getUsedCapacity());
    if (creep.transfer(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
    }
};