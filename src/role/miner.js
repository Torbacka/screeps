var transporter = {
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

        let source = creep.room.find(FIND_SOURCES)[creep.memory.container];
        if (!containers[creep.memory.container].pos.isEqualTo(creep.pos)) {

            creep.moveTo(containers[creep.memory.container].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
        } else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            console.log("Working!");
        }

    }
};

module.exports = transporter;