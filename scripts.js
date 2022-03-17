const BG_COLOR = "#cdc1b4";
const EDGE_COLaaaaaaaaaaaaaaaaaaaaaaaaaaaOR = "#bbada0";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var atlas = new Image();

const resetButton = document.querySelector("#reset");
const resizeButton = document.querySelector("#resize");
const aiButton = document.querySelector("#aiButton");

resetButton.addEventListener("click", () => reset());
resizeButton.addEventListener("click", () => resize());
aiButton.addEventListener("click", () => toggleAI());

function draw() {
	document.getElementById("score").textContent = "Score: "+score;

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();

	ctx.fillStyle = BG_COLOR;
	ctx.fillRect(0, 0, squareSize*size+border, squareSize*size+border);

	ctx.fillStyle = EDGE_COLOR;

	for (let i = 0; i <= size; i++)
		ctx.fillRect(i*squareSize, 0, border, squareSize*size+border);
	for (let i = 0; i <= size; i++)
		ctx.fillRect(0, i*squareSize, squareSize*size+border, border);

	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			let exponent = board[i][j].exponent;
			if (exponent == 0) continue;

			let sourceX = exponent % 4 - 1;
			let sourceY = Math.floor(exponent / 4);

			if (sourceX < 0) {
				sourceX = 3;
				sourceY--;
			}

			ctx.drawImage(atlas, sourceX*800, sourceY*800, 800, 800, j*squareSize+border+squareBorder, i*squareSize+border+squareBorder, squareSize-border-squareBorder*2, squareSize-border-squareBorder*2);
		}
	}

	if (!isGameOver && gameOver()) {
		setTimeout(function() {
			alert("Game Over! Score: "+score);
		}, 1000);
	}

	ctx.stroke();
}

function start() {
	size = 4;
	squareSize = Math.floor(500 / size);
	border = Math.floor(squareSize / 25);
	squareBorder = Math.floor(squareSize / 25);

	canvas.width = squareSize*size+border;
	canvas.height = squareSize*size+border;

	init();

	window.onkeydown = function(event) {
		handleKeyPress(event)
		draw();
	}

	atlas.src = "tiles.png";
	atlas.onload = function() {
		draw();
	}
}

function reset() {
	score = 0;
	init();
	draw();
}

function resize() {
	let newSize = parseInt(window.prompt("Enter new size as integer: "));
	if (isNaN(newSize))
		alert("Please enter a valid integer");
	else {
		size = newSize;
		squareSize = Math.floor(500 / size);
		border = Math.floor(squareSize / 25);
		squareBorder = Math.max(Math.floor(squareSize / 25), 1);

		canvas.width = squareSize*size+border;
		canvas.height = squareSize*size+border;

		reset();
	}
}

const worker = new SharedWorker("worker.js");

function toggleAI() {
	aiButton.textContent = aiStatus ? "Start AI" : "Stop AI";
	aiStatus = !aiStatus;

	let boardString = "";
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			boardString += board[i][j];
			boardString += " ";
		}
	}

	worker.port.start();
	worker.port.postMessage(board);

	worker.port.onmessage = (event) => {
		board = event.data;
		draw();
	};
}