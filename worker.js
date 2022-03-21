var size = 0;
var score = 0;
var board = new Array();

onconnect = ev => {
	const [port] = ev.ports;
	port.onmessage = event => {
		board.length = 0;
		score = 0;
		board = event.data;
		size = board.length;

		let bestMoveMap = new Array();
		for (let i = 0; i < 4; i++)
			bestMoveMap.push(0);
		
		for (let i = 0; i < 30; i++) {
			let move = maxSearch(6, true);
			bestMoveMap[move]++;
		}

		console.log(bestMoveMap);

		let largest = 0;
		for (let i = 0; i < 4; i++) {
			if (bestMoveMap[i] > bestMoveMap[largest])
				largest = i;
		}

		switch (largest) {
			case 0:
				shiftUp();
				break;
			case 1:
				shiftLeft();
				break;
			case 2:
				shiftDown();
				break;
			case 3:
				shiftRight();
				break;
		}

		port.postMessage([board, score]);
	}
};

function evaluate() {
	let maxTile = 0;
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++)
			maxTile = Math.max(board[i][j].exponent, maxTile);
	}
	return (score + 2**maxTile) / 2;
}
function maxSearch(depth, first) {
	if (depth == 0)
		return evaluate();

	let copy = new Array();
	for (let i = 0; i < size; i++) {
		let temp = new Array();
		for (let j = 0; j < size; j++)
			temp.push(board[i][j].exponent);
		copy.push(temp);
	}

	let best = 0;
	let bestMove = -1;
	let oldScore = score;

	let legalMoves = getLegalMoves();
	for (let i = 0; i < legalMoves.length; i++) {
		switch (legalMoves[i]) {
			case 0:
				shiftUp();
				break;
			case 1:
				shiftLeft();
				break;
			case 2:
				shiftDown();
				break;
			case 3:
				shiftRight();
				break;
		}

		let search = maxSearch(depth-1, false);
		if (search > best) {
			best = search;
			bestMove = legalMoves[i];
		}
		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++)
				board[i][j].exponent = copy[i][j];
		}
		score = oldScore;
	}

	return first ? bestMove : best;
}

function getLegalMoves() {
	let legalMoves = new Array();
	
	for (let i = 0; i < size; i++) {
		let done = false;
		let foundTile = false;
		let previous = 0;
		for (let j = size-1; j >= 0; j--) {
			let current = board[j][i].exponent;
			if (current > 0)
				foundTile = true;
			
			if (foundTile) {
				if (current == 0 || current == previous) {
					legalMoves.push(0);
					done = true;
					break;
				}
				previous = current;
			}
		}

		if (done) break;
	}
	for (let i = 0; i < size; i++) {
		let done = false;
		let foundTile = false;
		let previous = 0;
		for (let j = size-1; j >= 0; j--) {
			let current = board[i][j].exponent;
			if (current > 0)
				foundTile = true;
			
			if (foundTile) {
				if (current == 0 || current == previous) {
					legalMoves.push(1);
					done = true;
					break;
				}
				previous = current;
			}
		}

		if (done) break;
	}
	for (let i = 0; i < size; i++) {
		let done = false;
		let foundTile = false;
		let previous = 0;
		for (let j = 0; j < size; j++) {
			let current = board[j][i].exponent;
			if (current > 0)
				foundTile = true;
			
			if (foundTile) {
				if (current == 0 || current == previous) {
					legalMoves.push(2);
					done = true;
					break;
				}
				previous = current;
			}
		}

		if (done) break;
	}
	for (let i = 0; i < size; i++) {
		let done = false;
		let foundTile = false;
		let previous = 0;
		for (let j = 0; j < size; j++) {
			let current = board[i][j].exponent;
			if (current > 0)
				foundTile = true;
			
			if (foundTile) {
				if (current == 0 || current == previous) {
					legalMoves.push(3);
					done = true;
					break;
				}
				previous = current;
			}
		}

		if (done) break;
	}

	return legalMoves;
}

function shiftUp() {
	let success = false;
	let merged = new Array();
    for (let i = 1; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j].exponent == 0) continue;

            let maxSquare = i;
            for (let k = i - 1; k >= 0; k--) {
                if (board[k][j].exponent > 0) break;
                maxSquare = k;
            }

            if (maxSquare > 0 && board[maxSquare-1][j].exponent == board[i][j].exponent) {
                if (!board[maxSquare-1][j].moved) {
                    merge(new Coord(maxSquare-1, j), new Coord(i, j));
                    merged.push(new Coord(maxSquare-1, j));
                    success = true;
                    continue;
                }
            }
            if (maxSquare == i) continue;

            success = true;
            board[maxSquare][j] = new Tile(board[i][j].exponent, false);
            board[i][j] = new Tile(0, false);
        }
    }

	for (let i = 0; i < merged.length; i++) {
		let coord = merged[i];
		board[coord.x][coord.y].moved = false;
	}

    if (success)
		genTile();
}
function shiftLeft() {
	let success = false;
	let merged = new Array();
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j].exponent == 0) continue;

            let maxSquare = j;
            for (let k = j - 1; k >= 0; k--) {
                if (board[i][k].exponent > 0) break;
                maxSquare = k;
            }

            if (maxSquare > 0 && board[i][maxSquare-1].exponent == board[i][j].exponent) {
                if (!board[i][maxSquare-1].moved) {
                    merge(new Coord(i, maxSquare-1), new Coord(i, j));
                    merged.push(new Coord(i, maxSquare-1));
                    success = true;
                    continue;
                }
            }
            if (maxSquare == j) continue;

            success = true;
            board[i][maxSquare] = new Tile(board[i][j].exponent, false);
            board[i][j] = new Tile(0, false);
        }
    }

    for (let i = 0; i < merged.length; i++) {
		let coord = merged[i];
		board[coord.x][coord.y].moved = false;
	}

	if (success)
		genTile();
}
function shiftDown() {
	let success = false;
	let merged = new Array();
    for (let i = size-1; i >= 0; i--) {
        for (let j = 0; j < size; j++) {
            if (board[i][j].exponent == 0) continue;

            let maxSquare = i;
            for (let k = i + 1; k < size; k++) {
                if (board[k][j].exponent > 0) break;
                maxSquare = k;
            }

            if (maxSquare < size-1 && board[maxSquare+1][j].exponent == board[i][j].exponent) {
                if (!board[maxSquare+1][j].moved) {
                    merge(new Coord(maxSquare+1, j), new Coord(i, j));
                    merged.push(new Coord(maxSquare+1, j));
                    success = true;
                    continue;
                }
            }
            if (maxSquare == i) continue;

            success = true;
            board[maxSquare][j] = new Tile(board[i][j].exponent, false);
            board[i][j] = new Tile(0, false);
        }
    }

	for (let i = 0; i < merged.length; i++) {
		let coord = merged[i];
		board[coord.x][coord.y].moved = false;
	}

    if (success)
		genTile();
}
function shiftRight() {
	let success = false;
	let merged = new Array();
    for (let i = 0; i < size; i++) {
        for (let j = size-1; j >= 0; j--) {
            if (board[i][j].exponent == 0) continue;

            let maxSquare = j;
            for (let k = j + 1; k < size; k++) {
                if (board[i][k].exponent > 0) break;
                maxSquare = k;
            }

            if (maxSquare < size-1 && board[i][maxSquare+1].exponent == board[i][j].exponent) {
                if (!board[i][maxSquare+1].moved) {
                    merge(new Coord(i, maxSquare+1), new Coord(i, j));
                    merged.push(new Coord(i, maxSquare+1));
                    success = true;
                    continue;
                }
            }
            if (maxSquare == j) continue;

            success = true;
            board[i][maxSquare] = new Tile(board[i][j].exponent, false);
            board[i][j] = new Tile(0, false);
        }
    }

    for (let i = 0; i < merged.length; i++) {
		let coord = merged[i];
		board[coord.x][coord.y].moved = false;
	}

    if (success)
		genTile();
}

function merge(originalTile, addedTile) {
    board[originalTile.x][originalTile.y].exponent++;
    board[originalTile.x][originalTile.y].moved = true;
    board[addedTile.x][addedTile.y].exponent = 0;

	score += 2 ** board[originalTile.x][originalTile.y].exponent;
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

class Tile {
	constructor(exponent, merged) {
	  	this.exponent = exponent;
	  	this.merged = merged;
	}
}
class Coord {
	constructor(x, y) {
		this.x = x;
		this.y = y;
  }
}