

const roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {
        const extractors = creep.room.find(FIND_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_EXTRACTOR
        });
        if (extractors.length === 0) return

        const container = extractors[0].pos.findClosestByRange(FIND_STRUCTURES, {
            filter: structure => structure.structureType === STRUCTURE_CONTAINER
        });
        const mineral = creep.room.find(FIND_MINERALS)[0]
        if (!(creep.pos.x === container.pos.x && creep.pos.y === container.pos.y) || creep.harvest(mineral) === ERR_NOT_IN_RANGE) {
            creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};

module.exports = roleHarvester;
