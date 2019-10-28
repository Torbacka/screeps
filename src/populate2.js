require('constants');

const populate = {
    run: function (room) {
        let creepsInRoom = room.find(FIND_MY_CREEPS);
        let constructionSties = room.find(FIND_MY_CONSTRUCTION_SITES);
        let groupedStructures = groupBy(room.find(FIND_MY_STRUCTURES), structure => structure.structureType);
        let groupedCreeps = groupBy(creepsInRoom, creep => creep.memory.role);
        ROLES.forEach(role => {
            if (!groupedCreeps.has(role)) {
                groupedCreeps.set(role, []);
            }
        });
        let populateConfig = getConfigBasedOnEnergy(room.energyCapacityAvailable);

        let filterProps = {
            'constructionSties': constructionSties.length,
            'groupedStructures': groupedStructures
        };
        room.spawns.forEach((spawn) => {
            let roles = Object.keys(populateConfig).filter((key, value) => {
                return key in ROLES && value.filter(filterProps)
            });
            for (let role in roles) {
                if (groupedCreeps.get(role).length < role.numbers) {
                    let newName = role + Game.time;
                    if (populateConfig[role].body) {
                        spawn.spawnCreep(populateConfig[role].body, newName,
                          {memory: {role: role}});
                    } else {
                        spawn.spawnCreep(populateConfig.default_body, newName,
                          {memory: {role: role}});
                    }
                }
            }

        });
    }
};

const MINER_CONFIG = {
    'numbers': 2,
    'body': createBody({
        CARRY: 17,
        MOVE: 9
    }),
    'filter': (props) => {
        return props.groupedStructures.has(STRUCTURE_CONTAINER) && props.groupedStructures.get(STRUCTURE_CONTAINER).length > 0
    }
};

const MINERAL_MINER_CONFIG = {
    'numbers': 1,
    'body': createBody({
        WORK: 30,
        MOVE: 15
    }),
    'filter': (props) => {
        return props.groupedStructures.has(STRUCTURE_TERMINAL) &&
               props.groupedStructures.has(STRUCTURE_CONTAINER) &&
               props.groupedStructures.get(STRUCTURE_CONTAINER).length >= 3
    }
};

const POPULATE_CONFIG = new Map([
    [300, {
        'default_body': createBody({
            WORK: 1,
            CARRY: 1,
            MOVE: 2
        }),
        HARVESTERS: {
            'numbers': 5
        }, UPGRADER: {
            'numbers': 5
        }, BUILDER: {
            'number': 5
        }
    }],
    [550, {
        'default_body': createBody({
            WORK: 2,
            CARRY: 2,
            MOVE: 4
        }),
        HARVESTERS: {
            'numbers': 5
        }, UPGRADER: {
            'numbers': 5
        }, BUILDER: {
            'number': 5,
            'filter': (props) => {
                return props.constructionSites > 0
            }
        }
    }],
    [800, {
        'default_body': createBody({
            WORK: 2,
            CARRY: 2,
            MOVE: 4
        }),
        HARVESTERS: {
            'numbers': 5
        }, UPGRADER: {
            'numbers': 5
        }, BUILDER: {
            'number': 5,
            'filter': (props) => {
                return props.constructionSites > 0
            }
        }
    }],
    [1300, {
        'default_body': createBody({
            WORK: 5,
            CARRY: 9,
            MOVE: 7
        }),
        HARVESTERS: {
            'numbers': 5
        }, UPGRADER: {
            'numbers': 5
        }, BUILDER: {
            'number': 5,
            'filter': (props) => {
                return props.constructionSites > 0
            }
        }, TRANSPORTER: {
            'numbers': 2,
            'body': createBody({
                CARRY: 17,
                MOVE: 9
            })
        }, MINER: MINER_CONFIG,
    }],
    [1800, {
        'default_body': createBody({
            WORK: 5,
            CARRY: 9,
            MOVE: 7
        }),
        HARVESTERS: {
            'numbers': 5
        }, UPGRADER: {
            'numbers': 5
        }, BUILDER: {
            'number': 3,
            'filter': (props) => {
                return props.constructionSites > 0
            }
        }, TRANSPORTER: {
            'numbers': 2,
            'body': createBody({
                CARRY: 17,
                MOVE: 9
            })
        }, MINER: MINER_CONFIG,
    }],
    [2300, {
        'default_body': createBody({
            WORK: 5,
            CARRY: 10,
            MOVE: 8
        }),
        UPGRADER: {
            'numbers': 1,
            'body': createBody({
                WORK: 15,
                CARRY: 5,
                MOVE: 10,
            })
        }, BUILDER: {
            'number': 2,
            'filter': (props) => {
                return props.constructionSites > 0
            }
        }, TRANSPORTER: {
            'numbers': 2,
            'body': createBody({
                CARRY: 30,
                MOVE: 15
            })
        }, MINER: MINER_CONFIG,
        MINERAL_MINER: {
            'numbers': 1,
            'body': createBody({
                WORK: 18,
                MOVE: 9
            })
        }
    }],
    [5300,  {
        'default_body': createBody({
            WORK: 5,
            CARRY: 10,
            MOVE: 8
        }),
        UPGRADER: {
            'numbers': 1,
            'body': createBody({
                WORK: 15,
                CARRY: 5,
                MOVE: 10,
            })
        }, BUILDER: {
            'number': 2,
            'filter': (props) => {
                return props.constructionSites > 0
            }
        }, TRANSPORTER: {
            'numbers': 2,
            'body': createBody({
                CARRY: 30,
                MOVE: 15
            })
        }, MINER: MINER_CONFIG,
        MINERAL_MINER: MINERAL_MINER_CONFIG
    }],
    [12300,  {
        'default_body': createBody({
            WORK: 5,
            CARRY: 10,
            MOVE: 8
        }),
        UPGRADER: {
            'numbers': 1,
            'body': createBody({
                WORK: 15,
                CARRY: 5,
                MOVE: 10,
            })
        }, BUILDER: {
            'number': 2,
            'filter': (props) => {
                return props.constructionSites > 0
            }
        }, TRANSPORTER: {
            'numbers': 2,
            'body': createBody({
                CARRY: 30,
                MOVE: 15
            })
        }, MINER: MINER_CONFIG,
        MINERAL_MINER: MINERAL_MINER_CONFIG
    }],
]);

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

function getConfigBasedOnEnergy(totalEnergy) {
    return new Map(
      [...POPULATE_CONFIG]
        .filter(([k]) => k < totalEnergy)
        .sort((a, b) => b[0] - a[0])
    ).values().next().value;
}

function createBody(bodyParts) {
    let body = [];
    Object.entries(bodyParts).forEach((k, v) => {
          body.push(_.fill(Array(v), k))
      }
    );
    return body;
}

module.exports = populate;