/**
 *
 * @param {String} romName
 */
module.exports = function (romName) {
    const creeps = _.groupBy(Game.creeps, (creep) => creep.memory.role);
    if (creeps['harvester'] === undefined && Game.rooms[romName].energyAvailable >= 300) {
        let newName = 'Harvester' + Game.time;
        Game.spawns['home'].spawnCreep([WORK, CARRY, MOVE], newName,
            {memory: {role: 'harvester'}});
    }

    if (creeps['harvester'].length < 2) {
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
        Game.spawns['home'].spawnCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], newName,
            {memory: {role: 'upgrader'}});
    }

};
