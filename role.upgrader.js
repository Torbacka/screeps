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
            // Transfering mode, go dump it at the nearest constroller
            var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
            if(hostiles.length > 0) {
                fillTower(creep);
            } else { 
                upgradeController(creep);
            }
            
        }
    }
};

function upgradeController(creep) {
    if ( creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE ) {
        creep.moveTo(creep.room.controller);
    }
}

function fillTower(creep) {
    
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_TOWER) &&
                structure.energy < structure.energyCapacity;
        }
    });
    if(targets.length > 0) {
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
        }
    } 
        
}

module.exports = roleUpgrader;