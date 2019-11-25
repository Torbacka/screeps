function findFactory(creep) {
    let factoryArray = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === 'factory';
        }
    });
    return factoryArray.length > 0 ? factoryArray[0] : null;
}

const resourceManager = {
    run: (creep) => {
        let storageItems = creep.room.storage.store;
        let factory = findFactory(creep);
        let terminal = creep.room.terminal;
        let mineralType = creep.room.find(FIND_MINERALS)[0].mineralType;
        if (factory && factory.store.getFreeCapacity(RESOURCES_ALL) > 0) {



        }
    }
};

module.exports = resourceManager;