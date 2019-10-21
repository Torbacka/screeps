const market = {
    trade: (room) => {
        if (room.terminal && (Game.time % 10 === 0)) {
            if (room.terminal.store[RESOURCE_ENERGY] > 2000) {
                const orders = Game.market.getAllOrders(order => {
                    return (order.resourceType === RESOURCE_ENERGY &&
                      order.type === ORDER_BUY)
                });
                //console.log("Energy buy orders found : " + orders.length);
                orders.sort((a, b) => {
                    return (b.price - a.price || getCalcTransactionCost(room, a) - getCalcTransactionCost(room, b));
                });
                console.log('Order price: ' + orders[0].price +'  Order amount: ' + orders[0].amount + '  Terminal amount: ' + room.terminal.store[RESOURCE_ENERGY] +
                  '  transaction cost: ' + getCalcTransactionCost(room, orders[0]) +
                  '   order size: ' + Math.min(orders[0].amount, room.terminal.store[RESOURCE_ENERGY] -(room.terminal.store[RESOURCE_ENERGY]* getCalcTransactionCost(room, orders[0]))));
                if (orders[0].price > 0.003) {
                    const result = Game.market.deal(orders[0].id, Math.min(orders[0].amount, room.terminal.store[RESOURCE_ENERGY] -(room.terminal.store[RESOURCE_ENERGY]* getCalcTransactionCost(room, orders[0]))), room.name);
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

function getCalcTransactionCost(room, order){
    let orderAmount = Math.min(order.amount, room.terminal.store[RESOURCE_ENERGY]);
    return Game.market.calcTransactionCost(orderAmount, room.name, order.roomName)/orderAmount;
}


module.exports = market;