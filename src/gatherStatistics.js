module.exports = (room) => {
    if (Memory.statistics === undefined) {
        Memory.statistics = [];
    }
    /*var statString = "";
    var time = 0;
    Memory.statistics.forEach((stat) => {
        statString += "" + stat.progress + ";" + time + ";" + stat.timestamp +  "\n";
        time +=100;
    });
    console.log(statString);
    */

    if (Game.time % 100 === 0) {
        let statistics = {
            'progress': room.controller.progress,
            'progressTotal': room.controller.progressTotal,
            'timestamp': Date.now(),
            'roomName': room.name
        };
        Memory.statistics.push(statistics);
        console.log("Pushing stats");
    }
};