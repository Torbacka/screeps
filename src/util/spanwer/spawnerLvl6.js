function mineralsToMine(room) {
    const minerals = room.find(FIND_MINERALS);
console.log("Minerals: " + JSON.stringify(minerals) + " " + minerals.length + " " + minerals[0].mineralAmount);
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
    if (!('Transporter' in creeps) && room.energyAvailable < 800) {
        let newName = 'Transporter' + Game.time;
        spawner.spawnCreep([CARRY, MOVE], newName,
            {memory: {role: 'Transporter'}});
    } else if (creeps['harvester'] === undefined && room.energyAvailable < 600) {
        let newName = 'Harvester' + Game.time;
        spawner.spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'harvester'}});
    } else if (harvesters.length < 2) {
        let newName = 'Harvester' + Game.time;
        spawner.spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE, MOVE], newName,
            {memory: {role: 'harvester'}});
    } else if (!('Transporter' in creeps) || creeps['Transporter'].length < 2) {
        let newName = 'Transporter' + Game.time;
        spawner.spawnCreep([CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE], newName,
            {memory: {role: 'Transporter'}});
    } else if ((!('builder' in creeps) || creeps['builder'].length < 1)) {
        let newName = 'Builder' + Game.time;
        spawner.spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
            {memory: {role: 'builder'}});
    } else if (!('upgrader' in creeps) || creeps['upgrader'].length <3) {
        let newName = 'Upgrader' + Game.time;
        spawner.spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
            {memory: {role: 'upgrader'}});
    } else if (!('mineralHarvester' in creeps) && mineralsToMine(room)) {
        const maxSets = Math.floor(energyAvailable / 550);
        const body = [].concat(...Array(maxSets).fill([WORK, WORK, WORK, WORK, WORK, MOVE]));
        let newName = 'MineralHarvester' + Game.time;
        spawner.spawnCreep(body, newName,
            {memory: {role: 'mineralHarvester'}});
    } else if (false) {

        let newName = 'remoteAttacker' + Game.time;
        const maxSets = Math.floor(1300 / 130);
        const body = [].concat(...Array(maxSets).fill([ATTACK, MOVE]));
        spawner.spawnCreep(body, newName,
            {memory: {role: 'remoteAttacker'}});
    } else if (!('remoteBuilder' in creeps)) {
        let newName = 'remoteBuilder' + Game.time;
        const maxSets = Math.floor(energyAvailable / 200);
        const body = [].concat(...Array(maxSets).fill([WORK, CARRY, MOVE]));
        spawner.spawnCreep(body, newName,
            {memory: {role: 'remoteBuilder'}});
    } else if (!('remoteHarvester' in creeps) || creeps['remoteHarvester'].length < 2) {
        let newName = 'remoteHarvester' + Game.time;
        const maxSets = Math.floor(energyAvailable / 200);
        const body = [].concat(...Array(maxSets).fill([WORK, CARRY, MOVE]));
        spawner.spawnCreep(body, newName,
            {memory: {role: 'remoteHarvester'}});
    } else if (false) {
        const newName = 'RemoteTransporter' + Game.time;
        const maxSets = Math.floor(energyAvailable / 100);
        const body = Array(maxSets).fill(CARRY).concat(Array(maxSets).fill(MOVE));
        spawner.spawnCreep(body, newName,
            {memory: {role: 'remoteTransporter'}});
    } else if (false) {
        const newName = 'remoteClaimer' + Game.time;
        spawner.spawnCreep([CLAIM, MOVE], newName,
            {memory: {role: 'remoteClaimer'}});
    } else if (('mineralHarvester' in creeps) && minerals.length > 1 && minerals[0].mineralAmount > 0) {
        let newName = 'mineralHarvester' + Game.time;
        let body = Array(10).fill(WORK).concat(Array(3).fill(MOVE));
        spawner.spawnCreep(body, newName,
            {memory: {role: 'mineralHarvester'}});
    }

};
