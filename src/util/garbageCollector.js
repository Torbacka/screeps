module.exports = function () {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.data.remoteHarvester["E58S34"][name];
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
};
