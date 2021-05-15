const io = require("socket.io");

/********NEED TO FILL THIS IN********/
const socket = io("location of Server");

socket.on("connect", () => {
  console.log(socket.connected); // true
});

socket.on("connect_error", (error) => {
  // ...
});

socket.emit("hello", "world");

socket.on("news", (data) => {
  console.log(data);
});

socket.disconnect();
