 function findClosestHostile(creep) {
    const minerals = creep.room.find(FIND_MINERALS);
    if (minerals.length > 0) {
        const closestHostile  = minerals[0].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (minerals[0].pos.getRangeTo(closestHostile) < 8) {
            return closestHostile;
        }
    }
    return null;
}
 function calculateFleePath(creep, closestHostile, roomName) {
     return PathFinder.search(creep.pos, {pos: closestHostile.pos, range: 5}, {
         flee: true
     });
 }

 function calculatingSourceCost(creep) {
    console.log("Kommer jag hit!");
     const spawn = Game.rooms[creep.memory.room].find(FIND_MY_SPAWNS)[0]; // Assume there's at least one spawn in the room
     if (spawn) {
         // Calculate the path distance
         const {path, opts, cost, incomplete} = PathFinder.search(spawn.pos, { pos: creep.pos, range: 1 });
         if (!incomplete) {
             console.log('Path found: ' + JSON.stringify(path), ' Options: ' + JSON.stringify(opts) + ' Cost: ' + cost + ' for ' + creep.name + ' ' + incomplete);
             return cost; // Store the cost of the path
         }
     }
 }

 function checkIfReady(creep, room) {
    if (creep.memory.ready === undefined) {
        creep.memory.ready = false;
    }
    if (!creep.memory.ready) {
        const defendFlags = room.find(FIND_FLAGS,{
            filter: flag => {
                return flag.name === "defend";
            }
        })
        if (defendFlags.length > 0) {
            const defendFlag = defendFlags[0];
            creep.moveTo(defendFlag, {visualizePathStyle: {stroke: '#ff0000'}});
        }
        const healer = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (creep) => creep.memory.role === 'remoteHealer'
        });
        console.log("Healer: " + JSON.stringify(healer));
        if (healer && creep.pos.getRangeTo(healer) <= 1) {
            creep.memory.ready = true;
            creep.say('Ready to attack!');
        }
    }
 }

 module.exports = {
     findClosestHostile,
     calculateFleePath,
     checkIfReady,
     calculatingSourceCost
 };
