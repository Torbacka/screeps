 function findClosestHostile(creep) {
    const minerals = creep.room.find(FIND_MINERALS);
    if (minerals.length > 0) {
        return minerals[0].pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    }
    return creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
}
 function calculateFleePath(creep, closestHostile, roomName) {
     return PathFinder.search(creep.pos, {pos: closestHostile.pos, range: 3}, {
         flee: true,
         roomCallback: function (room) {
             if (room !== roomName) return;
             let costs = new PathFinder.CostMatrix;
             room.find(FIND_HOSTILE_CREEPS).forEach(function (creep) {
                 costs.set(creep.pos.x, creep.pos.y, 0xff);
             });
             return costs;
         }
     });
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
     checkIfReady
 };
