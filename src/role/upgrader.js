const upgrader = {

    /** @param {Creep} creep *
     * @param source
     */
    run: function (creep, source = null) {
        let storage = creep.room.storage;
        let terminal = creep.room.terminal;
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
            if (storage && storage.store[RESOURCE_ENERGY]  > 150000 && terminal && terminal.store[RESOURCE_ENERGY] < 100000) {
                if(creep.transfer(terminal, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            if (storage && storage.store[RESOURCE_ENERGY] > 0) {
                 if (creep.withdraw(storage, RESOURCE_ENERGY) === OK) {

                } else if (storage.store[RESOURCE_ENERGY] > 0 && creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
            else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = upgrader;
