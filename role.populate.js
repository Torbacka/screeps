var rolePopulate = {

    /** @param {Spawn} spawn **/
    run: function(spawn) {
        // Ensure each creep role is above its minimum population level in an area around each spawn
    
        var roles =  { 'upgrader':0, 'builder':0, 'defender':0 ,'transporter':0, 'harvester':0};
        
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            var role = creep.memory.role;
            roles[role]++;
        }
        for(var name in roles) {
            
            if (roles[name] < spawn.memory.minPopulation[name]) {
                // Missing creeps, spawn them
                if(name === 'builder') {
                 var source = 1;  
                } else {
                    source = 0;
                } 
                if(typeof spawn.createCreep(spawn.memory.creepSpecs[name], undefined, {'role': name, transfering:false, sourceNr:source}) === 'string' ) {
                    console.log(name+": " + roles[name]);
                }
            }
        }
    }
    
}

module.exports = rolePopulate;