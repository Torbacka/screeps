var roleTransporter = {
	run: function(creep){
		if (creep.memory.transfering && creep.carry.energy == 0) {
            creep.memory.transfering = false;
	    }
	    if (!creep.memory.transfering && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.transfering = true;
	    }
	    if (creep.memory.transfering) {
	    	var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_TOWER ||structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
	    } else {
	        
	        var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_CONTAINER );
                    }
            });
            if(targets.length > 0) {
            	creep.moveTo(targets[creep.memory.sourceNr]);
            }

	    }
	}
};


module.exports = roleTransporter;