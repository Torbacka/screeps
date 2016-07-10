/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tower');
 * mod.thing == 'a thing'; // true
 */

var tower = {
    
    guard: function(roomName){
        var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
        var towers = Game.rooms[roomName].find(
                FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        if(hostiles.length > 0) {
            var username = hostiles[0].owner.username;
            Game.notify(`User ${username} spotted in room ${roomName}`);
            
            towers.forEach(tower => tower.attack(hostiles[0]));
        } else {
            var targets = getRepairObjects(towers[0]);
            if(targets.length > 0) {
                towers.forEach(tower => tower.repair(targets[0]));
            } else if( engery > energyCapacity*0.8) {
                var walls = getWalls(tower[0]);
                if(tower.memory.wallToRepair &&  (tower.memory.wallToRepair < walls.length)) {
                    tower.memory.wallToRepair = 0;
                }
                var walls = getWalls(tower[0]);
                towers.forEach(tower => tower.repair(walls[0]));
                tower.memory.wallToRepair++;
            }

        }
    }

};
function getWalls(tower) {
    return tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_WALL && structure.hits < structure.hitsMax*0.001);
            }
    });
}
function getRepairObjects(tower) {
    return tower.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_ROAD && structure.hits < structure.hitsMax*0.9) ||
                        (structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax)||
                        (structure.structureType == STRUCTURE_RAMP && structure.hits < structure.hitsMax*0.1);;
                    }
    });

}

module.exports = tower;