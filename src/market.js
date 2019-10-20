const market = {
    trade: function (room) {
        if (room.terminal && (Game.time % 10 === 0)) {
            if (room.terminal.store[RESOURCE_ENERGY] > 2000) {
                const orders = Game.market.getAllOrders(order => {
                    return (order.resourceType === RESOURCE_ENERGY &&
                      order.type === ORDER_BUY &&
                      Game.market.calcTransactionCost(room.terminal.store[RESOURCE_ENERGY]*0.5, room.name, order.roomName) < 35000)
                });
                console.log("Energy buy orders found : " + orders.length);
                orders.sort((a, b) => {
                    return b.price - a.price
                });

                console.log('Best price: ' + orders[0].price);
                if (orders[0].price > 0.002) {
                    const result = Game.market.deal(orders[0].id, Math.min(orders[0].amount, room.terminal.store[RESOURCE_ENERGY]*0.5), room.name);
                    if (result === OK) {
                        console.log("Order completed successfully");
                    } else {
                        console.log("Error when trying to complete a deal.");
                    }
                }
            }
        }
    }
};


module.exports = market;