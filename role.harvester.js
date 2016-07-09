var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.carry.energy == 0 && creep.memory.transfering) {
            creep.memory.transfering = false;
        } else if(creep.carry.energy == creep.carryCapacity && !creep.memory.transfering) {
            creep.memory.transfering = true;
        }
        if(!creep.memory.transfering) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[creep.memory.sourceNr]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.sourceNr]);
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_TOWER ||structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } 
            //If there is nothing else to do upgrade
            else {
                if( creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE ) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
};

module.exports = roleHarvester;