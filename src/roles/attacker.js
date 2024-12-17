const roleAttacker = {

    /** @param {Creep} creep **/
    run: function (creep) {
        const hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
        if (hostiles.length > 0) {
            // Select the first hostile creep as the target
            const target = creep.pos.findClosestByPath(hostiles);

            if (target) {
                // Check if the creep is in range to attack
                if (creep.attack(target) === ERR_NOT_IN_RANGE) {
                    // Move closer to the target if not in range
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
                }
            }
        } else {
            // No hostiles found, optional fallback behavior
            creep.moveTo(Game.flags.DefendFlag || creep.room.controller, { visualizePathStyle: { stroke: '#00ff00' } });
        }

    }
};

module.exports = roleAttacker;
