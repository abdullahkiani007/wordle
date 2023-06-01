const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Serve static files from the "public" directory
app.use(express.static("public"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

let wordToGuess;
let guesses = [];

// Generate a random word for players to guess
function generateWord() {
  const words = ["apple", "banana", "cherry", "orange", "grape"];
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

// Handle new connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Generate a new word when a player joins the game
  if (!wordToGuess) {
    wordToGuess = generateWord();
    guesses = [];
    console.log(wordToGuess);
  }

  // Send the word length to the player
  socket.emit("wordLength", wordToGuess.length);

  // Handle player guesses
  socket.on("guess", (guess) => {
    // Add the guess to the list
    guesses.push(guess);

    // Check if the guess is correct
    if (guess === wordToGuess) {
      io.emit("winner", socket.id);
      wordToGuess = null;
      guesses = [];
    }
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
