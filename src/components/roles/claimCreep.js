let moveUtil = require('../../util/moveUtil.js');

var roleRemoteHarvester = {

    /** @param {Creep} creep  @param {Boolean} claim  @param {Room} toRoom**/
    run: function(creep, claim = false) {
        moveUtil.moveToRoom(creep, creep.memory.room, claiming, claim);
	}
};

/** @param {Creep} creep @param {Boolean} claim**/
function claiming(creep, claim) {
    if(creep.room.controller) {
       
        if (claim) {
            if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleRemoteHarvester;