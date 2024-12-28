let moveUtil = require('../../util/moveUtil.js');
let remoteUtil = require('./remoteUtil.js');
const roleRemoteTransporter = {

    /**
     * @param {Creep} creep
     * @param {String} mainRoom
     * @param {String} toRoom **/
    run: function (creep, mainRoom, toRoom) {
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

    const closestHostile = remoteUtil.findClosestHostile(creep);
    if (!creep.memory.ready) {
        remoteUtil.checkIfReady(creep, Game.rooms[roomName]);
    }
    const healer = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (creep) => creep.memory.role === 'remoteHealer'
    });
    if (creep.memory.ready && closestHostile) {
        const rangeToTarget = creep.pos.getRangeTo(closestHostile);
        if (rangeToTarget > 3 && creep.pos.getRangeTo(healer)  < 2) {
            creep.moveTo(closestHostile, {visualizePathStyle: {stroke: '#ff0000'}});
        } else if (rangeToTarget < 3 || (creep.hitsMax - creep.hits > 1000)) {
            const fleePath = remoteUtil.calculateFleePath(creep, closestHostile, roomName);
            creep.moveByPath(fleePath);
        }
        creep.rangedAttack(closestHostile);
    }
}

module.exports = roleRemoteTransporter;

