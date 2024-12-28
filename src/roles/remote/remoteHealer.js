let moveUtil = require('../../util/moveUtil.js');
let remoteUtil = require('./remoteUtil.js');
const roleRemoteTransporter = {

    /**
     * @param {Creep} creep
     * @param {String} mainRoom
     * @param {String} toRoom **/
    run: function (creep, mainRoom, toRoom) {
        moveUtil.moveToRoom(creep, toRoom, heal);
    }
};

function findClosestAttacker(creep) {
    const attacker = _.filter(Game.creeps, c => c.memory.role === 'remoteAttacker')
        .sort((a, b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep));
    if (attacker.length > 0 ) {
        return attacker[0];
    }
    return null;
}

/**
 * Start clearing minerals and later go for other hostile creeps
 *
 * @param {Creep} creep
 * @param {String} roomName
 * **/
function heal(creep, roomName) {
    const closestAttacker = findClosestAttacker(creep);
    const closestHostile = remoteUtil.findClosestHostile(creep);
    const rangeToHostile = creep.pos.getRangeTo(closestHostile);
    //if (creep.ticksToLive < 500 && !creep.memory.distanceToSpawn) {
    //    creep.memory.distanceToSpawn = remoteUtil.calculatingSourceCost(creep);
    //    creep.memory.spawnTime =  creep.body.length*3;
    //}
    if (closestAttacker) {
        const rangeToTarget = creep.pos.getRangeTo(closestAttacker);
        if (rangeToTarget > 1) {
            creep.moveTo(closestAttacker, {visualizePathStyle: {stroke: '#ff0000'}});
        } else if (rangeToTarget === 1) {
            const direction = creep.pos.getDirectionTo(closestAttacker);
            creep.move(direction);
        } else if (rangeToHostile < 3 || (creep.hitsMax - creep.hits > 1000)) {
            const fleePath = remoteUtil.calculateFleePath(creep, closestHostile, roomName);
            creep.moveByPath(fleePath);
        }
        if (closestAttacker.hits < closestAttacker.hitsMax) {
            creep.heal(closestAttacker);
        }
    }
}

module.exports = roleRemoteTransporter;

