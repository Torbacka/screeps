var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if (creep.memory.transfering && creep.carry.energy == 0) {
            creep.memory.transfering = false;
        }
        if (!creep.memory.transfering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.transfering = true;
        }

        if (creep.memory.transfering) {
            
            var task = calculateTasks(creep);
            switch(task[0]) {
                case 'repairWall' :
                    repairWall(creep, task[1]);
                    break;
                case 'build' :
                    build(creep, task[1]);
                    break;
                case 'repair' :
                    repair(creep, task[1]);
                    break;
                default:
                    upgradeController(creep);
            }
        }
        else {
            collectEngery(creep);
        }
    }
   
};

function collectEngery(creep) {
    var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER );
        }
    });
    if(targets.length > 0) {
        var container = creep.memory.soruceNr == 0 ? 0 : 1;
        creep.moveTo(targets[container]);
    }
}
function calculateTasks(creep) {
    //repairWAll
    targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_RAMPART && structure.hits < structure.hitsMax*0.1) ||
                        (structure.structureType == STRUCTURE_WALL && structure.hits < structure.hitsMax*0.0001);
                    }
                });
    if (targets.length > 0) {
        return ['repairWall', targets];
    }
    //Build
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
    if (targets.length> 0) {
        return ['build',targets];
    }
    //repair rest
    targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax*0.9) ||
                        (structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax);
                    }
                });
    if (targets.length > 0) {
        return ['repair', targets];
    }

    //return default
    return ['default',[]];
}

function build(creep, targets) {
    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(targets[0]);
    }
}
//Send one creep to one wall
function repairWall(creep, targets) {
    if (creep.repair(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
    }
}
//Send one creep to one wall
function repair(creep, targets) {
    if (creep.repair(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
    }
}
function upgradeController(creep) {
    if ( creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE ) {
        creep.moveTo(creep.room.controller);
    }
}

module.exports = roleBuilder;