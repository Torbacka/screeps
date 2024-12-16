module.exports = function () {
    if (Game.spawns['home'].spawning) {
        const spawningCreep = Game.creeps[Game.spawns['home'].spawning.name];
        Game.spawns['home'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['home'].pos.x + 1,
            Game.spawns['home'].pos.y,
            {align: 'left', opacity: 0.8});
    }
}