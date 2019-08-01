/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('populate');
 * mod.thing == 'a thing'; // true
 */

const populate = {
    run: function (room) {
        console.log("kommer jag hit 234151");
        //let spawn = Game.spawns['Spawn1'];
        let spawn = Object.values(Game.spawns).filter((spawn) => {
            return spawn.room.name === room.name
        })[0];
        console.log(JSON.stringify(spawn.name));

        if (spawn.spawning) {
            let spawningCreep = Game.creeps[spawn.spawning.name];
            spawn.room.visual.text(
              '🛠️' + spawningCreep.memory.role,
              spawn.pos.x + 1,
              spawn.pos.y,
              {align: 'left', opacity: 0.8});
        }
        let newName;
        let creeps = room.find(FIND_CREEPS);
        const harvesters = _.filter(creeps, (creep) => creep.memory.role === 'harvester');
        const builders = _.filter(creeps, (creep) => creep.memory.role === 'builder');
        const upgraders = _.filter(creeps, (creep) => creep.memory.role === 'upgrader');
        const attacker = _.filter(creeps, (creep) => creep.memory.role === 'attacker');
        const claimer = _.filter(creeps, (creep) => creep.memory.role === 'claimer');

        const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        const totalEnergy = room.energyCapacityAvailable;
        const energyAvailable = room.energyAvailable;

        let creepArray = [];
        let creepNumbers = {
            'harvester': 3,
            'upgraders': 3,
            'builders': 0
        };
        console.log("totalEngery: " + totalEnergy + "  fff " + (totalEnergy >= 1300));

        if (totalEnergy >= 1300) {
            console.log("kommer jag hit!");
            creepArray = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            creepNumbers = {
                'harvester': 3,
                'upgraders': 3,
                'builders': 0
            };
        } else if (totalEnergy >= 550) {
            console.log("kommer jag hit!");
            creepArray = [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE];
            creepNumbers = {
                'harvester': 7,
                'upgraders': 4,
                'builders': 3
            };
        } else if (totalEnergy >= 400) {
            console.log("kommer jag hit!");
            creepArray = [WORK, WORK, CARRY, MOVE, MOVE, MOVE];
            creepNumbers = {
                'harvester': 5,
                'upgraders': 5,
                'builders': 3
            };
        } else {
            creepArray = [WORK, CARRY, MOVE, MOVE];
            creepNumbers = {
                'harvester': 7,
                'upgraders': 3,
                'builders': 4
            };
        }
        if (creeps.length === 0) {
            creepArray = [WORK, CARRY, MOVE, MOVE];
            creepNumbers = {
                'harvester': 7,
                'upgraders': 3,
                'builders': 4
            };
        }
        console.log(JSON.stringify(creepNumbers));
        //1800

        if (harvesters.length < creepNumbers.harvester) {
            newName = 'Harvester' + Game.time;
            console.log('Spawning new harvester: ' + newName);
            spawn.spawnCreep(creepArray, newName,
              {memory: {role: 'harvester'}});
        } else if ((constructionSites.length === 0 && upgraders.length < 3) || upgraders.length < creepNumbers.upgraders) {
            newName = 'Upgrader' + Game.time;
            console.log('Spawning new upgrader: ' + newName);
            spawn.spawnCreep(creepArray, newName,
              {memory: {role: 'upgrader'}});
        } else if (builders.length < creepNumbers.builders) {
            newName = 'Builder' + Game.time;
            console.log('Spawning new Builder: ' + newName);
            if (totalEnergy > 1800) {
                creepArray = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            }
            spawn.spawnCreep(creepArray, newName,
              {memory: {role: 'builder'}});
        } else if (attacker.length < 0) {
            newName = 'Attacker' + Game.time;
            creepArray = [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            spawn.spawnCreep(creepArray, newName,
              {memory: {role: 'attacker'}});
        } else if (claimer.length < 0) {
            newName = 'Claimer' + Game.time;
            creepArray = [CLAIM, CLAIM, MOVE, MOVE];
            spawn.spawnCreep(creepArray, newName,
              {memory: {role: 'claimer'}});
        }

    }

};

module.exports = populate;

