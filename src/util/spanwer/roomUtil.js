function setupRoomMemory(sources, storage, roomName) {
    if (!Memory[roomName]) Memory[roomName] = {};
    if (!Memory[roomName].sourceDistanceToStorage) {
        Memory[roomName].sourceDistanceToStorage = sources
            .map(source => {
                if (storage) {
                    return source.pos.getRangeTo(storage)
                }
                return 0xff;
            }).reduce((a, b) => a + b);
        console.log("Room: " + roomName + " Source distance to storage: " + Memory[roomName].sourceDistanceToStorage);
    }
    if (!Memory[roomName].factory) {
        const factories = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {  filter: { structureType: STRUCTURE_FACTORY } });
        if (factories.length > 0) {
            Memory[roomName].factory = factories[0].id;
        }
    }
}

/**
 * Assigns a source to a generalist creep
 * @param {Room} room
 * @returns {string}
 */
function assignSource (room) {
    const generalists = _.filter(Game.creeps, creep => creep.memory.role === 'generalist');
    const assignedCounts = _.countBy(generalists, creep => creep.memory.source);
    const sources = {};
    for (const source of room.find(FIND_SOURCES)) {
        sources[source.id] = countFreeSpots(room, source);
    }
    for (const [key, value] of Object.entries(sources)) {
        if (assignedCounts[key] === undefined || assignedCounts[key] < value) {
            return key;
        }
    }
}

function countFreeSpots(room, source) {
    if (!source) return 0;

    const terrain = room.getTerrain();
    let freeSpots = 0;
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx === 0 && dy === 0) continue;

            const x = source.pos.x + dx;
            const y = source.pos.y + dy;

            if (terrain.get(x, y) !== TERRAIN_MASK_WALL) {
                freeSpots++;
            }
        }
    }
    return freeSpots;
}


module.exports = {
    assignSource,
    setupRoomMemory
};
