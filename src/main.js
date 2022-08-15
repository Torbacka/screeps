<<<<<<< HEAD
let roleHarvester = require('role_harvester');
let roleUpgrader = require('role_upgrader');
let roleBuilder = require('role_builder');
let roleAttacker = require('role_attacker');
let roleClaimer = require('role_claim');
let roleTransporter = require('role_transporter');
let roleMiner = require('role_miner');
let roleMineralMiner = require('role_mineralMiner');
let roleUpgraderHelper = require('role_upgraderHelper');
let roleBuilderHelper = require('role_builderHelper');
let roleDefender = require('role_defender');
let garbagecollector = require('garbagecollector');
let populate = require('populate');
let market = require('market');
let tower = require('tower');
let factory = require('factory');
let resourceManager = require('role_resourceManager');
let gatherStatistics = require('gatherStatistics');
const profiler = require('screeps-profiler');
require('constants');

profiler.enable();
module.exports.loop = function () {
    profiler.wrap(function () {
        Object.values(Game.rooms).forEach((room) => {
            room.find(FIND_MY_CREEPS).forEach((creep) => {
                if (!_.has(creep.memory, 'role')) {
                    return;
                }
                if (creep.memory.role === HARVESTER) {
                    roleHarvester.run(creep);
                }
                if (creep.memory.role === UPGRADER) {
                    roleUpgrader.run(creep);
                }
                if (creep.memory.role === BUILDER) {
                    roleBuilder.run(creep, null, "W37N34");
                }
                if (creep.memory.role === ATTACKER) {
                    roleAttacker.run(creep, "W38N34");
                }
                if (creep.memory.role === CALIMER) {
                    roleClaimer.run(creep, "W38N34");
                }
                if (creep.memory.role === TRANSPORTER) {
                    roleTransporter.run(creep);
                }
                if (creep.memory.role === MINER) {
                    roleMiner.run(creep);
                }
                if (creep.memory.role === UPGRADER_HELPER) {
                    roleUpgraderHelper.run(creep, null, "W39N33");
                }
                if (creep.memory.role === DEFENDER) {
                    roleDefender.run(creep);
                }
                if (creep.memory.role === BUILDER_HELPER) {
                    roleBuilderHelper.run(creep, null, "W38N34");
                }if (creep.memory.role === 'mineralMiner') {
                    roleMineralMiner.run(creep);
                }
                resourceManager.run(creep);
            });
            tower.guard(room);
            factory.build(room);
            populate.run(room);
            market.trade(room);
            gatherStatistics(room);
            garbagecollector();


        });

    });
};
=======
var roleHarvester = require('components/roles/harvester.js');
var roleUpgrader = require('components/roles/upgrader.js');
var roleBuilder = require('components/roles/builder.js');
let garbagecollector = require('lib/garbagecollector.js');
let gatherStatistics = require('lib/gatherStatistics.js');

module.exports.loop = function () {
    
    Object.values(Game.rooms).forEach((room) => {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        console.log('Harvesters: ' + harvesters.length);
        let spawn = Object.values(Game.spawns).filter((spawn) => {
            return spawn.room.name === room.name
        })[0];
        if (harvesters.length == 0) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            spawn.spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
                {memory: {role: 'harvester'}});
        }
        else if(harvesters.length < 4) {
            var newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            spawn.spawnCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'harvester'}});
        } else if (upgraders.length < 4) {
            var newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            spawn.spawnCreep([WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE], newName, 
                {memory: {role: 'upgrader'}});
        } else if (builders.length < 0) {
            var newName = 'Builder' + Game.time;
            console.log('Spawning new builder: ' + newName);
            spawn.spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                {memory: {role: 'builder'}});
        }
        
        if(spawn.spawning) { 
            var spawningCreep = Game.creeps[spawn.spawning.name];
            room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1, 
                spawn.pos.y, 
                {align: 'left', opacity: 0.8});
        }
    
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if(creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if(creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }
             if(creep.memory.role == 'builder') {
                roleBuilder.run(creep);
            }
        }
        gatherStatistics(room);
        garbagecollector();
    });
}
>>>>>>> 579254a (First commit on version 2)
