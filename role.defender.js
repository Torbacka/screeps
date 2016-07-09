var roleDefender = {

    /** @param {Creep} creep **/
    run: function(creep) {
       
       
        var enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if(enemies.length > 0 ){
            if(creep.attack(enemies[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemies[0]);
            }
        } else {
            var flags = creep.room.find(FIND_FLAGS);
            creep.moveTo(flags[0]);
            
        }
        
    }
    
};

module.exports = roleDefender;