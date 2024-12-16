function getTargets(creep) {
    const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    const lowEnergyTowers = Game.rooms['E58S34'].find(FIND_MY_STRUCTURES, {
        filter: structure =>
            structure.structureType === STRUCTURE_TOWER &&
            structure.store.getCapacity(RESOURCE_ENERGY) - structure.store[RESOURCE_ENERGY] >= 200
    });
    return {constructionTarget: target, lowEnergyTowers};
}

const roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
            const structures = creep.room.find(FIND_STRUCTURES, {
                filter: structure => structure.structureType === STRUCTURE_WALL || structure.structureType === STRUCTURE_RAMPART
            });
            structures.sort((a, b) => a.hits - b.hits);
            creep.memory.wallTarget = structures[0].id;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            const {constructionTarget, lowEnergyTowers} = getTargets(creep);

            if (lowEnergyTowers.length > 0) {
                if (creep.transfer(lowEnergyTowers[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(lowEnergyTowers[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (constructionTarget !== null) {
                if (creep.build(constructionTarget) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionTarget, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                const target = Game.getObjectById(creep.memory.wallTarget);
                if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            const storage = creep.room.storage;

            const result = creep.withdraw(storage, RESOURCE_ENERGY);
            if (result === ERR_NOT_IN_RANGE) {
                creep.moveTo(storage); // Move to the ruin if it's not in range
            }
        }
    }
};

module.exports = roleBuilder;