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
            if (toRoom === creep.room.name) {
                attack(creep, toRoom);
            } else {
                let exitDir = creep.room.findExitTo(toRoom);
                let exit = creep.pos.findClosestByPath(exitDir);

                if (exit != null) {
                    const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
                    const avoidRange = 4;
                    //if (creep.room.name === "E55S34") {
                    //    exit = creep.room.getPositionAt(0, 21)
                    //}
                    if (creep.room.name === "E56S35") {
                        exit = creep.room.getPositionAt(0, 13);
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

/**
 * @param {Creep} creep
 * @param {String} roomName
 * **/
function attack(creep, roomName) {
    const invaderCore = creep.room.find(FIND_HOSTILE_STRUCTURES );
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
