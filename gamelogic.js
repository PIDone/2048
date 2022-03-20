var size = 4;
var squareSize = 125;
var border = 10;
var squareBorder = 5;

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

function start() {
	size = 4;
	reset();
	window.onkeydown = function(event) {
		handleKeyPress(event)
		draw();
	}
}

function reset() {
	score = 0;
	init();
	displayInit();
	draw();
}

function handleKeyPress(event) {
	if (aiStatus || isGameOver) return;
	switch (event.code) {
		case "KeyW":
		case "KeyI":
			shiftUp();
			break;
		case "KeyA":
		case "KeyJ":
			shiftLeft();
			break;
		case "KeyS":
		case "KeyK":
			shiftDown();
			break;
		case "KeyD":
		case "KeyL":
			shiftRight();
			break;
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

function genTile() {
	let empty = new Array();
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j].exponent == 0)
                empty.push(new Coord(i, j));
        }
    }

	if (empty.length == 0)
		return;

    let number = Math.floor(Math.random()*10) == 0 ? 2 : 1;
    let selected = Math.floor(Math.random() * empty.length);

    board[empty[selected].x][empty[selected].y].exponent = number;
}