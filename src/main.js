let roleHarvester = require('role/harvester');
let roleUpgrader = require('role/upgrader');
let roleBuilder = require('role/builder');
let garbagecollector = require('garbagecollector');
let populate = require('populate');
let tower = require('tower');
let gatherStatistics = require('gatherStatistics');
module.exports.loop = function () {
    let name;
    console.log("Start!");
    for(name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    populate.run();

    if(Game.spawns['Spawn1'].spawning) {
        let spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }

    for(name in Game.creeps) {
        const creep = Game.creeps[name];
        if(creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
         if(creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
    }
    tower.guard("W38N35");
    garbagecollector();
    gatherStatistics();
};