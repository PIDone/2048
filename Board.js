var size = 4;

var board = [];
var score = 0;

function decode(text) {
	board = [];
	let split = text.split(" ");
	for (let i = 0; i < size; i++) {
		let row = [];
		for (let j = 0; j < size; j++)
			row.push(parseInt(split[i * size + j]));
		board.push(row);
	}
	score = split[split.length - 1];
}