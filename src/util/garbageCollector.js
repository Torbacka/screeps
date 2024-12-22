module.exports = function () {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            delete Memory.data.remoteHarvester["E58S34"][creep.name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
};
