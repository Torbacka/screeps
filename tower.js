/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tower');
 * mod.thing == 'a thing'; // true
 */

const tower = {

    guard: function (roomName) {
        const hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
        const towers = Game.rooms[roomName].find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        if (towers.length === 0) {
            return;
        }
        if (hostiles.length > 0) {
            const username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${roomName}`);

            towers.forEach(tower => tower.attack(hostiles[0]));
        } else {
            const targets = getRepairObjects(towers[0]);

            if (targets.length > 0) {
                towers.forEach(tower => tower.repair(targets[0]));
            } else if (towers[0].energy > (towers[0].energyCapacity * 0.7)) {
                /*var walls = getWalls(towers[0]);

                if(Game.spawns['Spawn1'].memory.wallToRepair &&  (Game.spawns['Spawn1'].memory.wallToRepair > walls.length)) {
                    console.log( (Game.spawns['Spawn1'].memory.wallToRepair > walls.length));
                   Game.spawns['Spawn1'].memory.wallToRepair = 0;
                }
                var walls = getWalls(towers[0]);
                towers.forEach(tower => tower.repair(walls[0]));
                Game.spawns['Spawn1'].memory.wallToRepair += 1;*/
            }

        }
    }

};

function getWalls(tower) {
    return tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_WALL && structure.hits < structure.hitsMax*0.001);
            }
    });
}
function getRepairObjects(tower) {
    return tower.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_ROAD && structure.hits < structure.hitsMax*0.9) ||
                        (structure.structureType === STRUCTURE_CONTAINER && structure.hits < structure.hitsMax)||
                        (structure.structureType === STRUCTURE_RAMPART && structure.hits < structure.hitsMax*0.1);
                    }
    });

}

module.exports = tower;