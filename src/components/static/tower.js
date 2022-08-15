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
            }
            hostiles.sort((enemy1, enemy2) => {
                let healingPars1 = enemy1.body.filter((part) => {
                    return part.type === HEAL
                });
                let healingPars2 = enemy2.body.filter((part) => {
                    return part.type === HEAL
                });
                let attackPart1 = enemy1.body.filter((part) => {
                    return part.type === ATTACK
                });
                let attackPart2 = enemy2.body.filter((part) => {
                    return part.type === ATTACK
                });
                return (healingPars2.length - healingPars1.length) || (attackPart2.length - attackPart1.length);
            });
            towers.forEach(tower => tower.attack(hostiles[0]));
        } else {
            const targets = getRepairObjects(towers[0]);

            towers.forEach((tower, i) => {
                if (tower.energy >= tower.energyCapacity * 0.5) {
                    if (targets.length > 0) {
                        if (i < targets.length) {
                            tower.repair(targets[i])
                        }
                    } else if (tower.energy > tower.energyCapacity * 0.1) {
                        if (Game.time % 5 === 0) {
                            let rampparts = getRamppart(towers[0]);
                            rampparts.sort((ramp1, ramp2) => (ramp1.hits > ramp2.hits) ? 1 : -1);
                            if (i < rampparts.length) {
                                tower.repair(rampparts[i]);
                            }
                        }
                    }
                }
            });
        }
    }
};


function getRamppart(tower) {
    return tower.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_RAMPART && structure.hits < structure.hitsMax * 0.01);
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

