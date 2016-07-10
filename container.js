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
        var creeps = container.pos.findInRange(FIND_MY_CREEPS, 2, {
            filter: (creep) => {
                        return (creep.memory.role === 'transporter'hitsMax*0.1);
                    }
        });
        if(creeps.length > 0 ) {
            container.transfer(creeps[0], RESOURCE_ENERGY, 200);
        }
    }

};

module.exports = container;