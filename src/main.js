var roleHarvester = require('./components/roles/harvester.js');
var roleUpgrader = require('./components/roles/upgrader.js');
var roleBuilder = require('./components/roles/builder.js');
var roleClaim = require('./components/roles/claimCreep.js');
var roleRemoteBuilder = require('./components/roles/remote/remoteBuilder.js');
var roleRemoteDefender = require('./components/roles/remote/remoteDefender.js');
var roleRemoteHarvester = require('./components/roles/remote/remoteHarvester.js');
let garbagecollector = require('lib/garbagecollector.js');
let gatherStatistics = require('lib/gatherStatistics.js');
let tower = require('./components/static/tower.js');
const roleRemoteTransporter = require('./components/roles/remote/remoteTransporter.js');

module.exports.loop = function () {
    Object.values(Game.rooms).forEach((room) => {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var harvesters2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester2');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var claimCreep = _.filter(Game.creeps, (creep) => creep.memory.role == 'claim');
        var remoteHarvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteHarvester');
        var remoteDefender = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteDefender');
        var remoteTransporter = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteTransporter');
        var remoteBuilder = _.filter(Game.creeps, (creep) => creep.memory.role == 'remoteBuilder');
        let spawn = Object.values(Game.spawns).filter((spawn) => {
            return spawn.room.name === room.name
        })[0];
        if (spawn) {
            if (harvesters.length == -1) {
                var newName = 'Harvester' + Game.time;
                console.log('Spawning new harvester: ' + newName);
                spawn.spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
                    {memory: {role: 'harvester'}});
            }
            else if(harvesters.length < 2) {
                var newName = 'Harvester' + Game.time;
                console.log('Spawning new harvester: ' + newName);
                spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'harvester'}});
            } else if(harvesters2.length < 1) {
                var newName = 'Harvester2' + Game.time;
                console.log('Spawning new harvester2: ' + newName);
                spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'harvester2'}});
            } else if (upgraders.length < 2) {
                var newName = 'Upgrader' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'upgrader'}});
            } else if (remoteDefender.length < 0) {
                var newName = 'RemoteDefender' + Game.time;
                console.log('Spawning new RemoteDefender: ' + newName);
                spawn.spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,ATTACK,MOVE], newName, 
                    {memory: {role: 'remoteDefender'}});
            } else if (remoteBuilder.length < 1) {
                var newName = 'RemoteBuilder' + Game.time;
                console.log('Spawning new RemoteBuilder: ' + newName);
                spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'remoteBuilder'}});
            } else if (remoteHarvester.length < 2) {
                var newName = 'remoteHarvester' + Game.time;
                console.log('Spawning new remoteHarvester: ' + newName);
                spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'remoteHarvester'}});
            } else if (remoteTransporter.length < 2) {
                var newName = 'remoteTransporter' + Game.time;
                var bodyArray = [];
                for (let i = 0; i< room.energyCapacityAvailable; i=i+150) {
                    bodyArray = bodyArray.concat([CARRY,CARRY,MOVE]);
                }
                console.log('Spawning new remoteTransporter2: ' + newName + "   " + JSON.stringify(bodyArray));
                spawn.spawnCreep(bodyArray, newName, 
                    {memory: {role: 'remoteTransporter', collect: true}});
            } else if (claimCreep.length < 1) {
                var newName = 'Claim' + Game.time;
                console.log('Spawning new claim creep: ' + newName);
                spawn.spawnCreep([CLAIM,CLAIM,MOVE], newName, 
                    {memory: {role: 'claim'}});
            }/*else if (builders.length < 0) {
                var newName = 'Builder' + Game.time;
                console.log('Spawning new builder: ' + newName);
                spawn.spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'builder'}});
            }*/
            
            if(spawn.spawning) { 
                var spawningCreep = Game.creeps[spawn.spawning.name];
                room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    spawn.pos.x + 1, 
                    spawn.pos.y, 
                    {align: 'left', opacity: 0.8});
            }
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
            if(creep.memory.role == 'remoteBuilder') {
                roleRemoteBuilder.run(creep, "W58S59");
            }
            if(creep.memory.role == 'remoteDefender') {
                roleRemoteDefender.run(creep, "W58S59");
            }
            if(creep.memory.role == 'remoteHarvester') {
                roleRemoteHarvester.run(creep, "W58S59");
            }
            if(creep.memory.role === 'harvester2') {
                roleRemoteHarvester.run(creep);
            }
            if(creep.memory.role === 'remoteTransporter') {
                roleRemoteTransporter.run(creep, "W59S59", "W58S59");
            }
            if(creep.memory.role === 'claim') {
                roleClaim.run(creep, "W58S59");
            }
        }
        gatherStatistics(room);
        garbagecollector();
        tower.guard(room);
    });
}
