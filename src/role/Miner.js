var transporter = {
    run: function (creep) {
        const source = creep.room.find(FIND_SOURCES)[creep.memory.source];
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
};

module.exports = transporter;