const miner = {
    run: function (creep) {
        const containers = creep.room.find(FIND_STRUCTURES, {
            filter: (i) => {
                return (i.structureType === STRUCTURE_CONTAINER)
            }
        });
        if (containers.length === 0) {
            return;
        }
        if (!creep.memory.container) {
            let creeps = creep.room.find(FIND_MY_CREEPS);
            const miners = _.filter(creeps, (creep) => creep.memory.role === 'miner');
            let container = 0;
            miners.forEach((miner) => {
                if (miner.name === creep.name) {
                    return;
                }
                if (miner.memory.container === 0) {
                    container = 1;
                } else {
                    container = 0
                }
            });
            creep.memory.container = container;
        }

        let sources = creep.room.find(FIND_SOURCES);
        let container = containers[creep.memory.container];
        let closestSource = sources[creep.memory.container];
        sources.forEach(source => {
            if (Math.abs(source.pos.x - container.pos.x) <= 1 && Math.abs(source.pos.y - container.pos.y) <= 1) {
                closestSource = source;
            }
        });
        if (!container.pos.isEqualTo(creep.pos)) {

            creep.moveTo(container.pos, {visualizePathStyle: {stroke: '#ffaa00'}});
        } else if (creep.harvest(closestSource) === ERR_NOT_IN_RANGE) {

            console.log("Working!" + Math.abs(closestSource.pos.x - container.pos.x) +"    closesetSource" + JSON.stringify(closestSource.pos));
        }

    }
};

module.exports = miner;