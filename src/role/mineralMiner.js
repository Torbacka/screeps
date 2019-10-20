const mineralMiner = {
    run: function (creep) {
        let extractors = creep.room.find(FIND_STRUCTURES, {
            filter: (i) => {
                return (i.structureType === STRUCTURE_EXTRACTOR)
            }
        });
        if (!extractors) {
            return;
        }
        let container = extractors[0].findClosestByRange(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_CONTAINER)
            },
        });
        let target;
        if (creep.memory.depositId) {
            target = Game.getObjectById(creep.memory.depositId);
        } else {
            let targets = creep.room.find(FIND_MINERALS);
            target = targets[0];
            creep.memory.depositId = target.id;
            creep.memory.mineralType = target.mineralType;
        }

        if (!container.pos.isEqualTo(creep.pos)) {
            creep.moveTo(container.pos, {visualizePathStyle: {stroke: '#ffaa00'}});
        } else {
            let harvestResponseCode = creep.harvest(target);
            if (harvestResponseCode !== OK) {
                console.log("Room " + creep.room.name + " have some mineral mining problems: " + harvestResponseCode);
            }
        }
    }
};

module.exports = mineralMiner;