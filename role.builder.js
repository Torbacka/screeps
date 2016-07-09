var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.transfering && creep.carry.energy == 0) {
            creep.memory.transfering = false;
	    }
	    if(!creep.memory.transfering && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.transfering = true;
	    }

	    if(creep.memory.transfering) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                
                //If there is no construction sites go and repair 
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_RAMPART && structure.hits < structure.hitsMax*0.1) ||
                        (structure.structureType == STRUCTURE_WALL && structure.hits < structure.hitsMax*0.0001)||
                        (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax*0.8) ;
                    }
                });
                if(targets.length > 0) {
                    if(creep.repair(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0]);
                    } 
                } else {
                    //If there is nothing to do go and upgrade
                    if( creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE ) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[creep.memory.sourceNr]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.sourceNr]);
            }
	    }
	}
};

module.exports = roleBuilder;