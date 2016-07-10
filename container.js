/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tower');
 * mod.thing == 'a thing'; // true
 */

var container = {
    
    fill: function(container){
        var creeps = container.pos.lookFor(LOOK_CREEPS);
       
        if(creeps.length > 0 ) {
            
            container.transfer(creeps[0], RESOURCE_ENERGY, creeps[0].carryCapacity);
        }
    }

};

module.exports = container;