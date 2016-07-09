
module.exports = function() {
    
    if(Game.time % 10 == 0){
        for(var creep in Memory.creeps){
            
            if(!Game.creeps[creep]){
                // Oddball, a bunch of active creeps memory got deleted, so delete only if they fail the find 2x.
                if(Memory.creeps[creep].safeToDelete){
                    delete Memory.creeps[creep];
                } else {
                    Memory.creeps[creep].safeToDelete = true;
                }
            }
        }
    };
    

};