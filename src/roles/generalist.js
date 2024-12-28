const roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (creep.store.getUsedCapacity() === 0) {
            creep.memory.harvesting = true;
        }
        if (creep.store.getFreeCapacity() === 0) {
            creep.memory.harvesting = false;
        }

        if (!creep.memory.harvesting) {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: structure =>
                    (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            });
            const towers = creep.room.find(FIND_STRUCTURES, {
                filter: structure =>
                    structure.structureType === STRUCTURE_TOWER &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) - 200 > 0
            });
            const buildingTargets = creep.room.find(FIND_CONSTRUCTION_SITES);

            if (creep.memory.road === undefined) {
                const roadIds = _.chain(Game.creeps)
                    .filter(creep => creep.memory.role === "generalist" && creep.memory.road) // Filter creeps
                    .map(creep => creep.memory.road) // Map to road IDs
                    .uniq() // Remove duplicates
                    .value();
                const roadsToRepair = creep.room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return structure.structureType === STRUCTURE_ROAD &&
                            structure.hits < structure.hitsMax * 0.9
                            && !roadIds.includes(structure.id);
                    }
                })
                creep.memory.road = roadsToRepair.length > 0 ? roadsToRepair[0].id : undefined;
            }
            if (creep.memory.road !== undefined) {
                const road = Game.getObjectById(creep.memory.road);
                if (road.hits < road.hitsMax) {
                    if (creep.repair(road) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(road);
                    }
                } else {
                    creep.memory.road = undefined;
                }
            } else if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else if (towers.length > 0 && creep.memory.source !== "5bbcb0169099fc012e63b93b") {
                if (creep.transfer(towers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(towers[0]);
                }
            } else if (buildingTargets.length > 0 && creep.memory.source !== "5bbcb0169099fc012e63b93b") {
                if (creep.build(buildingTargets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(buildingTargets[0]);
                }
            } else {
                if (creep.room.controller) {
                    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        } else {
            const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: resource => resource.resourceType === RESOURCE_ENERGY && resource.amount > 100
            });
            const containers = creep.room.find(FIND_STRUCTURES, {
                filter: structure =>
                    structure.structureType === STRUCTURE_CONTAINER && structure.store && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
            })
            if (droppedEnergy.length > 0) {
                if (creep.pickup(droppedEnergy[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(droppedEnergy[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else if (containers.length > 0) {
                if (creep.withdraw(containers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                if (creep.harvest(Game.getObjectById(creep.memory.source)) === ERR_NOT_IN_RANGE) {
                    const result = creep.moveTo(Game.getObjectById(creep.memory.source), {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = roleBuilder;
