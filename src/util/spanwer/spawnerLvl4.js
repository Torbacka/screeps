const assignSource = require('./assignSource.js');

/**
 *
 er * @param {String} roomName
 */
module.exports = function (roomName) {
    const creeps = _.groupBy(_.filter(Game.creeps, creep => creep.room.name === roomName), (creep) => creep.memory.role);
    const room = Game.rooms[roomName];
    if (!room) return;
    const spawner = room.find(FIND_MY_SPAWNS)[0];
    if (!spawner) return;
    let energyAvailable = room.energyCapacityAvailable;
    let newName = Game.time.toString();

    if (!('harvester' in creeps) && !('Transporter' in creeps)) {
        const key = assignSource(room);
        spawner.spawnCreep([WORK, MOVE, CARRY, MOVE, CARRY], newName, {
            memory: {
                role: 'generalist',
                source: key
            }
        });
    } else if (!('harvester' in creeps) || creeps["harvester"].length < 2) {
        console.log("kommer jag hit");
        spawner.spawnCreep([WORK, WORK, WORK, WORK, WORK, MOVE], newName, {
            memory: {
                role: 'harvester'
            }
        });
    } else if (!('Transporter' in creeps) || creeps["Transporter"].length < 1) {

        const maxSets = Math.floor((room.energyAvailable) / 100);
        const body = [].concat(...Array(maxSets).fill([CARRY, MOVE]));
        spawner.spawnCreep(body, newName, {
            memory: {
                role: 'Transporter'
            }
        });
    } else if (!('upgrader' in creeps) || creeps['upgrader'].length < 2) {
        const baseCost = 200;
        const extraCost = 100;
        const maxSets = Math.floor(energyAvailable / baseCost);
        let body = [].concat(...Array(maxSets).fill([WORK, CARRY, MOVE]));
        if (energyAvailable - maxSets * baseCost >= extraCost) {
            body.push(CARRY, MOVE);
        }
        spawner.spawnCreep(body, newName, {
            memory: {
                role: 'upgrader'
            }
        });
    } else if (!('builder' in creeps)) {
        let newName = 'Builder' + Game.time;
        spawner.spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], newName,
            {memory: {role: 'builder'}});
    }

}
;
