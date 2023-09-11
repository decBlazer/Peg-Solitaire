// Declare global variables

// directions object takes the number the user inputs for direction and converts it
// Up and down traverses the column
// Left and right traverses the row
const directions = {
  1: [-1, 0], // Up
  2: [1, 0], // Down
  3: [0, -1], // Left
  4: [0, 1] // Right
};
// Enables prompt to be used to ask for user input
var prompt = require('prompt-sync')();
let direction = 0;
let userRow = 0;
let userColumn = 0;

// The boards do not need to be zero indexed because the number labels act as the "zero".

// Cross
const crossBoard = [
    [" ", 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, "#", "#", "#", "@", "@", "@", "#", "#", "#"],
    [2, "#", "#", "#", "@", "@", "@", "#", "#", "#"],
    [3, "@", "@", "@", "@", "@", "@", "@", "@", "@"],
    [4, "@", "@", "@", "@", "-", "@", "@", "@", "@"],
    [5, "@", "@", "@", "@", "@", "@", "@", "@", "@"],
    [6, "#", "#", "#", "@", "@", "@", "#", "#", "#"],
    [7, "#", "#", "#", "@", "@", "@", "#", "#", "#"],
  ];

// Circle
const circleBoard = [
    [" ", 1, 2, 3, 4, 5, 6],
    [1, "#", "-", "@", "@", "-", "#"],
    [2, "-", "@", "@", "@", "@", "-"],
    [3, "@", "@", "@", "@", "@", "@"],
    [4, "@", "@", "@", "@", "@", "@"],
    [5, "-", "@", "@", "@", "@", "-"],
    [6, "#", "-", "@", "@", "-", "#"],
    ];

// Triangle
const triangleBoard = [
      [" ", 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, "#", "#", "#", "-", "@", "-", "#", "#", "#"],
      [2, "#", "#", "-", "@", "@", "@", "-", "#", "#"],
      [3, "#", "-", "@", "@", "-","@", "@", "-", "#"],
      [4, "-", "@", "@", "@", "@", "@", "@", "@", "-"],
    ];

// Simple T
const simpleTBoard = [
        [" ", 1, 2, 3, 4, 5],
        [1, "-", "-", "-", "-", "-"],
        [2, "-", "@", "@", "@", "-"],
        [3, "-", "-", "@", "-", "-"],
        [4, "-", "-", "@", "-", "-"],
        [5, "-", "-", "-", "-", "-"],
      ];

// Board selection is put into an array and user selects a number 1-4.
let newBoard = [crossBoard, circleBoard, triangleBoard, simpleTBoard];


// Code starts here


console.log("  Welcome to Peg Solitaire! \n=============================");
console.log("Menu: \n 1): Cross \n 2): Circle \n 3): Triangle \n 4): Simple T \n");

// Added prompt-sync package
// Board only needs to called once per run, so it is out of any function.
let menuNumber = prompt("Choose a board: ");

playGame();

// Drives entire application
function playGame() {
while (true) {
if (menuNumber == 1 || menuNumber == 2 || menuNumber == 3 || menuNumber == 4) {
    // Account for zero-indexed array
    selectedBoard = newBoard[menuNumber - 1]; 
    console.log("You have chosen board " + menuNumber + "\n");
    printBoard(selectedBoard);
    console.log("\n@ is a peg, - is an empty space, and # is blank space around the board.")
    askForInput();
    break;
    
    } else {
    console.log("Not a valid option, choose an integer between 1-4.");
    menuNumber = prompt("Choose a board: ");
    }
  }
}



// Returns a valid integer from the user

function askForInput() {
 userColumn = parseInt(prompt("Choose the COLUMN as an integer between 1 and " + (selectedBoard[0].length - 1) + ". "));
  
  while (Number.isNaN(userColumn) || userColumn <= 0 && userColumn > selectedBoard.length) {
    userColumn = parseInt(prompt("Not valid. Choose the COLUMN as an integer between 1 and " + (selectedBoard[0].length - 1) + ". "));
  }
  
userRow = parseInt(prompt("Choose the ROW as an integer between 1 and " + (selectedBoard.length - 1) + ". "));
while (Number.isNaN(userRow) || userRow <= 0 && userColumn > selectedBoard.length) {
    userRow = parseInt(prompt("Not valid. Choose the ROW as an integer between 1 and " + (selectedBoard.length - 1) + ". "));
}
  
  if (validPosition(userRow, userColumn, selectedBoard)) {
    console.log("Chosen position is valid.");
    direction = parseInt(prompt("Choose the DIRECTION: 1) UP 2) DOWN 3) LEFT 4) RIGHT "));
    
      while (direction <= 0 || direction >= 5) {
        direction = parseInt(prompt("Not valid. Choose the direction as an integer between 1 and 4: "));
  
       } if (direction == 1 || direction == 2 || direction == 3 || direction == 4) {
      pegMove(selectedBoard, userRow, userColumn, direction);
      
    }
    else {
      console.log("Invalid direction, please choose between 1-4: ")
      askForInput();
    }
  
  } else {
    console.log("Invalid position, please choose a valid row and column.");
    askForInput(); // Ask for input again
  }
}

// Reads a single peg jump move in from the user

function pegMove(selectedBoard, userRow, userColumn, direction) {
   // rowIndex and columnIndex are the direction a peg should go based off the user input for the variable direction
  const [rowIndex, columnIndex] = directions[direction];
  // jumpedRow and jumpedColumn is the removed peg that is traversed over
  const jumpedRow = userRow + rowIndex;
  const jumpedColumn = userColumn + columnIndex;
  // newRow and newColumn is where the peg originally chosen by the user ends up. rowIndex and columnIndex is multiplied by two because there are 2 units of space between the start and end peg.
  const newRow = userRow + (rowIndex * 2);
  const newColumn = userColumn + (columnIndex * 2);

  // Checks validity of given inputs.
  if (validMove(selectedBoard, userRow, userColumn, direction) &&
    // Checks if the start and end pegs actually have a peg in it.
    selectedBoard[userRow][userColumn] === "@" &&
    selectedBoard[jumpedRow][jumpedColumn] === "@" &&
    // Checks if the end and jumped pegs aren't out of bounds.
    validPosition(newRow, newColumn, selectedBoard) &&
    validPosition(jumpedRow, jumpedColumn, selectedBoard)) {

    // Applies move to the board
    
    // Turns start peg into an empty space, end space into a peg, and jumped peg into an empty space
    selectedBoard[userRow][userColumn] = "-";
    selectedBoard[newRow][newColumn] = "@";
    selectedBoard[jumpedRow][jumpedColumn] = "-";
    
    console.log("Move successful");
    printBoard(selectedBoard);

    // This is the victory condition that checks if there is 1 peg left on the board, which is how you win the game. 
    if (countPegs(selectedBoard) === 1) {
      console.log("Congratulations! You finished the board successfully!");
      process.exit();
    }
    // This is the game over condition that checks if there are any valid moves remaining to make.
    if (!remainingMoves(selectedBoard)) {
      console.log("No remaining valid moves. Game over.");
      process.exit();
    }
    
    askForInput();
    return true; 
    
  } else {
    console.log("Invalid move, please try again.");
    askForInput();
    return false;
  }
}

// Checks move validity

function validMove(selectedBoard, userRow, userColumn, direction) {
  // rowIndex and columnIndex are the direction a peg should go based off the user input for the variable direction
  const [rowIndex, columnIndex] = directions[direction];
  // jumpedRow and jumpedColumn is the removed peg that is traversed over
  const jumpedRow = userRow + rowIndex;
  const jumpedColumn = userColumn + columnIndex;
  // newRow and newColumn is where the peg originally chosen by the user ends up. rowIndex and columnIndex is multiplied by two because there are 2 units of space between the start and end peg.
  const newRow = userRow + (rowIndex * 2);
  const newColumn = userColumn + (columnIndex * 2);

  // 4 conditions to check if a move is valid. If any of the conditions return false, then the move is invalid.
  if (!validPosition(newRow, newColumn, selectedBoard) ||
      !validPosition(jumpedRow, jumpedColumn, selectedBoard) ||
      selectedBoard[jumpedRow][jumpedColumn] !== "@" ||
      selectedBoard[newRow][newColumn] !== "-") {
    console.log("Invalid move, please try again.");
    askForInput();
    return false;
  }

  return true;
}
// Checks if the user input is out of bounds
function validPosition(userRow, userColumn, selectedBoard) {
  const numRows = selectedBoard.length;
  const numColumns = selectedBoard[0].length;

  return userRow >= 0 && userRow < numRows && userColumn >= 0 && userColumn < numColumns;
  
}

// Returns an array, initialized according to a specific board type & prints out contents of board for player to see
function printBoard(selectedBoard) {
  selectedBoard = newBoard[menuNumber - 1]
  for (let row of selectedBoard) {
    console.log(row.join(''));
  }
}

// Counts number of possible moves still available
function remainingMoves(selectedBoard) {
  // For loop is used to iterate through the board and see what is valid.
  for (let row = 1; row < selectedBoard.length; row++) {
    for (let column = 1; column < selectedBoard[row].length; column++) {
      if (selectedBoard[row][column] === "@") {
        for (let direction = 1; direction <= 4; direction++) {
          const [rowIndex, columnIndex] = directions[direction];
          const jumpedRow = row + rowIndex;
          const jumpedColumn = column + columnIndex;
          const newRow = row + (rowIndex * 2);
          const newColumn = column + (columnIndex * 2);

          if (validPosition(newRow, newColumn, selectedBoard) &&
              validPosition(jumpedRow, jumpedColumn, selectedBoard) &&
              selectedBoard[jumpedRow][jumpedColumn] === "@" &&
              selectedBoard[newRow][newColumn] === "-") {
            // There is at least one valid move.
            return true;
          }
        }
      }
    }
  }
  // There are no valid moves remaining.
  return false;
}

// Counts the number of pegs left
function countPegs(selectedBoard) {
  let pegCount = 0;
  // For loop to iterate through the board and look for pegs. If a peg is found, it will add to pegCount.
  for (let row = 0; row < selectedBoard.length; row++) {
    for (let column = 0; column < selectedBoard[row].length; column++) {
      if (selectedBoard[row][column] === "@") {
        pegCount++;
      }
    }
  }
  return pegCount;
}


