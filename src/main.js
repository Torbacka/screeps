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
let roomUtil = require('./util/roomUtil.js');
const roleRemoteTransporter = require('./components/roles/remote/remoteTransporter.js');

module.exports.loop = function () {
    Object.values(Game.rooms).forEach((room) => {
        var hostiles = 0;
        if (room.name === 'W58S59') {
            hostiles = room.find(FIND_HOSTILE_CREEPS).length;
        }
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
        console.log("Harvester2: " + harvesters2.length);
        if (spawn) {
            if (harvesters.length == -1) {
                var newName = 'Harvester' + Game.time;
                console.log('Spawning new harvester: ' + newName);
                spawn.spawnCreep([WORK,CARRY,MOVE,MOVE], newName, 
                    {memory: {role: 'harvester'}});
            }
            else if(harvesters.length < 3) {
                var newName = 'Harvester' + Game.time;
                console.log('Spawning new harvester: ' + newName);
                spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK, CARRY, CARRY, CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, MOVE, MOVE, MOVE], newName, 
                    {memory: {role: 'harvester'}});
            } else if(harvesters2.length < 2) {
                var newName = 'Harvester2' + Game.time;
                console.log('Spawning new harvester2: ' + newName);
                spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'harvester2'}});
            } else if (upgraders.length < 1) {
                var newName = 'Upgrader' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'upgrader'}});
            } else if (remoteDefender.length < 1 && hostiles > 0) {
                var newName = 'RemoteDefender' + Game.time;
                console.log('Spawning new RemoteDefender: ' + newName);
                spawn.spawnCreep([TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,ATTACK,MOVE], newName, 
                    {memory: {role: 'remoteDefender'}});
            } else if (remoteBuilder.length < 2) {
                const roomsAviable = roomUtil.filterRooms(["W58S59", "W58S58"], remoteBuilder);
                var newName = 'RemoteBuilder' + Game.time;
                spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'remoteBuilder', room: roomsAviable[0]}});
            } else if (remoteHarvester.length < 4) {
                const roomsAviable = roomUtil.filterRooms(["W58S59", "W58S59", "W58S58", "W58S58"], remoteHarvester);
                var newName = 'remoteHarvester' + Game.time;
                console.log('Spawning new remoteHarvester: ' + newName);
                spawn.spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE], newName, 
                    {memory: {role: 'remoteHarvester', room: roomsAviable[0]}});
            } else if (remoteTransporter.length < 4) {
                const roomsAviable = roomUtil.filterRooms(["W58S59", "W58S59", "W58S58", "W58S58"], remoteTransporter);
                var newName = 'remoteTransporter' + Game.time;
                var bodyArray = [];
                for (let i = 0; i< Math.floor(room.energyCapacityAvailable/150); i++) {
                    bodyArray = bodyArray.concat([CARRY,CARRY,MOVE]);
                }
                console.log('Spawning new remoteTransporter2: ' + newName + "   " + JSON.stringify(bodyArray));
                spawn.spawnCreep(bodyArray, newName, 
                    {memory: {role: 'remoteTransporter', collect: true, room: roomsAviable[0]}});
            } else if (claimCreep.length < 2) {
                const roomsAviable = roomUtil.filterRooms(["W58S59", "W58S58"], claimCreep);
                var newName = 'Claim' + Game.time;
                console.log('Spawning new claim creep: ' + newName);
                spawn.spawnCreep([CLAIM,CLAIM,MOVE], newName, 
                    {memory: {role: 'claim', room: roomsAviable[0]}});
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
                roleRemoteBuilder.run(creep);
            }
            if(creep.memory.role == 'remoteDefender') {
                roleRemoteDefender.run(creep, "W58S59");
            }
            if(creep.memory.role == 'remoteHarvester') {
                roleRemoteHarvester.run(creep);
            }
            if(creep.memory.role === 'harvester2') {
                roleRemoteHarvester.run(creep);
            }
            if(creep.memory.role === 'remoteTransporter') {
                roleRemoteTransporter.run(creep, "W59S59");
            }
            if(creep.memory.role === 'claim') {
                roleClaim.run(creep);
            }
        }
        gatherStatistics(room);
        garbagecollector();
        tower.guard(room);
    });
}
