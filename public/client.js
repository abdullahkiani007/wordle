const socket = io();

const wordLengthDiv = document.getElementById("word-length");
const guessInput = document.getElementById("guess-input");
const guessButton = document.getElementById("guess-button");

// Receive the word length from the server
socket.on("wordLength", (wordLength) => {
  wordLengthDiv.textContent = `Guess a word with ${wordLength} letters.`;
});

// Handle the guess button click
guessButton.addEventListener("click", () => {
  const guess = guessInput.value.trim();
  if (guess !== "") {
    socket.emit("guess", guess);
    guessInput.value = "";
  }
});

// Handle the winner announcement
socket.on("winner", (winnerId) => {
  if (socket.id === winnerId) {
    alert("Congratulations! You guessed the word correctly.");
  } else {
    alert("Game over. Someone else guessed the word correctly.");
  }
});
