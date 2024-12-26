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
                const controller = creep.room.controller
                if (controller) {
                    if (creep.claimController(controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(controller, {visualizePathStyle: {stroke: '#1aa131'}});
                    }
                }
            } else {
                let exitDir = creep.room.findExitTo(toRoom);
                let exit = creep.pos.findClosestByPath(exitDir);

                if (exit != null) {
                    const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
                    const avoidRange = 4;
                    if (creep.room.name === "E56S35") {
                        exit = creep.room.getPositionAt(0, 10)
                    }
                    if (creep.room.name === "E54S34") {
                        exit = creep.room.getPositionAt(19, 0);
                    }
                    if (creep.room.name === "E53S33") {
                        exit = creep.room.getPositionAt(0, 34);
                    }
                    creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffaa00'}}, {
                        costCallback: function (roomName, costMatrix) {
                            console.log("Room name: " + roomName);
                            hostiles.forEach(hostile => {
                                for (let dx = -avoidRange; dx <= avoidRange; dx++) {
                                    for (let dy = -avoidRange; dy <= avoidRange; dy++) {
                                        const x = hostile.pos.x + dx;
                                        const y = hostile.pos.y + dy;
                                        console.log("x: " + x + " y: " + y);
                                        costMatrix.set(x, y, 255); // Impassable
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
