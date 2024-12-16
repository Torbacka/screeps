const roleDestroyer = {

    /**
     * Creep that help with dismantling structures to recover resources
     *
     * @param {Creep} creep
     * **/
    run: function (creep) {
        creep.memory.objectToDestroy = "675de70a39db8bb74faab29c";
        if (creep.memory.destroying && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.destroying = true;
            creep.say('🔄 harvest');
        }
        if (!creep.memory.destroying && creep.store.getFreeCapacity() === 0) {
            creep.memory.destroying = false;
            creep.say('⚡ destroying');
        }

        if (creep.memory.destroying) {
            const objectToDestroy = Game.getObjectById(creep.memory.objectToDestroy);
            if (objectToDestroy !== null) {
                if (creep.dismantle(objectToDestroy) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(objectToDestroy, {visualizePathStyle: {stroke: '#d02121'}});
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

module.exports = roleDestroyer;