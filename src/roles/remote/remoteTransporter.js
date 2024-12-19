let moveUtil = require('../../util/moveUtil.js');
const roleRemoteTransporter = {

    /**
     * @param {Creep} creep
     * @param {Room} mainRoom
     * @param {Room} toRoom **/
    run: function (creep, mainRoom, toRoom) {
        if (creep.memory.collect === undefined) {
            creep.memory.collect = true;
        }
        if (creep.memory.collect) {
            moveUtil.moveToRoom(creep, toRoom, withdraw);
        } else {
            if (!creep.memory.collect && creep.store.getUsedCapacity() === 0) {
                creep.memory.collect = true;
            } else {
                Object.keys(creep.store).forEach(resourceType => {
                    if (creep.transfer(Game.rooms[mainRoom].storage, resourceType) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.rooms[mainRoom].storage);
                    }
                });

            }
        }
    }
};

/**
 * @param {Creep} creep
 * @param {String} roomName
 * **/
function withdraw(creep, roomName) {
    if (creep.memory.collect && creep.store.getFreeCapacity() === 0) {
        creep.memory.collect = false;
    } else {
        const structuresWithEnergy = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: structure => {
                return structure.store && structure.store[RESOURCE_ENERGY] > 0;
            }
        });
        if (structuresWithEnergy) {
            if (creep.room.name === roomName && creep.withdraw(structuresWithEnergy, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(structuresWithEnergy, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            let storage = creep.room.storage;
            const mineralType = Object.keys(storage.store).find(
                resourceType => resourceType !== RESOURCE_ENERGY && storage.store[resourceType] > 0
            );

            if (creep.room.name === roomName && creep.withdraw(storage, mineralType) === ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
}

/**
 * Transfer all collected energy to the main room storage
 *
 * @param {Creep} creep
 * @param {String} mainRoom
 * **/
function transfer(creep, mainRoom) {
    if (!creep.memory.collect && creep.store[RESOURCE_ENERGY] === 0) {
        creep.memory.collect = true;
    } else {
        if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            const answer = creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}}, {
                maxRooms: 1,
                costCallback: (roomName, costMatrix) => {
                    const room = Game.rooms[roomName];
                    if (!room) {
                        console.log("NO room");
                        return;
                    }

                    // Mark exits as higher cost to discourage bouncing
                    room.find(FIND_EXIT).forEach(exit => {
                        costMatrix.set(exit.x, exit.y, 255);
                    });
                }
            });
        }
    }
}

module.exports = roleRemoteTransporter;
