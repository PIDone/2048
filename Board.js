var board = [];
var score = 0;

function decode(text) {
	board = [];
	let split = text.split(" ");
	for (let i = 0; i < 4; i++) {
		let row = [];
		for (let j = 0; j < 4; j++)
			row.push(parseInt(split[i * 4 + j]));
		board.push(row);
	}
	score = split[16];
}