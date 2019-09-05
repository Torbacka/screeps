const upgrader = {

    /** @param {Creep} creep *
     * @param source
     * @param target
     */
    run: function (creep, source = null, target = "W37N35") {

        if (creep.room.name !== target) {

            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(target)), {visualizePathStyle: {stroke: '#ffffff'}});
        } else {
            if (source == null) {
                source = creep.room.find(FIND_SOURCES)[0];
            }
            if (creep.memory.upgrading && creep.carry.energy === 0) {
                creep.memory.upgrading = false;
                creep.say('🔄 harvest');
            }
            if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
                creep.memory.upgrading = true;
                creep.say('🚧 upgrading');
            }
            if (creep.memory.upgrading) {

                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {

                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {

                let storage = creep.room.find(FIND_STRUCTURES, {
                    filter: (i) => {
                        return (i.structureType === STRUCTURE_STORAGE)
                    }
                });

                if (storage.length > 0) {


                    if (creep.withdraw(storage[0], RESOURCE_ENERGY) === OK) {

                    } else if (storage[0].store[RESOURCE_ENERGY] > 0 && creep.withdraw(storage[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
                else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
    }
};

module.exports = upgrader;
