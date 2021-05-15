const io = require("socket.io");

/********NEED TO FILL THIS IN********/
const socket = io("location of Server");

socket.on("connect", () => {
	console.log(socket.connected); 
});

socket.on("connect_error", (error) => {
	console.log(error);
});

socket.emit("moveMade", "cardID");

socket.on("moveMade", (data) => {
	console.log(data);
});

socket.disconnect();
