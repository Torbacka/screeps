const claim = {
    run: (creep, target) => {
        if (creep.room.name !== target) {
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(target)), {visualizePathStyle: {stroke: '#ffffff'}});
        } else {
            let controller = creep.room.controller;
            if (creep.reserveController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller, {visualizePathStyle: {stroke: '#2bca2b'}});
            }
        }
    }
};

module.exports = claim;