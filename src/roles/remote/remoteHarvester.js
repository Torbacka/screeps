let moveUtil = require('../../util/moveUtil.js');
let stats = require('../../util/stats.js');
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
            moveUtil.moveToRoom(creep, toRoom, withdraw);
        } else {
            if (!creep.memory.collect && creep.store.getUsedCapacity() === 0) {
                creep.memory.collect = true;
            } else {
                let transferResult = creep.transfer(Game.rooms[mainRoom].storage, RESOURCE_ENERGY);
                if (transferResult === ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.rooms[mainRoom].storage,{visualizePathStyle: {stroke: '#ffffff'}});
                } else if (transferResult === OK) {
                    console.log(Game.time + " - " + creep.name + " transferred " + RESOURCE_ENERGY + " to storage");
                    //stats.remoteHarvesterStats(creep, mainRoom);
                } else {
                    console.log("Transfer result: " + transferResult);
                }
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
        const extractors = creep.room.find(FIND_STRUCTURES, {
            filter: structure => { return structure.structureType === STRUCTURE_EXTRACTOR }
        });
        let target;
        if (extractors.length > 0) {
            target = creep.room.find(FIND_MINERALS);
        } else {
            target = creep.room.find(FIND_SOURCES);
        }
        const tombstones = creep.room.find(FIND_TOMBSTONES, {
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
        } else
        if (target.length) {
            if (creep.harvest(target[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
}

module.exports = roleRemoteTransporter;
