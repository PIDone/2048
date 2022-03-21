const aiButton = document.getElementById("aiButton");

function resizeQuery() {
	if (aiStatus) return;
	const input = window.prompt("Enter new size as integer: ");
	if (input == "" || input == null) return;
	const newSize = parseInt(input);
	if (isNaN(newSize))
		alert("Please enter a valid integer");
	else {
		size = newSize;
		resize();
		reset();
	}
}

function canvasResize() {
	if (aiStatus) return;
	const input = window.prompt("Enter new size as integer: ");
	if (input == "" || input == null) return;
	const newSize = parseInt(input);
	if (isNaN(newSize))
		alert("Please enter a valid integer");
	else {
		canvasSize = newSize;
		resize();
		displayInit();
		draw();
	}
}

function changeThinkingTime() {
	if (aiStatus) return;
	const input = window.prompt("Enter new time in milliseconds: ");
	if (input == "" || input == null) return;
	const newTime = parseInt(input);
	if (isNaN(newTime))
		alert("Please enter a valid integer");
	else
		thinkingTime = newTime;
}

function toggleAI() {
	aiButton.textContent = aiStatus ? "Start AI" : "Stop AI";
	aiStatus = !aiStatus;

	if (!aiStatus)
		return;

	const worker = new SharedWorker("worker.js");

	worker.port.start();
	worker.port.postMessage([board, thinkingTime]);

	worker.port.onmessage = (event) => {
		board = event.data[0];
		score += event.data[1];
		draw();

		if (aiStatus)
			worker.port.postMessage([board, thinkingTime]);
	};
}