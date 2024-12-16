let moveUtil = require('../../../util/moveUtil.js');

var roleRemoteHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, toRoom = null) {
        if (toRoom !== null) {
            moveUtil.moveToRoom(creep, toRoom, harvest)
        }else {
            harvest(creep);
        }
	}
};

module.exports = roleRemoteHarvester;

/** @param {Creep} creep **/
function harvest(creep) {
    if (!creep.memory.harvesting && creep.store.getUsedCapacity() === 0) {
        creep.memory.harvesting = true;
    }
    if (creep.memory.harvesting && creep.store.getUsedCapacity() === creep.store.getCapacity()) {
        creep.memory.harvesting = false;
    }
    if (!creep.memory.arrived) {
        moveToContainer(creep);
    } else {
        if (creep.memory.harvesting || creep.body.filter((part) => part.type === CARRY) === 0) {
            console.log("Kommer jag hit");
            creep.harvest(Game.getObjectById(creep.memory.source));
        } else {
            const repairObjects = getRepairObjects(creep);
            if (repairObjects && repairObjects.length > 0) {
                creep.repair(repairObjects[0]);
            } else {
                creep.transfer(Game.getObjectById(creep.memory.container));
            }
        }
    }
};

/** @param {Creep} creep **/
function moveToContainer(creep) {
    let creepPos= creep.room.find(FIND_MY_CREEPS, {
        filter: (foundCreep) => { return foundCreep.memory.role == 'remoteHarvester'  && creep.name !== foundCreep.name;  }
    }).map((creep) => creep.pos);
    let containers = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { 
        if (structure.structureType === STRUCTURE_CONTAINER) {
            return creepPos.filter((pos) => pos.isEqualTo(structure.pos)).length == 0;
        } 
        return false;
    } });
    if (!creep.pos.isEqualTo(containers[0].pos)) {
        creep.moveTo(containers[0], { visualizePathStyle: { stroke: '#ffaa00' } });;
    } else {
        creep.memory.arrived = true;
        creep.memory.container = containers[0].id;
        creep.memory.source = creep.pos.findClosestByRange(FIND_SOURCES).id;
    }
};


/** @param {Creep} creep **/
function getRepairObjects(creep) {
    return creep.pos.findInRange(FIND_STRUCTURES, 3, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_ROAD && structure.hits < (structure.hitsMax-1100)) ||
              (structure.structureType === STRUCTURE_CONTAINER && structure.hits < structure.hitsMax*0.94) 
        }
    });

};