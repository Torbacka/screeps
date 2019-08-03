const transporter = {
    run: function (creep, containers = null) {
        if (containers == null) {
            containers = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => {
                    return (i.structureType === STRUCTURE_CONTAINER)
                }
            });

        }
        let source = null;
        console.log("Containers: " + JSON.stringify(containers));
        if (containers.length === 0) {
            source = creep.room.find(FIND_SOURCES)[0];
        }
        if (creep.memory.container === undefined) {
            creep.memory.container = 0;
        }
        if (creep.memory.transfering && creep.carry.energy === 0) {
            creep.memory.transfering = false;
            if (creep.memory.container === 0) {
                creep.memory.container = 1;
            } else {
                creep.memory.container = 0;
            }
        }
        if (containers.length > 0) {
            if (containers[creep.memory.container].store[RESOURCE_ENERGY] < 30) {
                creep.memory.transfering = true;
            }
        }
        if (!creep.memory.transfering && creep.carry.energy === creep.carryCapacity) {
            creep.memory.transfering = true;
        }

        if (creep.memory.transfering) {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity)
                      || (structure.structureType === STRUCTURE_SPAWN && structure.energy < structure.energyCapacity)
                      || (structure.structureType === STRUCTURE_TOWER && structure.energy < structure.energyCapacity*0.7)
                      || (structure.structureType === STRUCTURE_STORAGE)
                }
            });
            console.log("Targets for transport:" + targets.length);
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            if (containers.length > 0) {
                console.log("Contariner: " + JSON.stringify(containers[creep.memory.container]));
                if (creep.withdraw(containers[creep.memory.container], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[creep.memory.container], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                const energy = creep.pos.findInRange(
                  FIND_DROPPED_RESOURCES,
                  6
                );
                if (energy.length) {
                    console.log('found ' + energy[0].energy + ' energy at ', energy[0].pos + '  ' + creep.pickup(energy[0]) === ERR_NOT_IN_RANGE);
                    if (creep.pickup(energy[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(energy[0], {visualizePathStyle: {stroke: '#ff671a'}});
                    }
                } else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};


module.exports = transporter;