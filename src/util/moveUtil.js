/**
 * @param {Creep} creep
 * @param {String} room - The room to move to
 * @param {Function} callback
 * **/
export function moveToRoom(creep, room, callback) {
    let exitDir = creep.room.findExitTo(room);
    let exit = creep.pos.findClosestByRange(exitDir);
    if (exit != null) {
        creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffaa00'}}, {reusePath: 10});
    } else {
        callback(creep, room);
    }
}
