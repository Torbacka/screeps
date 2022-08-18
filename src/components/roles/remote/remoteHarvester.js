var roleRemoteHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, toRoom) {
        let exitDir = creep.room.findExitTo(toRoom);
        let exit = creep.pos.findClosestByPath(exitDir);
        if (exit != null) {
            creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffaa00' } });
        } else {
            build(creep);
        }
	}
};

module.exports = roleRemoteHarvester;

/** @param {Creep} creep @param {Source} soruce**/
function build(creep, source = null) {
    if (source == null) {
        source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    }
    let creepPos= creep.room.find(FIND_MY_CREEPS, {
        filter: (creep) => { creep.memory.role == 'remoteHarvester' }
    }).map((creep) => {creep.pos});
    let containers = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { 
        if (structure.structureType === STRUCTURE_CONTAINER) {
            return !creepPos.includes(structure.pos);
        } 
        return false;
    } });
    if (creep.pos != containers[0]) {
        creep.moveTo(containers[0], { visualizePathStyle: { stroke: '#ffaa00' } });
    } else {
        creep.harvest(source);
    }
};