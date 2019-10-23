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
        if (spawn == null) {
            return;
        }
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
        let hostileCreep = 0;
        Object.values(Game.rooms).forEach((room) => {
            hostileCreep += room.find(FIND_HOSTILE_CREEPS);
        });

        //let groupedCreeps = groupBy(creeps, creep => creep.memory.role);

        const harvesters = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'harvester'));
        const builders = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'builder'));
        const upgraders = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'upgrader'));
        const attacker = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'attacker'));
        const claimer = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'claimer'));
        const transporter = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'transporter'));
        const miner = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'miner'));
        const upgraderHelper = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'upgraderHelper'));
        const builderHelper = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'builderHelper'));
        const defender = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'defender'));
        const mineralMiner = _.filter(creeps, (creep) => (_.has(creep.memory, 'role') && creep.memory.role === 'mineralMiner'));

        let extractors = room.find(FIND_STRUCTURES, {
            filter: (i) => {
                return (i.structureType === STRUCTURE_EXTRACTOR)
            }
        });
        const extractorExists = extractors.length > 0;
        const constructionSites = room.find(FIND_CONSTRUCTION_SITES);
        let minerals = room.find(FIND_MINERALS, {
            filter: (mineral) => {
                return mineral.mineralAmount > 0
            }
        });
        const totalEnergy = room.energyCapacityAvailable;
        const energyAvailable = room.energyAvailable;
        let creepArray = [];
        let creepNumbers = {
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
                'number': 2
            }, 'defender': {
                'body': [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                'number': 0
            }
        };

        if (totalEnergy >= 3000) {
            creepArray = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            creepNumbers = {
                'harvester': {
                    'body': creepArray,
                    'number': 0
                },
                'upgraders': {
                    'body': [WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, WORK,
                        CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                    'number': 1
                }, 'upgraderHelper': {
                    'body': [WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, WORK,
                        CARRY, CARRY, CARRY, CARRY, CARRY,
                        MOVE, MOVE, MOVE, MOVE, MOVE,
                        MOVE, MOVE, MOVE, MOVE, MOVE,
                        MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 1
                },
                'transporter': {
                    'body': [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 1
                },
                'miner': {
                    'body': [WORK, WORK, WORK, WORK, WORK, MOVE],
                    'number': 2
                }, 'mineralMiner': {
                    'body': [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 1
                },
                'claimer': {
                    'body': [CLAIM, MOVE],
                    'number': 0
                },
                'builders': {
                    'body': creepArray,
                    'number': 2
                },
                'defender': {
                    'body': [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 1
                }
            };
        } else if (totalEnergy >= 1800) {
            creepArray = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            creepNumbers = {
                'harvester': {
                    'body': creepArray,
                    'number': 0
                },
                'upgraders': {
                    'body': [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 1
                }, 'upgraderHelper': {
                    'body': [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 5
                },
                'transporter': {
                    'body': [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 2
                },
                'miner': {
                    'body': [WORK, WORK, WORK, WORK, WORK, MOVE],
                    'number': 2
                }, 'mineralMiner': {
                    'body': [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 1
                },
                'builders': {
                    'body': creepArray,
                    'number': 2
                },
                'defender': {
                    'body': [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 0
                }
            };
        } else if (totalEnergy >= 1300) {
            creepArray = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            creepNumbers = {
                'harvester': {
                    'body': creepArray,
                    'number': 0
                },
                'upgraders': {
                    'body': creepArray,
                    'number': 9
                }, 'upgraderHelper': {
                    'body': creepArray,
                    'number': 5
                },
                'transporter': {
                    'body': [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 2
                },
                'miner': {
                    'body': [WORK, WORK, WORK, WORK, WORK, MOVE],
                    'number': 2
                },
                'builders': {
                    'body': creepArray,
                    'number': 2
                },
                'defender': {
                    'body': [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 0
                }
            };
        } else if (totalEnergy >= 800) {
            creepArray = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE];
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
                        WORK, WORK, WORK, WORK, WORK,
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
                },
                'defender': {
                    'body': [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 0
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
                }, 'upgraderHelper': {
                    'body': [WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, WORK,
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
                },
                'defender': {
                    'body': [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
                    'number': 0
                }
            };
        }
        if (creeps.length < 2 && totalEnergy < 3000) {
            creepArray = [WORK, CARRY, MOVE, MOVE];
            creepNumbers = {
                'harvester': {
                    'body': creepArray,
                    'number': 2
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
        } else if (constructionSites.length > 0 && builders.length < creepNumbers.builders.number) {
            newName = 'Builder' + Game.time;

            spawn.spawnCreep(creepNumbers.builders.body, newName,
              {memory: {role: 'builder'}});
        } else if (extractorExists && creepNumbers.mineralMiner && minerals.length > 0  && mineralMiner.length < creepNumbers.mineralMiner.number) {
            newName = 'MineralMiner' + Game.time;
            spawn.spawnCreep(creepNumbers.mineralMiner.body, newName,
              {memory: {role: 'mineralMiner'}});
        } else if (upgraders.length < creepNumbers.upgraders.number) {
            newName = 'Upgrader' + Game.time;

            spawn.spawnCreep(creepNumbers.upgraders.body, newName,
              {memory: {role: 'upgrader'}});
        } else if (attacker.length < 0 && room.name === "W39N33") {
            newName = 'Attacker' + Game.time;
            creepArray = [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            spawn.spawnCreep(creepArray, newName,
              {memory: {role: 'attacker'}});
        } else if (claimer.length < 0) {
            newName = 'Claimer' + Game.time;
            creepArray = creepNumbers.claimer.body;
            spawn.spawnCreep(creepArray, newName,
              {memory: {role: 'claimer'}});
        } else if (builderHelper.length < 0) {
            newName = 'BuilderHelper' + Game.time;
            spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK,
                  WORK, WORK, WORK, WORK, WORK,
                  WORK, WORK, WORK, WORK, WORK,
                  CARRY, CARRY, CARRY, CARRY, CARRY,
                  MOVE, MOVE, MOVE, MOVE, MOVE,
                  MOVE, MOVE, MOVE, MOVE, MOVE,
                  MOVE, MOVE, MOVE, MOVE, MOVE], newName,
              {memory: {role: 'BuilderHelper'}});
        } else if (upgraderHelper.length < 0 && room.name === "W38N35") {
            newName = 'upgraderHelper' + Game.time;
            spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK,
                  WORK, WORK, WORK, WORK, WORK,
                  WORK, WORK, WORK, WORK, WORK,
                  CARRY, CARRY, CARRY, CARRY, CARRY,
                  MOVE, MOVE, MOVE, MOVE, MOVE,
                  MOVE, MOVE, MOVE, MOVE, MOVE,
                  MOVE, MOVE, MOVE, MOVE, MOVE], newName,
              {memory: {role: 'upgraderHelper'}});
        }
        else if (defender.length < 0 && hostileCreep > 0) {
            newName = 'Defender' + Game.time;
            creepArray = [CLAIM, CLAIM, MOVE, MOVE];
            spawn.spawnCreep(creepArray, newName,
              {memory: {role: 'Defender'}});
        }
    }

};

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);

        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

module.exports = populate;
