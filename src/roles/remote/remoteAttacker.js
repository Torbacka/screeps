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
    let sourceKeeper;
    if (!closestHostile) {
        sourceKeeper = Game.getObjectById('5bbcb06f9099fc012e63c2d1')
    }
    if (!creep.memory.ready) {
        remoteUtil.checkIfReady(creep, Game.rooms[roomName]);
    }
    const healer = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
        filter: (creep) => creep.memory.role === 'remoteHealer'
    });
    if (creep.memory.ready && closestHostile) {
        const rangeToTarget = creep.pos.getRangeTo(closestHostile);
        const sourceKeeperRange = creep.pos.getRangeTo(sourceKeeper);
        if (rangeToTarget > 3 && creep.pos.getRangeTo(healer)  < 2 && healer.fatigue <= healer.body.length) {
            creep.moveTo(closestHostile, {visualizePathStyle: {stroke: '#ff0000'}});
        }  else  if (sourceKeeperRange > 5) {
            creep.moveTo(sourceKeeper, {visualizePathStyle: {stroke: '#ff0000'}});
        }else if (rangeToTarget < 3 || (creep.hitsMax - creep.hits > 1000)) {
            console.log("Kommer jag hit?");
            const fleePath = remoteUtil.calculateFleePath(creep, closestHostile, roomName);
            console.log("Flee path: " + JSON.stringify(fleePath));
            console.log(creep.moveByPath(fleePath.path));
        }
        creep.rangedAttack(closestHostile);
    }
}

module.exports = roleRemoteTransporter;

