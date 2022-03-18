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
			temp.push(new Tile(22, false));
		board.push(temp);
	}

	genTile();
	genTile();
}

var currentPress = 0;

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

const aiButton = document.getElementById("aiButton");

function toggleAI() {
	aiButton.textContent = aiStatus ? "Start AI" : "Stop AI";
	aiStatus = !aiStatus;

	if (!aiStatus)
		return;

	const worker = new SharedWorker("worker.js");

	worker.port.start();
	worker.port.postMessage(board);

	worker.port.onmessage = (event) => {
		board = event.data[0];
		score += event.data[1];
		draw();

		if (aiStatus)
			worker.port.postMessage(board);
	};
}