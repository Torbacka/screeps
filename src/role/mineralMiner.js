const mineralMiner = {
    run: function (creep) {
        let extractors = creep.room.find(FIND_STRUCTURES, {
            filter: (i) => {
                return (i.structureType === STRUCTURE_EXTRACTOR)
            }
        });
        if (extractors[0] === null) {
            return;
        }
        const containers = creep.room.find(FIND_STRUCTURES, {
            filter: (i) => {
                return (i.structureType === STRUCTURE_CONTAINER)
            }
        });
        let closestContainer = containers[containers.length - 1];
        containers.forEach(container => {
            if (Math.abs(container.pos.x - container.pos.x) <= 1 || Math.abs(container.pos.y - container.pos.y) <= 1) {
                closestContainer = container;
            }
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
        if (closestContainer == null) {
            return;
        }
        if (!closestContainer.pos.isEqualTo(creep.pos)) {
            creep.moveTo(closestContainer.pos, {visualizePathStyle: {stroke: '#ffaa00'}});
        } else {
            let harvestResponseCode = creep.harvest(target);
            if (harvestResponseCode !== OK && harvestResponseCode !== ERR_TIRED) {
                console.log("Room " + creep.room.name + " have some mineral mining problems: " + harvestResponseCode);
            }
        }
    }
};

module.exports = mineralMiner;