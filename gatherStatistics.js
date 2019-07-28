module.exports = () => {
    if (Memory.statistics === undefined) {
        Memory.statistics = [];
    }

    if (Game.time % 100 === 0) {
        Object.values(Game.rooms).forEach((room) => {
            let statistics = {
                'progress': room.controller.progress,
                'progressTotal': room.controller.progressTotal
            };
            Memory.statistics.push(statistics);
            console.log("Pushing stats");
        });
    }
};