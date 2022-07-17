var size = 4;

var board = [];
var score = 0;

function decode(text) {
	board = new Array(size);
	let split = text.split(" ");
	for (let i = 0; i < size; i++) {
		let row = new Array(size);
		row.fill(0);
		board[i] = row;
	}
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++)
			board[i][j] = parseInt(split[i * size + j]);
	}
	score = split[split.length - 1];
}