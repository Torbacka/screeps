var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var rolePopulate = require('role.populate');
var roleDefender = require('role.defender');
var roleTransporter = require('role.transporter');
var garbagecollector = require('garbagecollector');
var tower = require('tower');
var container = require ('container');
module.exports.loop = function () {
    var i = 0;
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if(creep.memory.role == 'harvester') {
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
        i++;
    }
    
    rolePopulate.run(Game.spawns.ComandCenter);
    garbagecollector();
    tower.guard("E11S48");
    var containers = Game.rooms["E11S48"].find(
                FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});
    //containers.forEach(container => console.log(container.structureType));
    //console.log("\n\n")
    container.fill(containers[0]);
   container.fill(containers[1]);
}
