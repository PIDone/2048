var size = 0;
var squareSize = 0;
var border = 0;
var squareBorder = 0;

var score = 0;

var aiStatus = false;
var isGameOver = false;

var board = new Array();

function init() {
	isGameOver = false;
	board = new Array();

	for (let i = 0; i < size; i++) {
		let temp = new Array();
		for (let j = 0; j < size; j++) 
			temp.push(new Tile(0, false));
		board.push(temp);
	}

	genTile();
	genTile();
}

function handleKeyPress(event) {
	if (aiStatus || isGameOver) return;
	switch (event.code) {
		case "KeyW":
		case "ArrowUp":
			shiftUp();
			break;
		case "KeyA":
		case "ArrowLeft":
			shiftLeft();
			break;
		case "KeyS":
		case "ArrowDown":
			shiftDown();
			break;
		case "KeyD":
		case "ArrowRight":
			shiftRight();
			break;
		default:
			return;
	}
}

function gameOver() {
    for (let i = 0; i < size; i++) {
        let previous = -1;
        for (let j = 0; j < size; j++) {
            let current = board[i][j].exponent;
            if (current == 0) return false;
            if (current == previous) return false;
            previous = current;
        }
    }
    for (let i = 0; i < size; i++) {
        let previous = -1;
        for (let j = 0; j < size; j++) {
            let current = board[j][i].exponent;
            if (current == 0) return false;
            if (current == previous) return false;
            previous = current;
        }
    }

	isGameOver = true;
    return true;
}