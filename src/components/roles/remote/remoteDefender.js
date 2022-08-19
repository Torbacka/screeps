var roleRemoteDefender = {

    /** @param {Creep} creep **/
    run: function(creep, toRoom) {
        let exitDir = creep.room.findExitTo(toRoom);
        let exit = creep.pos.findClosestByPath(exitDir);
        console.log("Room" + JSON.stringify(creep.room.name) + "  " + toRoom)
        if (creep.room.name !== toRoom) {
            creep.moveTo(exit, { visualizePathStyle: { stroke: '#ffaa00' } });
        } else {
            defend(creep);
        }
	}
};

module.exports = roleRemoteDefender;

/** @param {Creep} creep **/
function defend(creep) {
    const hostiles = creep.room.find(FIND_HOSTILE_CREEPS).sort((enemy1, enemy2) => {
        let healingPars1 = enemy1.body.filter((part) => {
            return part.type === HEAL
        });
        let healingPars2 = enemy2.body.filter((part) => {
            return part.type === HEAL
        });
        let attackPart1 = enemy1.body.filter((part) => {
            return part.type === ATTACK
        });
        let attackPart2 = enemy2.body.filter((part) => {
            return part.type === ATTACK
        });
        return (healingPars2.length - healingPars1.length) || (attackPart2.length - attackPart1.length);
    });
    console.log("hostitles: " + JSON.stringify(hostiles));
    if(hostiles) {
        if(creep.attack(hostiles) == ERR_NOT_IN_RANGE) {
            creep.moveTo(hostiles);
        }
    }
};