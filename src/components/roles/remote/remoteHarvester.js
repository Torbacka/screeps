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

/** @param {Creep} creep @param {Source} soruce**/
function harvest(creep, source = null) {
    if (source == null) {
        source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    }
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
        creep.moveTo(containers[0], { visualizePathStyle: { stroke: '#ffaa00' } });
    } else {
        creep.harvest(source);
    }
};