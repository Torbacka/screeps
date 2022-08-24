/** @param {String[]} roomsAviable @param {Creep[]} room **/
export function filterRooms(roomsAviable, creepArray) {
    for (const _creep of creepArray) {
        const indexOfRoom = roomsAviable.indexOf(_creep.memory.room);
        if (indexOfRoom > -1) {
            roomsAviable.splice(indexOfRoom, 1);
        }
    }
    return roomsAviable;
}