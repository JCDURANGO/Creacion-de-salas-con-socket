var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const shortid = require('shortid');
var rooms = []; //arreglo de salas

//exportación de variables y métodos a otros módulos
module.exports = {
    rooms
}
socket.on('getInitRooms', () => { // cargar las salas iniciales activas
    socket.emit('setInitRooms', rooms)
});

//agregarse a una sala
socket.on('joinRoom', (idRoom) => {
    console.log(`conectado a la sala ${idRoom}`)
        //adicionamos la sala por su id a las salas del socket
    socket.join(idRoom);
    //avisamos a todos los que estan el la sala que hay un usuario nuevo
    io.sockets.in(idRoom).emit('alertNewUser', `Un nuevo usuario se ha conectado: ${socket.id}`);
    //capturamos el indice de la sala en el array de salas para modificar solo esa en el cliente
    var index = rooms.findIndex(room => room.id == idRoom);
    //agregamos el usuario que solicitó agregarse a la sala en el arreglo de jugadores de la sala
    rooms[index].players.push(newPlayer(socket.id, idRoom));
    //informamos al cliente de los cambios
    socket.emit('setRoomActive', { idRoom, rooms, index });
});

var rooms = []; //arreglo de salas

function Player(id, roomSelected) {
    this.name = `Player_${id}`; //Creamos un nombre para el jugador, lo asociamos a su id
    this.isAlive = true; //definimos que está activo
    this.roomSelected = roomSelected // y le decimos en que sala se encuentra
        //this.board = initBoard(boarSize.x, boarSize.y)
};

var newPlayer = id => new Player(id); //creamos una función que cree el nuevo jugador

//exportación de variables y métodos a otros módulos
module.exports = {
    rooms,
    newPlayer
}