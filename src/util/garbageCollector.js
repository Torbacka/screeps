module.exports = function () {
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.data.remoteHarvester["E58S34"][name];
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    if (Game.time%15000) {
        const orders = Game.market.orders;
        const filteredOrders = Object.keys(orders).filter(orderId => orders[orderId].remainingAmount === 0)
        filteredOrders.forEach(orderId => {
            const result = Game.market.cancelOrder(orderId);
            if (result === OK) {
                console.log(`Order ${orderId} canceled successfully.`);
            } else {
                console.log(`Failed to cancel order ${orderId}. Error code: ${result}`);
            }
        });
        console.log("Filtered orders: " + JSON.stringify(filteredOrders));
    }

};
