var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
       
        if(creep.carry.energy == 0) {
            creep.memory.transfering = false;
        } else if(creep.carry.energy == creep.carryCapacity) {
            creep.memory.transfering = true;
        }
        if(!creep.memory.transfering) {
            // Transfering mode false, go and fill yourself
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[creep.memory.sourceNr]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[creep.memory.sourceNr]);
            }
        }
        if(creep.memory.transfering){
            // Transfering mode, go dump it at the nearest upgrader
            
            if( creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE ) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};

module.exports = roleUpgrader;