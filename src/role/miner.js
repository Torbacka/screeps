var transporter = {
    run: function (creep) {
        const containers = creep.room.find(FIND_STRUCTURES, {
            filter: (i) => {
                return (i.structureType === STRUCTURE_CONTAINER)
            }
        });
        let source = creep.room.find(FIND_SOURCES)[0];
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(containers[1].pos, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};

module.exports = transporter;