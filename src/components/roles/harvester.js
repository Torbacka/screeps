var roleBuilder = require('./builder.js');
var roleUpgrader = require('./upgrader.js');
var roleTransporter = require('./transporter.js');

var harvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        const source = creep.room.find(FIND_SOURCES)[0];
        let containers = creep.room.find(FIND_STRUCTURES, {
            filter: (i) => {
                return (i.structureType === STRUCTURE_CONTAINER)
            }
        });
        if (creep.memory.harvesting && creep.store.getUsedCapacity() === 0) {
            creep.memory.harvesting = false;
            creep.memory.upgrading = false;
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.harvesting && creep.store.getUsedCapacity() === creep.store.getCapacity()) {
            creep.memory.harvesting = true;
            creep.memory.upgrading = true;
            creep.memory.building = true;
        }
        if (!creep.memory.harvesting) {
            const energy = creep.pos.findInRange(
              FIND_DROPPED_RESOURCES,
              3, { filter: (resource) => { return resource.amount > 40 }}
            );
            let container = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => { 
                if (structure.structureType === STRUCTURE_CONTAINER) {
                    return structure.store[RESOURCE_ENERGY] > 100;
                } 
                return false;
            } });
            if (energy !== null && energy.length > 0 && energy[0].amount > 20) {
                if (creep.pickup(energy[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(energy[0], {visualizePathStyle: {stroke: '#ff671a'}});
                }
            } else if (container !== null) {
                if (creep.withdraw(container, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            const extension = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION) &&
                      structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY);
                }
            });
            const spawn = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_SPAWN) &&
                      structure.store[RESOURCE_ENERGY] < structure.store.getCapacity(RESOURCE_ENERGY);
                }
            });
            if (extension != null) {
                if (creep.transfer(extension, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(extension, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (spawn != null) {
                if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}});
                }

            } else {
                
                const constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);
                const repairObject = getRepairObjects(creep);
                const towers = creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}})
                    .sort((tower1, tower2) => tower1.store[RESOURCE_ENERGY] > tower2.store[RESOURCE_ENERGY]);
                if (towers.length > 0 && towers[0].store[RESOURCE_ENERGY] < towers[0].store.getCapacity(RESOURCE_ENERGY)) {    
                    creep.say('🚢 Transfering');
                    roleTransporter.run(creep);
                } else if (repairObject !== null) {
                    if(creep.repair(repairObject) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(repairObject, {visualizePathStyle: {stroke: '#ffffff'}});
                        creep.say('repair');
                    }
                } else if (constructionSites.length) {
                    creep.say('🚧 Building');
                    roleBuilder.run(creep, source);
                } else {
                    creep.say('🚧 Upgrading');
                    roleUpgrader.run(creep, source);
                }
            }
        }
    }
};

/** @param {Creep} creep **/
function getRepairObjects(creep) {
    return creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_ROAD && structure.hits < structure.hitsMax*0.94) ||
              (structure.structureType === STRUCTURE_CONTAINER && structure.hits < structure.hitsMax*0.94) ||
              (structure.structureType === STRUCTURE_RAMPART && structure.hits < structure.hitsMax * 0.04);
        }
    });

}

module.exports = harvester;
