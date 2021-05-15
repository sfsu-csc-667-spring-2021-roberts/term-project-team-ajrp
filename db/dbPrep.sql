CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS lobbies (
  id SERIAL PRIMARY KEY,
  game_id SERIAL NOT NULL,
  player_id INTEGER NOT NULL,
  game_name VARCHAR(255) NOT NULL,
  createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES users(id)
);
CREATE TABLE IF NOT EXISTS games (
  id SERIAL PRIMARY KEY,
  lobby_id INTEGER NOT NULL,
  number_of_players INTEGER NOT NULL,
  ended BOOLEAN NOT NULL DEFAULT FALSE,
  createAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lobby_id) REFERENCES lobbies(id)
);
CREATE TABLE IF NOT EXISTS cards (
  id SERIAL PRIMARY KEY,
  imageURL VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL
);
CREATE TABLE IF NOT EXISTS deck (
  id SERIAL PRIMARY KEY,
  game_id INTEGER NOT NULL,
  card_id INTEGER NOT NULL,
  FOREIGN KEY (card_id) REFERENCES cards(id),
  FOREIGN KEY (game_id) REFERENCES games(id)
);



