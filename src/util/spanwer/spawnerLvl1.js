const assignSource = require('./assignSource.js');
/**
 *
 er * @param {String} roomName
 */
module.exports = function (roomName) {

    const creeps = _.groupBy(Game.creeps, (creep) => creep.memory.role);
    const room = Game.rooms[roomName];
    if (!room) {
        return;
    }
    let energyAvailable = room.energyCapacityAvailable;
    const spawner = room.find(FIND_MY_SPAWNS)[0];
    if (spawner === undefined) {
        return;
    }

    if (!('generalist' in creeps)){
        console.log("Spawning generalist: " + roomName);
        const key = assignSource(room);
        spawner.spawnCreep([WORK, CARRY, MOVE, CARRY, MOVE], Game.time.toString(), {
            memory: {
                role: 'generalist',
                source: key
            }
        });
    }else if (creeps['generalist'].length < 7) {
        const key = assignSource(room);
        let newName = 'Generalist' + Game.time;
        let body

        const baseCost = 200; // Cost of one set [WORK, CARRY, MOVE]
        const extraCost = 100; // Cost of [CARRY, MOVE]
        const maxSets = Math.floor((energyAvailable) / baseCost);
        body = [].concat(...Array(maxSets).fill([WORK, CARRY, MOVE]));
        if (energyAvailable - maxSets * baseCost >= extraCost) {
            body.push(CARRY, MOVE);
        }

        spawner.spawnCreep(body, newName, {
            memory: {
                role: 'generalist',
                source: key
            }
        });
    }

};
