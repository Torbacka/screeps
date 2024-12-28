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
    let harvesters = _.filter(creeps['harvester'] || [], harvester => harvester.ticksToLive - harvester.memory.distanceToSource - 10 - harvester.memory.spawnTime > 0);
    let energyAvailable = room.energyCapacityAvailable;
    let body;
    let role;
    if (!('Transporter' in creeps) && room.energyAvailable < 800) {
        role = 'Transporter';
        body = [].concat(...Array(4).fill([CARRY, MOVE]));
    } else if (!('harvester' in creeps)  && room.energyAvailable < 600) {
        role = 'harvester';
        body = [WORK, CARRY, MOVE];
    } else if (harvesters.length < 2) {
        role = 'harvester';
        body = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE];
    } else if (!('Transporter' in creeps) || creeps['Transporter'].length < 2) {
        role = 'Transporter';
        body = [].concat(...Array(6).fill([CARRY,CARRY, MOVE]));
    } else if ((!('builder' in creeps))) {
        role = 'builder';
        body = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
    } else if (!('upgrader' in creeps) || creeps['upgrader'].length < 3) {
        role = 'upgrader';
        body = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
    } else if (!('mineralHarvester' in creeps) && mineralsToMine(room)) {
        const maxSets = Math.floor(energyAvailable / 550);
        body = [].concat(...Array(maxSets).fill([WORK, WORK, WORK, WORK, WORK, MOVE]));
        role = 'mineralHarvester';
    } else if (!('remoteAttacker' in creeps) && false) {
        role = 'remoteAttacker';
        const maxSets = Math.floor(energyAvailable / 260);
        const remainingEnergy = energyAvailable - maxSets * 260;
        const toughSets = Math.floor(remainingEnergy / 60);
        body = [].concat(...Array(maxSets + toughSets).fill([TOUGH]));
        body = body.concat(...Array(maxSets).fill([RANGED_ATTACK, MOVE, MOVE]));
        body = body.concat(...Array(toughSets).fill([MOVE]));
    } else if (!('remoteHealer' in creeps) && false) {
        role = 'remoteHealer';
        const maxSets = Math.floor(energyAvailable / 300);
        body = [].concat(...Array(maxSets).fill([HEAL, MOVE]));
    } else if (!('remoteBuilder' in creeps) && false) {
        role = 'remoteBuilder';
        const maxSets = Math.floor(energyAvailable / 200);
        body = [].concat(...Array(maxSets).fill([WORK, CARRY, MOVE]));
    } else if (!('remoteHarvester' in creeps) || creeps['remoteHarvester'].length < 2) {
        role = 'remoteHarvester';
        const maxSets = Math.floor(energyAvailable / 200);
        body = [].concat(...Array(maxSets).fill([WORK, CARRY, MOVE]));
    } else if (!('RemoteTransporter' in creeps) && false) {
        console.log("Spawning remoteTransporter");
        role = 'remoteTransporter';
        const maxSets = Math.floor(energyAvailable / 100);
        body = Array(maxSets).fill(CARRY).concat(Array(maxSets).fill(MOVE));
    } else if (!('remoteClaimer' in creeps) && false) {
        role = 'remoteClaimer';
        body =[CLAIM, MOVE];
    } else if (('mineralHarvester' in creeps) && minerals.length > 1 && minerals[0].mineralAmount > 0) {
        role = 'mineralHarvester';
        body = Array(10).fill(WORK).concat(Array(3).fill(MOVE));
    }

    if (body && role) {
        spawner.spawnCreep(body, `${role}${Game.time}`,
            {memory: {role: role, room: roomName}});
    }


};
