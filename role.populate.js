var rolePopulate = {

    /** @param {Spawn} spawn **/
    run: function(spawn) {
        // Ensure each creep role is above its minimum population level in an area around each spawn
    
        var roles =  { 'upgrader':[], 'builder':[], 'defender':[] ,'transporter':[], 'harvester':[]};
        
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            var role = creep.memory.role;
            roles[role].push(creep);
        }
        for(var name in roles) {
            
            if (roles[name].length < spawn.memory.minPopulation[name]) {
                // Missing creeps, spawn them
                if(name === 'builder') {
                 var source = 1;  
                } else if(name === 'harvester'){
                    var lengthList = role[name].length;
                    var lastSource = role[name][lengthList-1].sourceNr;
                    source = lastSource === 0 ? 1 : 0;;
                } else if(name === 'transporter'){
                    source = 1;
                }  else if(name === 'upgrader'){
                    source = 1;
                } else if(name === 'defender'){
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