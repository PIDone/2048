// CODE HERE WRITTEN BY JsonJ__

const BG_COLOR = "#cdc1b4";
const EDGE_COLOR = "#bbada0";
const BLACK = "#000000"

var table;
var canvasSize = 500;
const canvasDiv = document.getElementById("canvasDiv");

var squareSize = 125;
var squareBorder = Math.floor(squareSize / 25);

const colors = [
	"#eee4da", // 2
	"#ede0c8", // 4
	"#f2b179", // 8
	"#f59563", // 16
	"#f67c5f", // 32
	"#f65e3b", // 64
	"#e5cd85", // 128
	"#ecc400", // 256
	"#efc024", // 512
	"#e5b10b", // 1024
	"#efb600", // 2048
	"#f0666e", // 4096
	"#ec4c5b", // 8192
	"#f54044", // 16384
	"#70b4d1", // 32768
	"#619fe3", // 65536
]
const fontColors = [
	"#000000", // 2
	"#000000", // 4
	"#FFFFFF", // 8
	"#FFFFFF", // 16
	"#FFFFFF", // 32
	"#FFFFFF", // 64
	"#FFFFFF", // 128
	"#FFFFFF", // 256
	"#FFFFFF", // 512
	"#FFFFFF", // 1024
	"#FFFFFF", // 2048
	"#FFFFFF", // 4096
	"#FFFFFF", // 8192
	"#FFFFFF", // 16384
	"#FFFFFF", // 32768
	"#FFFFFF", // 65536
]
const fontSizes = [
	0.35,
	0.35,
	0.33,
	0.27,
	0.24,
	0.21,
	0.18,
]

function getTile(x, y) {
	return table.children[x].children[y].children[0];
}
function draw() {
	document.getElementById("score").textContent = "Score: "+score;
	
	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			let tile = getTile(i, j);
			while (tile.lastChild)
				tile.lastChild.remove();
		}
	}

	for (let i = 0; i < size; i++) {
		for (let j = 0; j < size; j++) {
			const exponent = board[i][j];
			if (exponent == 0)
				continue;

			let color = colors[exponent - 1];
			let fontColor = fontColors[exponent - 1];
			const len = (1 << exponent).toString().length;
			let fontSize = fontSizes[len - 1];
			if (color == undefined) {
				color = "#000000";
				fontColor = "#FFFFFF";
			}
			if (len > 7)
				fontSize = 0.225;
		
			let div = document.createElement("div");
			div.className = "centered";
			div.setAttribute("style", `
				width: ${ squareSize - squareBorder }px;
				height: ${ squareSize - squareBorder }px;
				line-height: ${ squareSize - squareBorder }px;
				color: ${ fontColor };
				font-size: ${ fontSize * (squareSize - squareBorder) }px;
				background-color: ${ color };
				position: relative;
				top: ${ squareBorder / 2 }px;
				left: ${ squareBorder / 2 }px;
				font-family: libmono`);
		
			if (len > 7)
				div.textContent = `2^${exponent.toString()}`;
			else
				div.textContent = 1 << exponent;
				
			getTile(i, j).appendChild(div);
		}
	}
}

function init() {
	if (table)
		table.remove();

	table = document.createElement("table");
	canvasDiv.appendChild(table);

	for (let i = 0; i < size; i++) {
		let row = document.createElement("tr");
		table.appendChild(row);

		for (let j = 0; j < size; j++) {
			let tile = document.createElement("th");
			let div = document.createElement("div");
			div.setAttribute("class", "tile");
			div.setAttribute("style", `width: ${ squareSize }px; height: ${ squareSize }px;`);
			row.appendChild(tile);
			tile.appendChild(div);
		}
	}

	Module["onRuntimeInitialized"] = () => {
		Module.init(size);
		decode(Module.encode());
		draw();
	};

	window.onkeydown = function(event) {
		event.view.event.preventDefault();
		let move = -1;
		switch (event.key) {
			case "ArrowUp":
			case "w":
			case "i":
				move = 0;
				break;
			case "ArrowLeft":
			case "a":
			case "j":
				move = 1;
				break;
			case "ArrowDown":
			case "s":
			case "k":
				move = 2;
				break;
			case "ArrowRight":
			case "d":
			case "l":
				move = 3;
				break;
			default:
				return;
		}
		decode(Module.shift(move));
		draw();
	}
}

function resize() {
	let input = window.prompt("Enter new size as integer: ");
	if (input == "" || input == null)
		return;
	let newSize = parseInt(input);
	if (isNaN(newSize))
		alert("Please enter a valid integer");
	else if (newSize <= 0)
		alert("Please enter a positive integer");
	else {
		size = newSize;
		squareSize = Math.floor(canvasSize / size);
		border = Math.floor(squareSize / 25) * 2;
		squareBorder = Math.floor(squareSize / 25);

		init();
		Module.init(size);
		decode(Module.encode());
		draw();
	}
}

init();