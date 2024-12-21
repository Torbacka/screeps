let moveUtil = require('../../util/moveUtil.js');
let stats = require('../../util/stats.js');
const roleRemoteTransporter = {

    /**
     * @param {Creep} creep
     * @param {String} mainRoom
     * @param {String} toRoom **/
    run: function (creep, mainRoom, toRoom) {
        if (creep.memory.attack === undefined) {
            creep.memory.attack = true;
        }
        if (creep.memory.attack) {
            moveUtil.moveToRoom(creep, toRoom, attack);
        }
    }
};

/**
 * @param {Creep} creep
 * @param {String} roomName
 * **/
function attack(creep, roomName) {
    const invaderCore = creep.room.find(FIND_HOSTILE_STRUCTURES, {
        filter: structure => {
            return structure.structureType === STRUCTURE_INVADER_CORE;
        }
    });
    if (invaderCore.length > 0) {
        const disResult = creep.attack(invaderCore[0]);
        if (creep.attack(invaderCore[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(invaderCore[0], { visualizePathStyle: { stroke: '#ff0000' } });
        } else {
            console.log("Attack result: " + disResult);
        }
    }
}

module.exports = roleRemoteTransporter;
