/** @param {Creep} creep @param {Room} room **/
export function moveToRoom(creep, room, callback) {
    let exitDir = creep.room.findExitTo(room);
    let exit = creep.pos.findClosestByPath(exitDir);
    if (exit != null) {
        creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffaa00' } });
    } else {
        callback(creep);
    }
}