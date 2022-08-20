var roleRemoteBuilder = {

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

module.exports = roleRemoteBuilder;

function build(creep, source = null) {
    let storage = creep.room.storage;
    if (source == null) {
        source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    }
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.building = false;
        creep.say('🔄 harvest');
        
    }
    if (!creep.memory.building && creep.store.getUsedCapacity() === creep.store.getCapacity()) {
        creep.memory.building = true;
    }
  

    if (creep.memory.building) {
        const container = getContainerToRepair(creep);
        const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if (container != null) {
            if (creep.repair(container) === ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else if (target) {
            creep.say('🚧 build');
            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } 
    } else {
        const energy = creep.pos.findInRange(
          FIND_DROPPED_RESOURCES,
          6
        );
        let container = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => { 
            if (structure.structureType === STRUCTURE_CONTAINER) {
                return structure.store[RESOURCE_ENERGY] > 100;
            } 
            return false;
        }});
        if (energy.length) {
        
            if (creep.pickup(energy[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(energy[0], {visualizePathStyle: {stroke: '#ff671a'}});
            }
        } else if (container !== null) {
            if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if(storage && storage.store[RESOURCE_ENERGY] > 150000) {
            if (creep.withdraw(storage, RESOURCE_ENERGY) === OK) {

            } else if (storage.store[RESOURCE_ENERGY] > 150000 && creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }

};

function getContainerToRepair(creep) {
   return creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER && structure.hits < structure.hitsMax * 0.95) || 
            (structure.structureType === STRUCTURE_ROAD && structure.hits < structure.hitsMax*0.94);
        }
    });
}