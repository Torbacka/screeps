let moveUtil = require('../../util/moveUtil.js');


const roleRemoteTransporter = {

    /**
     * @param {Creep} creep
     * @param {String} mainRoom
     * @param {String} toRoom **/
    run: function (creep, mainRoom, toRoom) {
        if (creep.memory.claim === undefined) {
            creep.memory.claim = true;
        }
        if (creep.memory.claim) {

            if (toRoom === creep.room.name) {
                if (creep.memory.building === undefined) {
                    creep.memory.building = false;
                }
                if (creep.memory.building) {
                    if (creep.store.getUsedCapacity() === 0) {
                        creep.memory.building = false;
                    }
                    let spawns = creep.room.find(FIND_CONSTRUCTION_SITES, {
                        filter: structure => {
                            return structure.structureType === STRUCTURE_SPAWN
                        }
                    });
                    const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                    if (spawns.length) {
                        if (creep.build(spawns[0]) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(spawns[0], {visualizePathStyle: {stroke: '#1aa131'}});
                        }
                    } else if (targets.length > 0) {
                        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#1aa131'}});
                        }
                    }
                } else {
                    if (creep.store.getFreeCapacity() === 0) {
                        creep.memory.building = true;
                    }
                    const source = creep.room.find(FIND_SOURCES)[0];
                    let droppedResources = creep.room.find(FIND_DROPPED_RESOURCES, {
                        filter: resource => {
                            return resource.resourceType === RESOURCE_ENERGY;
                        }
                    });
                    if (droppedResources.length > 0) {
                        if (creep.pickup(droppedResources[0]) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(droppedResources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            } else {
                let exitDir = creep.room.findExitTo(toRoom);
                let exit = creep.pos.findClosestByPath(exitDir);

                if (exit != null) {
                    const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
                    const avoidRange = 15;
                    if (creep.room.name === "E55S34") {
                        exit = creep.room.getPositionAt(0, 21)
                    }
                    if (creep.room.name === "E54S34") {
                        exit = creep.room.getPositionAt(19, 0);
                    }
                    if (creep.room.name === "E53S33") {
                        exit = creep.room.getPositionAt(0, 34);
                    }
                    const result = creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffaa00'}}, {
                        costCallback: function (roomName, costMatrix) {
                            console.log("Room name: " + roomName);
                            hostiles.forEach(hostile => {
                                for (let dx = -avoidRange; dx <= avoidRange; dx++) {
                                    for (let dy = -avoidRange; dy <= avoidRange; dy++) {
                                        const x = hostile.pos.x + dx;
                                        const y = hostile.pos.y + dy;
                                        console.log("x: " + x + " y: " + y);
                                        costMatrix.set(x, y, 300); // Impassable
                                    }
                                }
                            });
                            return costMatrix;
                        }
                    });
                }
            }
        }
    }
};


module.exports = roleRemoteTransporter;
