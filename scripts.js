const aiButton = document.getElementById("aiButton");

function resizeQuery() {
	let newSize = parseInt(window.prompt("Enter new size as integer: "));
	if (isNaN(newSize))
		alert("Please enter a valid integer");
	else {
		size = newSize;
		resize();
		reset();
	}
}

function canvasResize() {
	let newSize = parseInt(window.prompt("Enter new size as integer: "));
	if (isNaN(newSize))
		alert("Please enter a valid integer");
	else {
		canvasSize = newSize;
		resize();
		displayInit();
		draw();
	}
}

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