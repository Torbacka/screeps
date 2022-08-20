let moveUtil = require('../../util/moveUtil.js');

var roleRemoteHarvester = {

    /** @param {Creep} creep  @param {Boolean} claim  @param {Room} toRoom**/
    run: function(creep, toRoom = null, claim = false) {
        moveUtil.moveToRoom(creep, toRoom, claiming, claim);
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
                creep.moveTo(creep.room.getPositionAt(15,14), {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleRemoteHarvester;