module.exports = (room) => {
    if (Game.time % 10 === 0) {
        if (Memory.statistics === undefined) {
            Memory.statistics = {};
            Memory.statistics[room.name] = {};
        } else if (Memory.statistics[room.name] === undefined) {
            Memory.statistics[room.name] = {};
        }
        let roomStat = Memory.statistics[room.name];
        if (roomStat.controller === undefined) {
            roomStat.controller =  {};
        }
        roomStat.controller.progress = room.controller.progress.valueOf();
    }
};