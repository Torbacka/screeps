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
        const harvesters = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'harvester'));
        const builders = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'builder'));
        const upgraders = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'upgrader'));
        const attacker = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'attacker'));
        const claimer = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'claimer'));
        const transporter = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'transporter'));
        const miner = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'miner'));
        const upgraderHelper = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'upgraderHelper'));

        const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        const totalEnergy = room.energyCapacityAvailable;
        const energyAvailable = room.energyAvailable;

        let creepArray = [];
        let creepNumbers  = {
            'harvester': {
                'body': creepArray,
                'number': 7
            },
            'upgraders': {
                'body': creepArray,
                'number': 3
            },
            'transporter': {
                'body': creepArray,
                'number': 0
            },
            'miner': {
                'body': creepArray,
                'number': 0
            },
            'builders': {
                'body': creepArray,
                'number': 3
            }
        };

        if (totalEnergy >= 1800) {
            creepArray = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            creepNumbers = {
                'harvester': {
                    'body': creepArray,
                    'number': 0
                },
                'upgraders': {
                    'body': [WORK, WORK, WORK, WORK, WORK,
                             WORK, WORK, WORK, WORK, WORK,
                             WORK, WORK, WORK, WORK,  WORK,
                             WORK, WORK, WORK, WORK,  WORK,
                             WORK, WORK, WORK, WORK,  WORK,
                             CARRY, CARRY, CARRY, CARRY, CARRY,MOVE, MOVE, MOVE, MOVE],
                    'number': 1
                }, 'upgraderHelper': {
                    'body': [WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK,  WORK,
                        CARRY, CARRY, CARRY, CARRY, CARRY,
                        MOVE, MOVE, MOVE, MOVE, MOVE,
                        MOVE, MOVE, MOVE, MOVE, MOVE,
                        MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 1
                },
                'transporter': {
                    'body': [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,CARRY, CARRY, CARRY, CARRY,
                        MOVE, MOVE, MOVE, MOVE, MOVE,MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 2
                },
                'miner': {
                    'body': [WORK, WORK, WORK,WORK,WORK, MOVE],
                    'number': 2
                },
                'builders': {
                    'body': creepArray,
                    'number': 2
                }
            };
        }  else if (totalEnergy>= 1300) {
            creepArray = [WORK, WORK, WORK, WORK, WORK, WORK,CARRY,CARRY, CARRY,
                MOVE, MOVE, MOVE,  MOVE, MOVE, MOVE,MOVE, MOVE, MOVE];
            creepNumbers = {
                'harvester': {
                    'body': creepArray,
                    'number': 5
                },
                'upgraders': {
                    'body': creepArray,
                    'number': 5
                },'upgraderHelper': {
                    'body': [WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK,  WORK,
                        CARRY, CARRY, CARRY, CARRY, CARRY,
                        MOVE, MOVE, MOVE, MOVE, MOVE,
                        MOVE, MOVE, MOVE, MOVE, MOVE,
                        MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 0
                },
                'transporter': {
                    'body': creepArray,
                    'number': 0
                },
                'miner': {
                    'body': creepArray,
                    'number': 0
                },
                'builders': {
                    'body': creepArray,
                    'number': 3
                }
            };
        } else if (totalEnergy>= 800) {
            creepArray = [WORK, WORK, WORK,CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
            creepNumbers = {
                'harvester': {
                    'body': creepArray,
                    'number': 7
                },
                'upgraders': {
                    'body': creepArray,
                    'number': 7
                },
                'upgraderHelper': {
                    'body': [WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK,  WORK,
                        CARRY, CARRY, CARRY, CARRY, CARRY,
                        MOVE, MOVE, MOVE, MOVE, MOVE,
                        MOVE, MOVE, MOVE, MOVE, MOVE,
                        MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 0
                },
                'transporter': {
                    'body': creepArray,
                    'number': 0
                },
                'miner': {
                    'body': creepArray,
                    'number': 0
                },
                'builders': {
                    'body': creepArray,
                    'number': 3
                }
            };
        } else {
            creepArray = [WORK, CARRY, MOVE, MOVE];
            creepNumbers = {
                'harvester': {
                    'body': creepArray,
                    'number': 7
                },
                'upgraders': {
                    'body': creepArray,
                    'number': 3
                },
                'transporter': {
                    'body': creepArray,
                    'number': 0
                },'upgraderHelper': {
                    'body': [WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK,  WORK,
                        CARRY, CARRY, CARRY, CARRY, CARRY,
                        MOVE, MOVE, MOVE, MOVE, MOVE,
                        MOVE, MOVE, MOVE, MOVE, MOVE,
                        MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 0
                },
                'miner': {
                    'body': creepArray,
                    'number': 0
                },
                'builders': {
                    'body': creepArray,
                    'number': 3
                }
            };
        }
        if (creeps.length < 2) {
            creepArray = [WORK, CARRY, MOVE, MOVE];
            creepNumbers = {
                'harvester': {
                    'body': creepArray,
                    'number': 1
                },
                'upgraders': {
                    'body': creepArray,
                    'number': 0
                },
                'transporter': {
                    'body': creepArray,
                    'number': 0
                },
                'miner': {
                    'body': creepArray,
                    'number': 0
                },
                'builders': {
                    'body': creepArray,
                    'number': 0
                }
            };
        }
        //1800

        if (harvesters.length < creepNumbers.harvester.number) {
            newName = 'Harvester' + Game.time;

            spawn.spawnCreep(creepNumbers.harvester.body, newName,
              {memory: {role: 'harvester'}});
        } else if (miner.length < creepNumbers.miner.number) {
            newName = 'Miner' + Game.time;
            spawn.spawnCreep(creepNumbers.miner.body, newName,
              {memory: {role: 'miner'}});
        } else if (transporter.length < creepNumbers.transporter.number) {
            newName = 'Transporter' + Game.time;
            spawn.spawnCreep(creepNumbers.transporter.body, newName,
              {memory: {role: 'transporter'}});
        }  else if (constructionSites.length > 0 && builders.length < creepNumbers.builders.number) {
            newName = 'Builder' + Game.time;

            spawn.spawnCreep(creepNumbers.builders.body, newName,
              {memory: {role: 'builder'}});
        }else if ( upgraders.length < creepNumbers.upgraders.number) {
            newName = 'Upgrader' + Game.time;

            spawn.spawnCreep(creepNumbers.upgraders.body, newName,
              {memory: {role: 'upgrader'}});
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
