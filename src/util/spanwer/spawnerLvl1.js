/**
 *
er * @param {String} roomName
 */
module.exports = function (roomName) {

    const creeps = _.groupBy(Game.creeps, (creep) => creep.memory.role);
    let energyAvailable = Game.rooms[roomName].energyCapacityAvailable;
    const spawner = Game.rooms[roomName].find(FIND_MY_SPAWNS)[0];
    if (spawner === undefined) {
        return;
    }
    if (!('generalist' in creeps) || creeps['generalist'].length < 6) {
        let newName = 'Generalist' + Game.time;
        const baseCost = 200; // Cost of one set [WORK, CARRY, MOVE]
        const extraCost = 100; // Cost of [CARRY, MOVE]
        const maxSets = Math.floor(energyAvailable / baseCost);
        let body = [].concat(...Array(maxSets).fill([WORK, CARRY, MOVE]));

        if (energyAvailable - maxSets * baseCost >= extraCost) {
            body.push(CARRY, MOVE);
        }
        spawner.spawnCreep(body, newName, {
            memory: { role: 'generalist' }
        });
    }

};
