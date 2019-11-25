/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('populate');
 * mod.thing == 'a thing'; // true
 */
require('constants');

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
        let creeps = room.find(FIND_MY_CREEPS);
        let hostileCreep = 0;
        Object.values(Game.rooms).forEach((room) => {
            hostileCreep += room.find(FIND_HOSTILE_CREEPS);
        });
        let groupedCreepsAll;
        if (room.name === 'W38N35') {
            let allCreeps = Object.values(Game.creeps).filter(creep => {
                return creep.ticksToLive > 160;
            });
            groupedCreepsAll = groupBy(allCreeps, creep => creep.memory.role);
        }
        let hostalCreep_W38N34 = Game.rooms['W38N34'].find(FIND_HOSTILE_CREEPS);
        let groupedCreeps = groupBy(creeps, creep => creep.memory.role);
        ROLES.forEach(role => {
            if (!groupedCreeps.has(role)) {
                groupedCreeps.set(role, []);
            }
            if (groupedCreepsAll && !groupedCreepsAll.has(role)) {
                groupedCreepsAll.set(role, []);
            }
        });

        let extractors = room.find(FIND_STRUCTURES, {
            filter: (i) => {
                return (i.structureType === STRUCTURE_EXTRACTOR)
            }
        });
        let containers = room.find(FIND_STRUCTURES, {
            filter: (i) => {
                return (i.structureType === STRUCTURE_CONTAINER)
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
            creepArray = [WORK, WORK, WORK, WORK, WORK,WORK, WORK, WORK, WORK, WORK,WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY,CARRY, CARRY, CARRY,CARRY, CARRY, CARRY,CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE,MOVE, MOVE, MOVE, MOVE, MOVE,MOVE];
            creepNumbers = {
                'harvester': {
                    'body': creepArray,
                    'number': 2
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
                    'body': [CARRY, CARRY, CARRY, CARRY, CARRY,
                             CARRY, CARRY, CARRY, CARRY, CARRY,
                             CARRY, CARRY, CARRY, CARRY, CARRY,
                             CARRY, CARRY, CARRY, CARRY, CARRY,
                             CARRY, CARRY, CARRY, CARRY, CARRY,
                             CARRY, CARRY, CARRY, CARRY, CARRY,
                             CARRY, CARRY,
                             MOVE, MOVE, MOVE, MOVE, MOVE,
                             MOVE, MOVE, MOVE, MOVE, MOVE,
                             MOVE, MOVE, MOVE, MOVE, MOVE,
                             MOVE],
                    'number': 1
                },
                'miner': {
                    'body': [WORK, WORK, WORK, WORK, WORK, MOVE],
                    'number': 2
                }, 'mineralMiner': {
                    'body': [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                             WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                             WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                             MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
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
        } else if (totalEnergy >= 2300) {
            creepArray = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            creepNumbers = {
                'harvester': {
                    'body': creepArray,
                    'number': 0
                },
                'upgraders': {
                    'body': [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                        WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
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
        } else if (totalEnergy >= 1800) {
            creepArray = [WORK, WORK, WORK, WORK, WORK, WORK, WORK,CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            creepNumbers = {
                'harvester': {
                    'body': creepArray,
                    'number': 0
                },
                'upgraders': {
                    'body': [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY,
                        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
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
                    'number': 2
                },
                'upgraders': {
                    'body': creepArray,
                    'number': 2
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
            creepArray = [WORK, WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY,
                MOVE, MOVE, MOVE, MOVE];
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
                        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
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
        } else if (totalEnergy >= 550) {
            creepArray = [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE];
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
        if (creeps.length < 2 && energyAvailable <= 1000) {
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

        if ((containers.length === 0 || energyAvailable < 1500) && groupedCreeps.get(HARVESTER).length < creepNumbers.harvester.number) {
            newName = 'Harvester' + Game.time;

            spawn.spawnCreep(creepNumbers.harvester.body, newName,
              {memory: {role: HARVESTER}});
        } else if (containers.length > 0 && groupedCreeps.get(MINER).length < creepNumbers.miner.number) {
            newName = 'Miner' + Game.time;
            spawn.spawnCreep(creepNumbers.miner.body, newName,
              {memory: {role: MINER}});
        } else if (containers.length > 0 && groupedCreeps.get(TRANSPORTER).length < creepNumbers.transporter.number) {
            newName = 'Transporter' + Game.time;
            spawn.spawnCreep(creepNumbers.transporter.body, newName,
              {memory: {role: TRANSPORTER}});
        } else if (constructionSites.length > 0 && groupedCreeps.get(BUILDER).length < creepNumbers.builders.number) {
            newName = 'Builder' + Game.time;
            spawn.spawnCreep(creepNumbers.builders.body, newName,
              {memory: {role: BUILDER}});
        } else if (containers.length === 3 && extractorExists && creepNumbers.mineralMiner && minerals.length > 0 && groupedCreeps.get(MINERAL_MINER).length < creepNumbers.mineralMiner.number) {
            newName = 'MineralMiner' + Game.time;
            spawn.spawnCreep(creepNumbers.mineralMiner.body, newName,
              {memory: {role: MINERAL_MINER}});
        } else if (groupedCreeps.get(UPGRADER).length < creepNumbers.upgraders.number) {
            newName = 'Upgrader' + Game.time;
            spawn.spawnCreep(creepNumbers.upgraders.body, newName,
              {memory: {role: UPGRADER}});
        } else if (groupedCreeps.get(ATTACKER).length < 0 && room.name === "W39N33") {
            newName = 'Attacker' + Game.time;
            creepArray = [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
            spawn.spawnCreep(creepArray, newName,
              {memory: {role: ATTACKER}});
        } else if (groupedCreeps.get(CALIMER).length < 0 && room.name === "W38N35") {
            newName = 'Claimer' + Game.time;
            creepArray = creepNumbers.claimer.body;
            spawn.spawnCreep(creepArray, newName,
              {memory: {role: CALIMER}});
        } else if (hostalCreep_W38N34 && hostalCreep_W38N34.length === 0 && groupedCreepsAll && (!groupedCreepsAll.get(BUILDER_HELPER) || groupedCreepsAll.get(BUILDER_HELPER).length < 1) && room.name === "W38N35") {
            newName = 'BuilderHelper' + Game.time;
            spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK,
                  WORK, WORK, WORK, WORK, WORK,
                  WORK, WORK, WORK, WORK, WORK,
                  CARRY, CARRY, CARRY, CARRY, CARRY,
                  CARRY, CARRY, CARRY, CARRY, CARRY,
                  CARRY, CARRY, CARRY, CARRY, CARRY,
                  MOVE, MOVE, MOVE, MOVE, MOVE,
                  MOVE, MOVE, MOVE, MOVE, MOVE,
                  MOVE, MOVE, MOVE, MOVE, MOVE,
                  MOVE, MOVE, MOVE, MOVE, MOVE], newName,
              {memory: {role: BUILDER_HELPER}});
        } else if (hostalCreep_W38N34 && hostalCreep_W38N34.length === 0 && groupedCreepsAll && (!groupedCreepsAll.get(UPGRADER_HELPER) || groupedCreepsAll.get(UPGRADER_HELPER).length < 0) && room.name === "W38N35") {
            newName = 'upgraderHelper' + Game.time;
            spawn.spawnCreep([WORK, WORK, WORK, WORK, WORK,
                  WORK, WORK, WORK, WORK, WORK,
                  WORK, WORK, WORK, WORK, WORK,
                  CARRY, CARRY, CARRY, CARRY, CARRY,
                  CARRY, CARRY, CARRY, CARRY, CARRY,
                  CARRY, CARRY, CARRY, CARRY, CARRY,
                  MOVE, MOVE, MOVE, MOVE, MOVE,
                  MOVE, MOVE, MOVE, MOVE, MOVE,
                  MOVE, MOVE, MOVE, MOVE, MOVE], newName,
              {memory: {role: UPGRADER_HELPER}});
        }
        else if (groupedCreeps.get(DEFENDER).length< 0 && hostileCreep > 0) {
            newName = 'Defender' + Game.time;
            creepArray = [CLAIM, CLAIM, MOVE, MOVE];
            spawn.spawnCreep(creepArray, newName,
              {memory: {role: DEFENDER}});
        }
    }

};

function getCreepConfig(totalEnergy, role) {

}

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
