/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tower');
 * mod.thing == 'a thing'; // true
 */

const tower = {

    guard: function (room) {
        const hostiles = room.find(FIND_HOSTILE_CREEPS);
        const towers = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});

        if (towers.length === 0) {
            return;
        }

        if (hostiles.length > 0) {
            const username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${room.name}`);
            if (room.controller.safeMode === undefined) {
                room.controller.activateSafeMode();
            }
            towers.forEach(tower => tower.attack(hostiles[0]));
        } else {
            const targets = getRepairObjects(towers[0]);

            towers.forEach(tower => {
                if (targets.length > 0) {
                    tower.repair(targets[0])
                } else if (tower.energy > tower.energyCapacity * 0.1) {
                    let walls = getWalls(towers[0]);
                    walls.sort((wall1, wall2) => (wall1.hits > wall2.hits) ? 1 : -1);
                    towers.forEach(tower => tower.repair(walls[0]));
                }
            });
        }
    }
};


function getWalls(tower) {
    return tower.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_WALL && structure.hits < structure.hitsMax * 0.001)
              || (structure.structureType === STRUCTURE_RAMPART && structure.hits < structure.hitsMax * 0.003);
        }
    });
}

function getRepairObjects(tower) {
    return tower.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_ROAD && structure.hits < structure.hitsMax * 0.75) ||
              (structure.structureType === STRUCTURE_CONTAINER && structure.hits < structure.hitsMax);
        }
    });

}

module.exports = tower;
