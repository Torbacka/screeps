var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var rolePopulate = require('role.populate');
var roleDefender = require('role.defender');
var roleTransporter = require('role.transporter');
var garbagecollector = require('garbagecollector');
var tower = require('tower');
module.exports.loop = function () {
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if(creep.memory.role == 'harvester') {
            creep.memory.sourceNr = 0;
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'builder') { 
            creep.memory.sourceNr = 1;
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            creep.memory.sourceNr = 0;
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }
        if(creep.memory.role == 'transporter') {
            roleTransporter.run(creep);
        }
    }
    
    rolePopulate.run(Game.spawns.ComandCenter);
    garbagecollector();
    tower.guard("E11S48");
}
