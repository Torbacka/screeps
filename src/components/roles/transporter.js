const transporter = {
    run: function (creep, containers = null) {


        if (containers == null) {
            containers = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => {
                    return (i.structureType === STRUCTURE_CONTAINER)
                }
            });

        }
        let mineralContainer = containers[containers.length - 1];
        containers.forEach(container => {
            let resourceTypes = Object.keys(container.store);
            if (!resourceTypes.includes(RESOURCE_ENERGY)) {
                mineralContainer = container
            }
        });
        if (creep.memory.container === undefined) {
            creep.memory.container = 0;
        }
        if (creep.memory.transfering && _.sum(creep.carry) === 0) {
            creep.memory.transfering = false;
            if (creep.memory.container === 0 && containers[creep.memory.container].store.getUsedCapacity() > 0) {
                creep.memory.container = 1;
            } else if (containers[creep.memory.container].store.getUsedCapacity() > 0) {
                creep.memory.container = 0;
            }
        }
        if (containers.length > 0) {

            if (containers.length === 1) {
                if (containers[0].store[RESOURCE_ENERGY] < 30 && _.sum(creep.carry) > 0) {
                    creep.memory.transfering = true;
                }
            } else if (containers[creep.memory.container].store[RESOURCE_ENERGY] < 30 && _.sum(creep.carry) > 0) {
                creep.memory.transfering = true;
            }
        }
        if (!creep.memory.transfering && _.sum(creep.carry) === creep.carryCapacity) {
            creep.memory.transfering = true;
        }

        if (creep.memory.transfering) {
            let target;
            if (creep.carry.energy === 0) {
                target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_STORAGE)
                    },
                });
            }
            else {
                target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_EXTENSION && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity()) ||
                          (structure.structureType === STRUCTURE_SPAWN &&  structure.store[RESOURCE_ENERGY] < structure.store.getCapacity())
                    },
                });

                
                if (target === null) {
                    target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType === STRUCTURE_TOWER && structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY))
                        },
                    });
                }
                console.log("Target2 " + target);
                if (target === null) {
                    target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType === STRUCTURE_STORAGE)
                        },
                    });
                }
            }
            if (creep.transfer(target, Object.keys(creep.carry)[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            extract(creep, mineralContainer, containers);
        }
    }
};

function extract(creep, mineralContainer, containers) {
    const energy = creep.pos.findInRange(
      FIND_DROPPED_RESOURCES,
      6, {
          filter: (resource) => {
              return resource.amount > 400
          }
      }
    );
    console.log("Storage: " + JSON.stringify(creep.room.storage));
    if (energy.length) {

        if (creep.pickup(energy[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(energy[0], {visualizePathStyle: {stroke: '#ff671a'}});
        }
    } else if (creep.room.storage !== undefined && creep.room.storage.store.getFreeCapacity() && _.sum(mineralContainer.store) > 1500) {
        if (creep.withdraw(mineralContainer, Object.keys(mineralContainer.store)[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(mineralContainer, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    } else if (containers.length > 0) {
        if (creep.withdraw(containers[creep.memory.container], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(containers[creep.memory.container], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
}


module.exports = transporter;
