/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('populate');
 * mod.thing == 'a thing'; // true
 */

var populate = {
    run: function() {
        let newName;
        const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        const builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        const room = Game.rooms['W38N35'];


        const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        const totalEnergy = room.energyCapacityAvailable;
        const energyAvailable = room.energyAvailable;
        let creepArray = [WORK, WORK,CARRY,MOVE, MOVE, MOVE];
        switch(totalEnergy) {
            case 650:
            default:
                creepArray =[WORK, WORK,WORK, WORK, WORK,CARRY, CARRY, WORK,MOVE, MOVE, MOVE, MOVE];
                break;    
        }
        
        if (energyAvailable >= 650) {
            if(harvesters.length < 7) {
                newName = 'Harvester' + Game.time;
                console.log('Spawning new harvester: ' + newName);
                Game.spawns['Spawn1'].spawnCreep(creepArray, newName, 
                    {memory: {role: 'harvester'}});
            } else if((constructionSites.length === 0 && upgraders.length < 6) || upgraders.length < 5) {
                newName = 'Upgrader' + Game.time;
                console.log('Spawning new upgrader: ' + newName);
                Game.spawns['Spawn1'].spawnCreep(creepArray, newName, 
                    {memory: {role: 'upgrader'}});
            } else if(constructionSites.length > 0 && builders.length < 1) {
                newName = 'Builder' + Game.time;
                console.log('Spawning new Builder: ' + newName);
                Game.spawns['Spawn1'].spawnCreep(creepArray, newName, 
                    {memory: {role: 'builder'}});
            }
        }
    }
    
};

module.exports = populate;