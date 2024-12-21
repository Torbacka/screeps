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
            moveUtil.moveToRoom(creep, toRoom, claim);
        }
    }
};

/**
 * @param {Creep} creep
 * @param {String} roomName
 * **/
function claim(creep, roomName) {
    const controller = creep.room.controller;
    console.log("Room controller: " + JSON.stringify(controller));
    if (controller) {
        if (creep.attack(controller) === ERR_NOT_IN_RANGE) {
            const result = creep.moveTo(invaderCore[0], { visualizePathStyle: { stroke: '#ff0000' } });
            console.log("Result: " + result);
        }
    }
}

module.exports = roleRemoteTransporter;
