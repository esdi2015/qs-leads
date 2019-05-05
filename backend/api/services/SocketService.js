const socket = require('socket.io-client')('http://localhost:1340');
socket.on('connect', () => console.log('Connected to Worker successfully'));
socket.on('disconnect', () => console.log('Disconnected from Worker'));

module.exports = socket;
