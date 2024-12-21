let moveUtil = require('../../util/moveUtil.js');
const roleRemoteTransporter = {

    /**
     * @param {Creep} creep
     * @param {String} mainRoom
     * @param {String} toRoom **/
    run: function (creep, mainRoom, toRoom) {
        if (creep.memory.collect === undefined) {
            creep.memory.collect = true;
        }
        if (creep.memory.collect) {
            let tombstone = creep.room.find(FIND_TOMBSTONES, {
                filter: tombstone => {
                    return tombstone.store.getUsedCapacity() > 200;
                }
            });
            if (tombstone.length > 0) {
                Object.keys(tombstone.store).forEach(resourceType => {
                    if (creep.withdraw(tombstone[0], resourceType) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(tombstone[0]);
                    }
                });
            }
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

module.exports = roleRemoteTransporter;
