var roleTransporter = {
    run: function(creep, source){
        if (source == null) {
            source =  creep.room.find(FIND_SOURCES,  {filter: function(object) {return object.pos.x == 39}})[0];
        }
        if (creep.memory.transfering && creep.carry.energy === 0) {
            creep.memory.transfering = false;
        }
        if (!creep.memory.transfering && creep.carry.energy === creep.carryCapacity) {
            creep.memory.transfering = true;
        }
        if (creep.memory.transfering) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_TOWER) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0],{visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source,  {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};


module.exports = roleTransporter;