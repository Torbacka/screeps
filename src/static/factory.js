/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tower');
 * mod.thing == 'a thing'; // true
 */

const factory = {

    produce: function (factory) {
        if (factory.cooldown > 0) return;
        if (factory.store.getUsedCapacity(RESOURCE_ENERGY) === 0) return;
        if (factory.store.getUsedCapacity(RESOURCE_LEMERGIUM) > 0 && ((factory.store.getUsedCapacity(RESOURCE_BIOMASS) / factory.store.getUsedCapacity(RESOURCE_LEMERGIUM_BAR) >= 5) || factory.store.getUsedCapacity(RESOURCE_BIOMASS) === 0)) {
            console.log("Producing Lemergium bar: " + factory.produce(RESOURCE_LEMERGIUM_BAR));
        } else if (factory.store.getUsedCapacity(RESOURCE_BIOMASS) > 100) {
            console.log("Producing Biomass: " + factory.produce(RESOURCE_CELL));
        }
    }
};


module.exports = factory;


