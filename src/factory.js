const factory = {
    build: (room) => {
        room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {

            }
        });
    }
};

module.exports = factory;