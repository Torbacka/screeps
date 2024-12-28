const assignSource = require('./assignSource.js');

/**
 *
 er * @param {String} roomName
 */
module.exports = function (roomName) {
    const creeps = _.groupBy(_.filter(Game.creeps, creep => creep.room.name === roomName || creep.memory.role.includes("remoteTransporter")), (creep) => creep.memory.role);
    const room = Game.rooms[roomName];
    if (!room) return;
    const spawner = room.find(FIND_MY_SPAWNS)[0];
    if (!spawner) return;
    let energyAvailable = room.energyCapacityAvailable;
    let newName = Game.time.toString();
    let harvesters = _.filter(creeps['harvester'] || [], harvester => harvester.ticksToLive - harvester.memory.distanceToSource - 30 - harvester.memory.spawnTime > 0);
    let storage = room.storage;
    let sources = room.find(FIND_SOURCES);
    if (!Memory[roomName]) Memory[roomName] = {};
    if (!Memory[roomName].sourceDistanceToStorage) {
        Memory[roomName].sourceDistanceToStorage = sources
            .map(source => {
                if (storage) {
                    return source.pos.getRangeTo(storage)
                }
                return 0xff;
            }).reduce((a, b) => a + b);
        console.log("Room: " + room.name + " Source distance to storage: " + Memory[roomName].sourceDistanceToStorage);
    }
    let numberOfTransporters = 1;
    if (Memory[roomName].sourceDistanceToStorage > 15) {
        numberOfTransporters = 2;
    }
    if (!('harvester' in creeps) && !('Transporter' in creeps) && !('generalist' in creeps)) {
        const key = assignSource(room);
        spawner.spawnCreep([WORK, MOVE, CARRY, MOVE, CARRY], newName, {
            memory: {
                role: 'generalist',
                source: key
            }
        });
    } else if (harvesters.length < 2) {
        const body = [WORK, WORK, WORK, WORK, WORK, MOVE];
        spawner.spawnCreep(body, newName, {
            memory: {
                role: 'harvester',
                spawnTime: body.length * 3
            }
        });
    } else if (!('Transporter' in creeps) || creeps["Transporter"].length < numberOfTransporters) {

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
