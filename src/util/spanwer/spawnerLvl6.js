/**
 *
er * @param {String} roomName
 */
module.exports = function (roomName) {

    const creeps = _.groupBy(Game.creeps, (creep) => creep.memory.role);
    let minerals = Game.rooms[roomName].find(FIND_MINERALS);
    let energyAvailable = Game.rooms[roomName].energyCapacityAvailable;
    if (creeps['harvester'] === undefined && Game.rooms[roomName].energyAvailable < 600) {
        let newName = 'Harvester' + Game.time;
        Game.spawns['home'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'harvester'}});
    } else if (!('harvester' in creeps) || creeps['harvester'].length < 2) {
        let newName = 'Harvester' + Game.time;
        Game.spawns['home'].spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE, MOVE], newName,
            {memory: {role: 'harvester'}});
    } else if (!('Transporter' in creeps) || creeps['Transporter'].length < 2) {
        let newName = 'Transporter' + Game.time;
        Game.spawns['home'].spawnCreep([CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE], newName,
            {memory: {role: 'Transporter'}});
    } else if ((!('builder' in creeps) || creeps['builder'].length < 1)) {
        let newName = 'Builder' + Game.time;
        Game.spawns['home'].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
            {memory: {role: 'builder'}});
    } else if (!('upgrader' in creeps) || creeps['upgrader'].length < 2) {
        let newName = 'Upgrader' + Game.time;
        Game.spawns['home'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
            {memory: {role: 'upgrader'}});
    } else if (!('remoteHarvester' in creeps)) {
        let newName = 'remoteHarvester' + Game.time;
        const maxSets = Math.floor(energyAvailable / 200);
        const body = [].concat(...Array(maxSets).fill([WORK, CARRY, MOVE]));
        Game.spawns['home'].spawnCreep(body, newName,
            {memory: {role: 'remoteHarvester'}});
    }else if (!('remoteTransporter' in creeps) || creeps['remoteTransporter'].length < 1) {
        let newName = 'RemoteTransporter' + Game.time;
        const maxSets = Math.floor(energyAvailable / 100);
        const body = Array(maxSets).fill(CARRY).concat(Array(maxSets).fill(MOVE));
        Game.spawns['home'].spawnCreep(body, newName,
            {memory: {role: 'remoteTransporter'}});
    } else if (false) {
        let newName = 'remoteAttacker' + Game.time;
        const maxSets = Math.floor(energyAvailable / 130);
        const body = [].concat(...Array(maxSets).fill([ATTACK, MOVE]));
        Game.spawns['home'].spawnCreep(body, newName,
            {memory: {role: 'remoteAttacker'}});
    } else if (('mineralHarvester' in creeps) && minerals.length > 1 && minerals[0].mineralAmount > 0) {
        let newName = 'mineralHarvester' + Game.time;
        let body = Array(10).fill(WORK).concat(Array(3).fill(MOVE));
        Game.spawns['home'].spawnCreep(body, newName,
            {memory: {role: 'mineralHarvester'}});
    }

};
