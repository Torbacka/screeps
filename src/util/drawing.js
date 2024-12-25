module.exports = function (roomName) {
    const room = Game.rooms[roomName];
    if (!room)  return;

    if (room.spawning) {
        const spawningCreep = Game.creeps[room.spawning.name];
        room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            room.pos.x + 1,
            room.pos.y,
            {align: 'left', opacity: 0.8});
    }
}
