let moveUtil = require('../../util/moveUtil.js');

const roleRemoteBioHarvester = {

    /**
     * @param {Creep} creep
     * @param {String} toRoom **/
    run: function (creep, toRoom) {
        if (creep.memory.toRoom === undefined) {
            creep.memory.toRoom = toRoom;
        }
        if (creep.memory.collect) {
            moveUtil.moveToRoom(creep, creep.memory.toRoom, withdraw);
        } else {

            if (!creep.memory.collect && creep.store.getUsedCapacity() === 0) {
                creep.memory.collect = true;
            } else {
                Object.keys(creep.store).forEach(resourceType => {
                    const terminals = Game.rooms[creep.memory.room].find(FIND_STRUCTURES, {
                        filter: (structure) => structure.structureType === STRUCTURE_TERMINAL
                    });
                    if (terminals.length > 0) {
                        if (creep.transfer(terminals[0], resourceType) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(terminals[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
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
    const terminals = Game.rooms[creep.memory.room].find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_TERMINAL
    });
    if (terminals.length > 0 && creep.memory.termintalDistance === undefined && creep.store.getUsedCapacity() > 0) {
        console.log("Calculating terminal distance for " + creep.name);
        const {path, opts, cost, incomplete} = PathFinder.search(creep.pos, { pos: terminals[0].pos, range: 1 });
        creep.memory.termintalDistance = cost;
    }
    if (creep.memory.collect && creep.store.getFreeCapacity() === 0 || creep.ticksToLive < creep.memory.termintalDistance + 40) {
        creep.memory.collect = false;
    } else {
        const deposits = creep.room.find(122)
        if (deposits.length > 0) {
            if (creep.harvest(deposits[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(deposits[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}

module.exports = roleRemoteBioHarvester;

