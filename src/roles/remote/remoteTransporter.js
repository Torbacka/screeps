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
            let tombstones = creep.room.find(FIND_TOMBSTONES, {
                filter: tombstone => {
                    return tombstone.store.getUsedCapacity() > 200;
                }
            });
            if (tombstones.length > 0) {
                Object.keys(tombstones[0].store).forEach(resourceType => {
                    if (creep.withdraw(tombstones[0], resourceType) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(tombstones[0]);
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
        const structuresWithEnergy = creep.pos.findClosestByRange(123, {
            filter: structure => {
                return structure.store && structure.store[RESOURCE_ENERGY] > 0;
            }
        });
        if (structuresWithEnergy) {
            if (creep.withdraw(structuresWithEnergy, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(structuresWithEnergy, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            let storages = [creep.room.storage, creep.room.terminal, creep.room.factory]
                .filter(structure => structure !== undefined && structure.store.getUsedCapacity() > 0);
            console.log("storages: " + JSON.stringify(storages));
            if (storages.length > 0) {
                const mineralType = Object.keys(storages[0].store).find(
                    resourceType => resourceType !== RESOURCE_ENERGY && storages[0].store[resourceType] > 0
                );

                if (creep.room.name === roomName && creep.withdraw(storages[0], mineralType) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(storages[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }

        }
    }
}

module.exports = roleRemoteTransporter;
