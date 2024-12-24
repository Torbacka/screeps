function getTargets(creep) {
    // Find terminal construction sites
    const terminalConstructionTarget = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
        filter: site => site.structureType === STRUCTURE_TERMINAL
    });

    // If no terminal construction site is found, fall back to other construction sites
    const generalConstructionTarget = terminalConstructionTarget
        ? terminalConstructionTarget
        : creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

    // Find low-energy towers
    const lowEnergyTowers = creep.room.find(FIND_MY_STRUCTURES, {
        filter: structure =>
            structure.structureType === STRUCTURE_TOWER &&
            structure.store.getCapacity(RESOURCE_ENERGY) - structure.store[RESOURCE_ENERGY] >= 200
    });

    return {
        constructionTarget: generalConstructionTarget,
        lowEnergyTowers
    };
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
            if (creep.room.storage.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
                const terminal = creep.room.terminal;
                if (creep.withdraw(terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal);
                }
            } else {
                if (creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage); // Move to the ruin if it's not in range
                }
            }
        }
    }
};

module.exports = roleBuilder;
