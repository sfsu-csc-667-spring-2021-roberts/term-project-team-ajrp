console.log("testing123");

const lobbyList = document.getElementById("lobby");

fetch("/dashboard/lobbies")
  .then(results => {
    console.log(results);
  })