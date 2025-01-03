let moveUtil = require('../../util/moveUtil.js');
let remoteUtil = require('./remoteUtil.js');
const roleRemoteTransporter = {

    /**
     * @param {Creep} creep
     * @param {String} mainRoom
     * @param {String} toRoom **/
    run: function (creep, mainRoom, toRoom) {
        if( creep.room.find(FIND_HOSTILE_CREEPS)){
            attack(creep, toRoom);
        }
        if (creep.memory.attack === undefined) {
            creep.memory.attack = true;
        }
        moveUtil.moveToRoom(creep, toRoom, attack);
    }
};

/**
 * Start clearing minerals and later go for other hostile creeps
 *
 * @param {Creep} creep
 * @param {String} roomName
 * **/
function attack(creep, roomName) {
    if (creep.memory.distanceToSpawn === undefined && creep.room.name === roomName) {
        creep.memory.distanceToSpawn = remoteUtil.calculatingSpawnDistance(creep);
    }
    const closestHostile = creep.room.find(FIND_HOSTILE_CREEPS);
    if (closestHostile.length > 0) {
        let attack = creep.rangedAttack(closestHostile[0]);
        console.log("Attack result: " + JSON.stringify(attack));
        if (attack === ERR_NOT_IN_RANGE) {
            creep.moveTo(closestHostile[0], {visualizePathStyle: {stroke: '#ff0000'}});
        } else if (attack === OK) {
            Game.notify("Attacking hostile creep: " + closestHostile[0].owner.username + " in room: " + roomName);
            creep.moveTo(closestHostile[0], {visualizePathStyle: {stroke: '#ff0000'}});
        }
    } else {
        const positionAt = creep.room.getPositionAt(32, 39);
        if (positionAt) {
            creep.moveTo(positionAt, {visualizePathStyle: {stroke: '#ff0000'}});
        }
    }
}

module.exports = roleRemoteTransporter;

