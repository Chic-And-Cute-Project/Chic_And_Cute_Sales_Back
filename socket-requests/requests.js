module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('createdReservation', (arg) => {
            io.emit('updateReservationInUserView', arg);
        });
    });
}