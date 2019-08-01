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
        //let spawn = Game.spawns['Spawn1'];
        let spawn = Object.values(Game.spawns).filter((spawn) => {
            return spawn.room.name === room.name
        })[0];

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
        const transporter = _.filter(creeps, (creep) => creep.memory.role === 'transporter');
        const miner = _.filter(creeps, (creep) => creep.memory.role === 'miner');

        const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        const totalEnergy = room.energyCapacityAvailable;
        const energyAvailable = room.energyAvailable;

        let creepArray = [];
        let creepNumbers = {
            'harvester': 3,
            'upgraders': 3,
            'miner': 0,
            'builders': 0
        };

        if (totalEnergy >= 1300) {
            creepArray = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            creepNumbers = {
                'harvester': 3,
                'upgraders': 3,
                'transporter': 0,
                'miner': 0,
                'builders': 0
            };
        } else if (totalEnergy>= 800) {
            creepArray = [WORK, WORK, WORK,CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
            creepNumbers = {
                'harvester': 7,
                'upgraders': 4,
                'transporter': 0,
                'miner': 0,
                'builders': 3
            };
        } else if (totalEnergy >= 550) {
            creepArray = [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE];
            creepNumbers = {
                'harvester': 7,
                'upgraders': 4,
                'transporter': 0,
                'miner': 0,
                'builders': 3
            };
        } else if (totalEnergy >= 400) {
            creepArray = [WORK, WORK, CARRY, MOVE, MOVE, MOVE];
            creepNumbers = {
                'harvester': 5,
                'upgraders': 5,
                'transporter': 0,
                'miner': 0,
                'builders': 3
            };
        } else {
            creepArray = [WORK, CARRY, MOVE, MOVE];
            creepNumbers = {
                'harvester': 7,
                'upgraders': 3,
                'transporter': 0,
                'miner': 0,
                'builders': 4
            };
        }
        if (creeps.length === 0) {
            creepArray = [WORK, CARRY, MOVE, MOVE];
            creepNumbers = {
                'harvester': 7,
                'upgraders': 3,
                'transporter': 0,
                'miner': 0,
                'builders': 4
            };
        }
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
        } else if (transporter.length < creepNumbers.transporter) {
            newName = 'Transporter' + Game.time;
            creepArray = [CARRY, CARRY, CARRY, CARRY,CARRY, CARRY,
                          CARRY, CARRY, CARRY, CARRY,CARRY, CARRY,
                          CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                          CARRY, CARRY,MOVE, MOVE, MOVE, MOVE, MOVE,
                          MOVE, MOVE, MOVE, MOVE, MOVE];
            spawn.spawnCreep(creepArray, newName,
              {memory: {role: 'transporter'}});
        } else if (miner.length < creepNumbers.miner) {
            newName = 'Miner' + Game.time;
            creepArray = [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE];
            spawn.spawnCreep(creepArray, newName,
              {memory: {role: 'miner'}});
        }

    }

};

module.exports = populate;

