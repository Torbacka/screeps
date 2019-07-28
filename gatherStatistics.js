module.exports = () => {
    if (Memory.statistics === undefined) {
        Memory.statistics = [];
    }
    /*var statString = "";
    var time = 0;
    Memory.statistics.forEach((stat) => {
        statString += "" + stat.progress + ";" + time + "\n";
        time +=100;
    });
    console.log(statString);
    */

    if (Game.time % 100 === 0) {
        Object.values(Game.rooms).forEach((room) => {
            let statistics = {
                'progress': room.controller.progress,
                'progressTotal': room.controller.progressTotal,
                'timestamp': Date.now()
            };
            Memory.statistics.push(statistics);
            console.log("Pushing stats");
        });
    }
};