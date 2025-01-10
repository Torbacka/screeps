const roomUtil = require("./roomUtil.js");

function mineralsToMine(room) {
    const minerals = room.find(FIND_MINERALS);
    if (minerals.length === 0) return false;

    return minerals[0].mineralAmount !== 0;
}

/**
 *
 er * @param {String} roomName
 */
module.exports = function (roomName) {

    const creeps = _.groupBy(_.filter(Game.creeps, creep => creep.room.name === roomName || creep.memory.role.includes("remote")), (creep) => creep.memory.role);
    let room = Game.rooms[roomName];
    const spawner = room.find(FIND_MY_SPAWNS)[0];
    let minerals = room.find(FIND_MINERALS);
    let extractor = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTRACTOR}}) || [];
    let harvesters = _.filter(creeps['harvester'] || [], harvester => harvester.ticksToLive - harvester.memory.distanceToSource - 10 - harvester.memory.spawnTime > 0);
    let remoteAttackers = _.filter(creeps['remoteAttacker'] || [], remoteAttacker => {
        if (remoteAttacker.memory.distanceToSpawn !== undefined) {
            return remoteAttacker.ticksToLive - remoteAttacker.memory.distanceToSpawn - 55 > 0;
        } else {
            return remoteAttacker.ticksToLive > 0;
        }
    });
    let healers = []/*_.filter(creeps['healers'] || [], harvester => harvester.ticksToLive - harvester.memory.distanceToSpawn - 10 - harvester.memory.spawnTime > 0);*/
    let energyAvailable = room.energyCapacityAvailable;
    let body;
    let role;
    roomUtil.setupRoomMemory( room.find(FIND_SOURCES), room.storage, roomName);
    let numberOfTransporters = 1;
    if (Memory[roomName].sourceDistanceToStorage > 15) {
        numberOfTransporters = 2;
    }
    if (!('Transporter' in creeps) && room.energyAvailable < 800) {
        role = 'Transporter';
        body = [].concat(...Array(3).fill([CARRY, MOVE]));
    } else if (!('harvester' in creeps) && room.energyAvailable < 600) {
        role = 'harvester';
        body = [WORK, CARRY, MOVE];
    } else if (harvesters.length < 2) {
        role = 'harvester';
        body = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE];
    } else if (!('Transporter' in creeps) || creeps['Transporter'].length < 2) {
        role = 'Transporter';
        console.log("Spawning transporter in room " + roomName);
        body = [].concat(...Array(7).fill([CARRY, CARRY, MOVE]));
    } else if ((!('builder' in creeps)) ) {
        role = 'builder';
        body = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
    } else if (!('upgrader' in creeps) || creeps['upgrader'].length < 3) {
        role = 'upgrader';
        body = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
    } else if (!('mineralHarvester' in creeps) && mineralsToMine(room) && extractor.length > 0) {
        const maxSets = Math.floor(energyAvailable / 550);
        body = [].concat(...Array(maxSets).fill([WORK, WORK, WORK, WORK, WORK, MOVE])).splice(0, 50);
        role = 'mineralHarvester';
    }  else if (!('remoteBioHarvester' in creeps) && roomName === 'E51S33' && false) {
        console.log("Spawning remoteBioHarvester");
        role = 'remoteBioHarvester';
        const maxSets = Math.floor(energyAvailable / 250);
        body = [].concat(...Array(maxSets).fill([WORK, CARRY, MOVE, MOVE]));
    }else if (remoteAttackers.length < 1 && roomName === 'E51S33' && false ) {
        role = 'remoteAttacker';
        body = [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE];
    } else if (healers.length < 1 && false) {
        role = 'remoteHealer';
        const maxSets = Math.floor(energyAvailable / 300);
        body = [].concat(...Array(maxSets).fill([HEAL, MOVE]));
    } else if (!('remoteBuilder' in creeps) && false) {
        role = 'remoteBuilder';
        const maxSets = Math.floor(energyAvailable / 200);
        body = [].concat(...Array(maxSets).fill([WORK, CARRY, MOVE]));
    } else if (!('remoteHarvester' in creeps)  && roomName === 'E58S34' || (roomName === 'E58S34' && creeps['remoteHarvester'].length < 2)) {
        console.log("Spawning remoteHarvester");
        role = 'remoteHarvester';
        const maxSets = Math.floor(2300 / 200);
        body = [].concat(...Array(maxSets).fill([WORK, CARRY, MOVE])).slice(0, 50);
    } else if (!('remoteTransporter' in creeps) && roomName === 'E51S33' && false) {
        console.log("Spawning remoteTransporter");
        role = 'remoteTransporter';
        const maxSets = Math.floor(500 / 100);
        body = Array(maxSets).fill(CARRY).concat(Array(maxSets).fill(MOVE));
    } else if (!('remoteClaimer' in creeps) && false) {
        role = 'remoteClaimer';
        body = [CLAIM, MOVE];
    } else if (('mineralHarvester' in creeps) && minerals.length > 1 && minerals[0].mineralAmount > 0) {
        role = 'mineralHarvester';
        body = Array(10).fill(WORK).concat(Array(3).fill(MOVE));
    }
    if (body && role) {
        spawner.spawnCreep(body, `${role}${Game.time}`,
            {memory: {role: role, room: roomName}});
    }


};
